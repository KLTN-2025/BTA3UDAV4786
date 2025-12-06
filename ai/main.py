from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import uvicorn
from services.rag_engine import RAGEngine
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

app = FastAPI()

# Cho phép React gọi API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = RAGEngine()

# --- DTO Models ---
class KnowledgeItem(BaseModel):
    topic: str
    content: str

class ArtifactItem(BaseModel):
    id: str
    name: str
    description: str
    room_name: str

class ChatRequest(BaseModel):
    query: str
    instruction_override: Optional[str] = None
    context_override: Optional[str] = None

# Chat với người dùng
@app.post("/chat")
def chat(req: ChatRequest):
    result = engine.ask(req.query, req.instruction_override, req.context_override)
    return result

@app.get("/knowledge")
def list_knowledge():
    return engine.get_all_knowledge()

@app.post("/knowledge")
def add_knowledge(item: KnowledgeItem):
    success = engine.add_internal_knowledge(item.topic, item.content)
    if success:
        return {"status": "success", "message": "Đã nạp kiến thức vào não AI"}
    return {"status": "error", "message": "Lỗi vector hóa"}


@app.put("/knowledge/{id}")
def update_knowledge(id: str, item: KnowledgeItem):
    success = engine.update_internal_knowledge(id, item.topic, item.content)
    if success:
        return {"status": "success", "message": "Đã cập nhật"}
    raise HTTPException(status_code=404, detail="Không tìm thấy hoặc lỗi update")

@app.delete("/knowledge/{id}")
def delete_knowledge(id: str):
    success = engine.delete_internal_knowledge(id)
    if success:
        return {"status": "success", "message": "Đã xóa"}
    raise HTTPException(status_code=404, detail="Không tìm thấy hoặc lỗi xóa")

#đồng bộ vật phẩm
@app.post("/sync-artifacts")
def sync_artifacts(items: List[ArtifactItem]):
    count = engine.sync_external_artifacts([i.dict() for i in items])
    return {"status": "success", "synced_count": count}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)