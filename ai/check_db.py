from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

try:
    uri = os.getenv("MONGO_URI")
    client = MongoClient(uri)
    db = client["vmuseum"]

    print(f"Đang kiểm tra Database: {db.name}")
    print("-" * 30)

    count_internal = db.internal_knowledge.count_documents({})
    print(f"Internal Knowledge (Nhập tay): {count_internal} bản ghi")
    
    count_artifacts = db.imported_artifacts.count_documents({})
    print(f"Imported Artifacts (Từ Node.js): {count_artifacts} bản ghi")

    if count_artifacts > 0:
        print("-" * 30)
        print("Ví dụ 1 vật phẩm tìm thấy:")
        sample = db.imported_artifacts.find_one()
        print(f"- Tên: {sample.get('name')}")
        print(f"- Mô tả: {sample.get('description')[:50]}...")

except Exception as e:
    print(f"Lỗi kết nối: {e}")