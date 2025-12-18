import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
db = client["vmuseum"]

# dữ liệu Artifacts đã được làm sạch để training
def fetch_museum_data():
    artifacts = list(db.Artifacts.find({}, {"_id": 1, "name": 1, "description": 1, "tags": 1}))
    return artifacts