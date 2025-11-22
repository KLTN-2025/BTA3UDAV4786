import { createServer } from "http";
import { Server } from "socket.io";
import app, { init } from "./app.js";
import "dotenv/config";

const PORT = process.env.PORT || 4000;

// 1. Tạo HTTP Server từ Express App
const httpServer = createServer(app);

// 2. Cấu hình Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Phải khớp với Frontend
    methods: ["GET", "POST"]
  }
});

// 3. Logic Socket (Chat & Tour Nhóm)
io.on("connection", (socket) => {
  console.log(`🟢 Socket connected: ${socket.id}`);

  // --- A. Tham gia phòng ---
  socket.on("join_room", ({ roomId, username }) => {
    socket.join(roomId);
    console.log(`👤 User ${username} joined room: ${roomId}`);
    
    // Báo cho những người khác trong phòng
    socket.to(roomId).emit("receive_message", {
      user: "Hệ thống",
      text: `${username} đã tham gia phòng!`,
      time: new Date().toLocaleTimeString(),
      isSystem: true
    });
  });

  // --- B. Chat tin nhắn ---
  socket.on("send_message", (data) => {
    // data gồm: { roomId, user, text, time }
    // Gửi lại cho TẤT CẢ mọi người trong phòng (bao gồm người gửi để hiện lên màn hình họ)
    io.in(data.roomId).emit("receive_message", data);
  });

  // --- C. Đồng bộ chuyển cảnh (Optional) ---
  // Nếu trưởng nhóm đổi ảnh panorama, gửi tín hiệu cho các thành viên khác đổi theo
  socket.on("change_scene", ({ roomId, panoId }) => {
    socket.to(roomId).emit("sync_scene", panoId);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

init().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server & Socket running on http://localhost:${PORT}`);
  });
});
