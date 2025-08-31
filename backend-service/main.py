"""
Simple FastAPI backend service for LEANN frontend integration.
This provides REST API endpoints that wrap the LEANN Python API.
"""

import sys
import os
from pathlib import Path
from typing import List, Optional, Dict, Any
import json
import logging

# Add leann-core to path
current_dir = Path(__file__).parent
leann_core_path = current_dir.parent / "packages" / "leann-core" / "src"
sys.path.insert(0, str(leann_core_path))

try:
    from fastapi import FastAPI, HTTPException
    from fastapi.middleware.cors import CORSMiddleware
    from pydantic import BaseModel
    import uvicorn
except ImportError:
    print("FastAPI and dependencies not installed. Install with:")
    print("pip install fastapi uvicorn")
    sys.exit(1)

try:
    from leann.api import LeannSearcher
except ImportError as e:
    print(f"Could not import LEANN API: {e}")
    print("Make sure LEANN is properly installed")
    sys.exit(1)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="LEANN Backend Service", version="1.0.0")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global searcher instance (will be initialized on first use)
_searcher = None
_index_path = None

# Request/Response models
class SearchRequest(BaseModel):
    query: str
    top_k: int = 10
    sources: List[str] = ["document", "email", "wechat", "code"]
    complexity: int = 64
    recompute_embeddings: bool = False

class SearchResult(BaseModel):
    id: str
    content: str
    score: float
    source: str
    metadata: Dict[str, Any]

class SearchResponse(BaseModel):
    results: List[SearchResult]
    total_count: int
    query: str
    search_time: float

class SystemStatus(BaseModel):
    status: str
    index_loaded: bool
    index_path: Optional[str]
    total_documents: int
    backend_name: str
    embedding_model: str

def find_leann_index() -> Optional[str]:
    """Find a LEANN index in the current directory or examples."""
    current_dir = Path(__file__).parent.parent
    
    # Look for common index directories
    search_paths = [
        current_dir / "indices",
        current_dir / "demo" / "indices", 
        current_dir / "examples",
        current_dir,
    ]
    
    for search_path in search_paths:
        if search_path.exists():
            for item in search_path.iterdir():
                if item.is_dir():
                    # Check if it contains LEANN metadata
                    meta_file = item / "metadata.json"
                    if meta_file.exists():
                        logger.info(f"Found LEANN index at: {item}")
                        return str(item)
    
    return None

def initialize_searcher():
    """Initialize the LEANN searcher with available index."""
    global _searcher, _index_path
    
    if _searcher is not None:
        return _searcher
    
    _index_path = find_leann_index()
    if _index_path is None:
        logger.warning("No LEANN index found. Creating mock responses.")
        return None
    
    try:
        _searcher = LeannSearcher(_index_path)
        logger.info(f"Successfully loaded LEANN index from: {_index_path}")
        return _searcher
    except Exception as e:
        logger.error(f"Failed to load LEANN index: {e}")
        return None

@app.get("/api/status", response_model=SystemStatus)
async def get_status():
    """Get system status and index information."""
    searcher = initialize_searcher()
    
    if searcher is None:
        return SystemStatus(
            status="no_index",
            index_loaded=False,
            index_path=None,
            total_documents=0,
            backend_name="unknown",
            embedding_model="unknown"
        )
    
    try:
        # Get metadata from searcher
        total_docs = len(searcher.passage_manager) if hasattr(searcher, 'passage_manager') else 0
        
        return SystemStatus(
            status="ready",
            index_loaded=True,
            index_path=_index_path,
            total_documents=total_docs,
            backend_name=getattr(searcher, 'backend_name', 'unknown'),
            embedding_model=getattr(searcher, 'embedding_model', 'unknown')
        )
    except Exception as e:
        logger.error(f"Error getting status: {e}")
        return SystemStatus(
            status="error",
            index_loaded=False,
            index_path=_index_path,
            total_documents=0,
            backend_name="unknown",
            embedding_model="unknown"
        )

@app.post("/api/search", response_model=SearchResponse)
async def search(request: SearchRequest):
    """Perform search across LEANN index."""
    import time
    start_time = time.time()
    
    searcher = initialize_searcher()
    
    if searcher is None:
        # Return mock data when no real index is available
        mock_results = [
            SearchResult(
                id="mock_1",
                content=f"Mock result for query '{request.query}'. This would be real content from your indexed documents, emails, chat history, or code.",
                score=0.95,
                source="document",
                metadata={
                    "title": "Sample Document",
                    "path": "/path/to/document.pdf",
                    "date": "2025-08-31"
                }
            ),
            SearchResult(
                id="mock_2", 
                content=f"Another mock result related to '{request.query}'. In a real setup, this would come from your LEANN vector index with actual similarity scores.",
                score=0.87,
                source="email",
                metadata={
                    "title": "Email Subject",
                    "author": "sender@example.com",
                    "date": "2025-08-30"
                }
            )
        ]
        
        return SearchResponse(
            results=mock_results,
            total_count=len(mock_results),
            query=request.query,
            search_time=time.time() - start_time
        )
    
    try:
        # Use real LEANN searcher
        results = searcher.search(
            query=request.query,
            top_k=request.top_k,
            complexity=request.complexity,
            recompute_embeddings=request.recompute_embeddings
        )
        
        # Convert LEANN results to our format
        search_results = []
        for i, (label, distance, content) in enumerate(zip(
            results.get('labels', [[]]),
            results.get('distances', [[]]), 
            results.get('texts', [[]])
        )):
            if len(label) > 0 and len(distance) > 0 and len(content) > 0:
                for j in range(len(label[0])):
                    # Extract metadata if available
                    metadata = {}
                    if hasattr(searcher, 'passage_manager'):
                        passage_id = label[0][j]
                        passage_info = searcher.passage_manager.get_passage_info(passage_id)
                        if passage_info:
                            metadata = passage_info.get('metadata', {})
                    
                    search_results.append(SearchResult(
                        id=f"result_{i}_{j}",
                        content=content[0][j] if len(content[0]) > j else "No content",
                        score=1.0 - distance[0][j],  # Convert distance to similarity score
                        source=metadata.get('source', 'document'),
                        metadata=metadata
                    ))
        
        return SearchResponse(
            results=search_results,
            total_count=len(search_results),
            query=request.query,
            search_time=time.time() - start_time
        )
        
    except Exception as e:
        logger.error(f"Search error: {e}")
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@app.get("/api/indices")
async def list_indices():
    """List available LEANN indices."""
    # This would scan for available indices
    current_dir = Path(__file__).parent.parent
    indices = []
    
    # Look for indices in common locations
    search_paths = [
        current_dir / "indices",
        current_dir / "demo" / "indices",
        current_dir / "examples",
    ]
    
    for search_path in search_paths:
        if search_path.exists():
            for item in search_path.iterdir():
                if item.is_dir() and (item / "metadata.json").exists():
                    try:
                        with open(item / "metadata.json") as f:
                            metadata = json.load(f)
                        indices.append({
                            "name": item.name,
                            "path": str(item),
                            "backend": metadata.get("backend_name", "unknown"),
                            "embedding_model": metadata.get("embedding_model", "unknown"),
                            "created": metadata.get("created_at", "unknown")
                        })
                    except Exception as e:
                        logger.warning(f"Could not read metadata for {item}: {e}")
    
    return {"indices": indices}

# Index creation models
class IndexCreationRequest(BaseModel):
    name: str
    dataSources: List[str]
    embeddingModel: str
    backend: str  # 'hnsw' or 'diskann'
    chunkSize: int = 512
    chunkOverlap: int = 50

class IndexCreationProgress(BaseModel):
    status: str  # 'processing', 'completed', 'error'
    progress: int  # 0-100
    currentStep: str
    message: Optional[str] = None
    error: Optional[str] = None

# Store for tracking index creation progress
_creation_progress: Dict[str, IndexCreationProgress] = {}

@app.post("/api/indices/create")
async def create_index(request: IndexCreationRequest):
    """Create a new LEANN index."""
    try:
        import subprocess
        import threading
        import time
        from datetime import datetime
        
        # Create indices directory if it doesn't exist
        indices_dir = Path(__file__).parent.parent / "indices"
        indices_dir.mkdir(exist_ok=True)
        
        index_path = indices_dir / request.name
        if index_path.exists():
            raise HTTPException(status_code=400, detail=f"Index '{request.name}' already exists")
        
        # Initialize progress tracking
        progress_id = request.name
        _creation_progress[progress_id] = IndexCreationProgress(
            status="processing",
            progress=0,
            currentStep="Initializing...",
        )
        
        def create_index_background():
            try:
                # Update progress: Step 1 - Preparing data
                _creation_progress[progress_id].progress = 25
                _creation_progress[progress_id].currentStep = "Preparing data sources..."
                time.sleep(1)
                
                # Build the command based on data sources
                if "document" in request.dataSources:
                    # Use document RAG app
                    cmd = [
                        sys.executable, "-m", "apps.document_rag",
                        "--data-dir", "./data",
                        "--index-path", str(index_path),
                        "--embedding-model", request.embeddingModel,
                        "--backend", request.backend,
                        "--chunk-size", str(request.chunkSize),
                        "--chunk-overlap", str(request.chunkOverlap),
                    ]
                else:
                    raise ValueError("Unsupported data source combination")
                
                # Update progress: Step 2 - Running indexing
                _creation_progress[progress_id].progress = 50
                _creation_progress[progress_id].currentStep = "Creating embeddings and building index..."
                
                # Change to project root directory
                project_root = Path(__file__).parent.parent
                
                # Run the indexing command
                result = subprocess.run(
                    cmd,
                    cwd=project_root,
                    capture_output=True,
                    text=True,
                    timeout=600  # 10 minute timeout
                )
                
                if result.returncode != 0:
                    raise Exception(f"Index creation failed: {result.stderr}")
                
                # Update progress: Step 3 - Finalizing
                _creation_progress[progress_id].progress = 90
                _creation_progress[progress_id].currentStep = "Finalizing index..."
                time.sleep(1)
                
                # Update progress: Completed
                _creation_progress[progress_id].status = "completed"
                _creation_progress[progress_id].progress = 100
                _creation_progress[progress_id].currentStep = "Index created successfully!"
                
                # Reinitialize searcher to pick up new index
                global _searcher, _index_path
                _searcher = None
                _index_path = None
                initialize_searcher()
                
            except Exception as e:
                logger.error(f"Index creation failed: {e}")
                _creation_progress[progress_id].status = "error"
                _creation_progress[progress_id].error = str(e)
                _creation_progress[progress_id].currentStep = "Index creation failed"
        
        # Start background thread
        thread = threading.Thread(target=create_index_background)
        thread.daemon = True
        thread.start()
        
        return {"message": "Index creation started", "progress_id": progress_id}
        
    except Exception as e:
        logger.error(f"Failed to start index creation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/indices/create/{progress_id}/progress")
async def get_creation_progress(progress_id: str):
    """Get the progress of index creation."""
    if progress_id not in _creation_progress:
        raise HTTPException(status_code=404, detail="Progress ID not found")
    
    return _creation_progress[progress_id]

if __name__ == "__main__":
    logger.info("Starting LEANN Backend Service...")
    logger.info(f"Looking for indices in: {Path(__file__).parent.parent}")
    
    # Try to initialize searcher on startup
    initialize_searcher()
    
    uvicorn.run(
        app, 
        host="127.0.0.1", 
        port=8000,
        log_level="info"
    )
