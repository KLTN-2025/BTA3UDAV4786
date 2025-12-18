import google.generativeai as genai
from pymongo import MongoClient
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from thefuzz import process, fuzz
import os
from dotenv import load_dotenv
from bson import ObjectId

load_dotenv()


# Kết nối MongoDB
client = MongoClient(os.getenv("MONGO_URI"))
db = client["vmuseum"]

class RAGEngine:
    def __init__(self):
        print("Khởi động RAG Engine")
        keys_str = os.getenv("GOOGLE_API_KEYS", "")
        self.api_keys = [k.strip() for k in keys_str.split(",") if k.strip()]
        
        
        self.documents = []
        self.metadata = []
        self.names_list = []
    
        self.vectorizer = TfidfVectorizer(ngram_range=(1, 2), min_df=1)
        self.tfidf_matrix = None
        
        self.reload_data()

    def reload_data(self):
        print("Đang tải dữ liệu từ MongoDB...")
        self.documents = []
        self.metadata = []
        self.names_list = []

        for doc in db.internal_knowledge.find({}):
            self.documents.append(doc['content'])
            self.metadata.append({"source": "internal", "topic": doc['topic']})

        for doc in db.imported_artifacts.find({}):
            # Gom tất cả thông tin quan trọng vào text để tìm kiếm
            text = f"{doc['name']} {doc['description']} {doc.get('room_name', '')}"
            self.documents.append(text)
            self.metadata.append({"source": "artifact", "name": doc['name']})
            # Lưu tên để tìm kiếm mờ
            self.names_list.append(doc['name'])

        if self.documents:
            self.tfidf_matrix = self.vectorizer.fit_transform(self.documents)
            print(f"Đã học {len(self.documents)} bản ghi kiến thức.")
        else:
            print("Chưa có dữ liệu. Hãy vào Dashboard Admin để nạp.")
    def get_all_knowledge(self):
        data = []
        for doc in db.internal_knowledge.find({}):
            data.append({
                "id": str(doc["_id"]), # Chuyển ObjectId thành string
                "topic": doc["topic"],
                "content": doc["content"]
            })
        return data
    
    def add_internal_knowledge(self, topic, content):
        db.internal_knowledge.insert_one({
            "topic": topic,
            "content": content
        })
        self.reload_data() # Học lại
        return True
    
    def update_internal_knowledge(self, id, topic, content):
        try:
            db.internal_knowledge.update_one(
                {"_id": ObjectId(id)},
                {"$set": {"topic": topic, "content": content}}
            )
            self.reload_data() # Học lại
            return True
        except Exception as e:
            print(f"Lỗi update: {e}")
            return False

    def delete_internal_knowledge(self, id):
        try:
            db.internal_knowledge.delete_one({"_id": ObjectId(id)})
            self.reload_data() # Học lại
            return True
        except Exception as e:
            print(f"Lỗi delete: {e}")
            return False

    def sync_external_artifacts(self, artifacts):
        print(f"Đồng bộ {len(artifacts)} vật phẩm...")
        db.imported_artifacts.delete_many({}) 
        
        data_to_insert = []
        for art in artifacts:
            data_to_insert.append({
                "external_id": art['id'],
                "name": art['name'],
                "description": art['description'],
                "imageUrl": art.get('imageUrl', ''),
                "room_name": art['room_name']
            })
            
        if data_to_insert:
            db.imported_artifacts.insert_many(data_to_insert)
            
        self.reload_data()
        return len(data_to_insert)
    
    def _generate_with_retry(self, prompt):
        if not self.api_keys:
            return "Lỗi hệ thống: Không có API Key nào được cấu hình."

      
        current_keys = self.api_keys.copy()

        for i, key in enumerate(current_keys):
            try:
                genai.configure(api_key=key)
                model = genai.GenerativeModel('gemini-2.5-flash')
                
                # Gọi API
                response = model.generate_content(prompt)
                return response.text
            
            except Exception as e:
                print(f"Key thứ {i+1} gặp lỗi: {e}. Đang thử key tiếp theo...")
                continue
        
        # Nếu chạy hết vòng lặp mà vẫn lỗi
        print("Tất cả các API Key đều thất bại.")
        return "Hiện tại hệ thống đang quá tải, vui lòng thử lại sau ít phút."


    def ask(self, query, instruction=None, direct_context=None):
        if not self.documents:
            return {"reply": "Hệ thống chưa có dữ liệu.", "related_artifact": None}

        detected_info = ""
        detected_artifact_data = None 

        if direct_context:
             detected_info = f"THÔNG TIN QUAN TRỌNG TẠI ĐIỂM NÀY: {direct_context}\n(Hãy ưu tiên trả lời dựa trên thông tin này)"
        
        elif self.names_list:
            # Lấy top 1 kết quả giống nhất
            best = process.extractOne(query, self.names_list, scorer=fuzz.partial_token_set_ratio)
            
            # tin cậy > 80%
            if best and best[1] >= 80:
                detected_name = best[0]
                detected_info = f"Người dùng hỏi đích danh về: {detected_name}."
              
                found_doc = db.imported_artifacts.find_one({"name": detected_name})
                
                if found_doc:
                    detected_artifact_data = {
                        "id": found_doc.get("external_id"),
                        "name": found_doc.get("name"),
                        "description": found_doc.get("description"),
                        "imageUrl": found_doc.get("imageUrl", "")
                    }

        # Tìm kiếm (TF-IDF)
        query_vec = self.vectorizer.transform([query])
        scores = cosine_similarity(query_vec, self.tfidf_matrix).flatten()
        top_indices = scores.argsort()[-3:][::-1]
        
        context = ""
        found_something = False
        for idx in top_indices:
            if scores[idx] > 0.1:
                meta = self.metadata[idx]
                label = meta.get('topic') or meta.get('name')
                context += f"- Thông tin về '{label}': {self.documents[idx]}\n"
                found_something = True

        if not found_something and not detected_info:
            return {
                "reply": "Xin lỗi, tôi chưa có thông tin cụ thể về vấn đề này trong bảo tàng.",
                "related_artifact": None
            }

        # Tạo câu trả lời với Gemini
        system_role = instruction if instruction else "Bạn là Hướng dẫn viên ảo (Chatbot) của Bảo tàng Đại học Duy Tân (DTU)."

        prompt = f"""
        {system_role}
        
        Dưới đây là thông tin thực tế bạn biết (được trích xuất từ database):
        ---
        {context}
        ---
        {detected_info}
        
        Câu hỏi của khách: "{query}"
        
        Yêu cầu: 
        - Trả lời dựa trên thông tin trên. 
        - Giọng điệu tự hào, thân thiện.
        - Nếu tìm thấy thông tin về vật phẩm cụ thể, hãy mời khách xem chi tiết.
        """
        
        

        reply_text = self._generate_with_retry(prompt)
        return {
            "reply": reply_text,
            "related_artifact": detected_artifact_data
        }