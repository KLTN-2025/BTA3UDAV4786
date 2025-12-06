DTU Virtual Museum - Bảo tàng ảo 3D & AI Assistant

Đồ án Tốt nghiệp - Khoa Công nghệ Thông tin - Đại học Duy Tân

Một nền tảng tham quan bảo tàng thực tế ảo (WebXR) kết hợp Trí tuệ nhân tạo (AI) để thuyết minh và hướng dẫn khách tham quan.

DTU Virtual Museum là giải pháp số hóa bảo tàng, cho phép người dùng tham quan không gian lịch sử từ xa thông qua giao diện 360° Panorama và mô hình 3D. Hệ thống tích hợp AI Guide (sử dụng Google Gemini & RAG) đóng vai trò như một hướng dẫn viên thực thụ, có khả năng trả lời câu hỏi theo ngữ cảnh và thuyết minh bằng giọng nói tiếng Việt tự nhiên (FPT.AI).

Tính năng nổi bật:

Trải nghiệm Người dùng (Frontend)

Tham quan 360°: Di chuyển giữa các khu vực (Sảnh chính, Phòng trưng bày...) mượt mà.

Chế độ VR: Hỗ trợ kính thực tế ảo (Cardboard) cho trải nghiệm nhập vai.

Vật phẩm 3D: Xem chi tiết hiện vật, xoay 360 độ, phóng to/thu nhỏ.

Dòng thời gian (Timeline): Tự động tua và thuyết minh các sự kiện lịch sử quan trọng.

AI Guide Chatbot: Trò chuyện với hướng dẫn viên ảo ngay trên màn hình tham quan.

Thuyết minh giọng nói: Tích hợp Text-to-Speech (Giọng Ban Mai - FPT) đọc nội dung chi tiết.

Hệ thống & Quản trị (Backend & AI)

Xác thực: Đăng nhập an toàn qua Google (OAuth2).

RAG Engine: Hệ thống tìm kiếm kiến thức thông minh, giúp AI trả lời chính xác thông tin nội bộ của bảo tàng.

Quản lý nội dung: Admin Dashboard để thêm sửa xóa hiện vật, kiến thức AI.

Đồng bộ dữ liệu: Cơ chế sync thông tin vật phẩm từ SQL sang Vector Database (MongoDB) cho AI học.

Công nghệ chính:

Frontend: React (Vite), Tailwind CSS, Three.js (@react-three/fiber), GSAP, WebXR, FPT.AI, TTS

Backend: Node.js, Express, PostgreSQL (Sequelize), Passport.js

AI Service: Python (FastAPI), Google Gemini 2.0 Flash, MongoDB (Vector Store), Scikit-learn (TF-IDF)

Cài đặt và Triển khai

Yêu cầu tiên quyết:

Node.js (v16+)

Python (v3.9+)

PostgreSQL

MongoDB (Cho AI Service)

1. Khởi chạy Backend (Node.js)
  cd backend

# Cài đặt thư viện
npm install

# Tạo file .env và cấu hình (xem mẫu bên dưới)

# Chạy server
node src/server.js
# Server chạy tại: http://localhost:4000
2. Khởi chạy AI Service (Python)
cd ai

# Tạo môi trường ảo
python -m venv venv
# Kích hoạt venv: 
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# Cài đặt thư viện
pip install -r requirements.txt

# Chạy server FastAPI
python main.py
# Server chạy tại: http://localhost:8000
3. Khởi chạy Frontend (React)
cd frontend/frontend

# Cài đặt thư viện
npm install

# Chạy development server
npm run dev
# Web chạy tại: http://localhost:5173
Cấu hình biến môi trường (.env)

Backend (backend/.env)

PORT=4000
# Cấu hình Database PostgreSQL

DB_HOST=localhost

DB_USER=postgres

DB_PASS=your_password

DB_NAME=dtu_museum

DB_DIALECT=postgres

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id

GOOGLE_CLIENT_SECRET=your_google_client_secret

SESSION_SECRET=your_session_secret_key

AI Service (ai/.env)

# Database MongoDB (Vector Store)
MONGO_URI=mongodb://localhost:27017/

GOOGLE_API_KEY=your_gemini_api_key

Frontend (frontend/frontend/.env)

VITE_API_URL=http://localhost:4000/api

VITE_AI_URL=http://localhost:8000

VITE_FPT_API_KEY=your_fpt_ai_key

Đội ngũ thực hiện

Giảng viên hướng dẫn: ThS. Trịnh Sử Trường Thi

Thành viên nhóm:
Dương Tuấn Kiệt (Trưởng nhóm) - Product Owner, Coder

Đào Hoàng Việt Anh - Thành viên (Scrum Master, Design)

Lê Quang Vinh - Thành viên (Tester)

Đinh Văn Trọng Đạt - Thành viên (Documentation)

Nguyễn Văn Nhân - Thành viên (Tester & Design)

License

Dự án này được thực hiện cho mục đích giáo dục tại Đại học Duy Tân.

© 2025 DTU Capstone Project. All rights reserved.
