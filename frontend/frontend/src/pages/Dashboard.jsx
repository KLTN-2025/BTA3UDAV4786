import { useEffect, useState, useRef } from "react";
import { RoomAPI } from "../api/roomApi";
import { PanoramaAPI } from "../api/panoramaApi";
import { HotspotAPI } from "../api/hotspotApi";
import { QuizAPI } from "../api/quizApi";
import * as PANOLENS from "panolens";
import * as THREE from "three";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("museum");
  const [rooms, setRooms] = useState([]);
  const [panoramas, setPanoramas] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedPanorama, setSelectedPanorama] = useState(null);
  const [form, setForm] = useState({
    roomName: "",
    panoTitle: "",
    panoFile: null,
    hotspotLabel: "",
    toPanoramaId: "",
  });

  const [showViewer, setShowViewer] = useState(false);
  const viewerContainerRef = useRef(null);
  const panoViewerRef = useRef(null);
  const panoObjRef = useRef(null);

  const [questions, setQuestions] = useState([]); 
  const [quizForm, setQuizForm] = useState({ 
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "A",
  });

  const [editingHotspot, setEditingHotspot] = useState(null);

  // ===== LOAD DATA =====
  useEffect(() => {
    loadRooms();
    loadQuestions();
  }, []);

  const loadRooms = async () => setRooms(await RoomAPI.list());
  const loadPanoramas = async (roomId) =>
    setPanoramas(await PanoramaAPI.getByRoom(roomId));
  const loadHotspots = async (panoId) =>
    setHotspots(await HotspotAPI.getByPanorama(panoId));

  const loadQuestions = async () => setQuestions(await QuizAPI.list());
  // ===== CRUD =====
  // ===== DELETE FUNCTIONS =====
const handleDeleteRoom = async (roomId) => {
  if (!window.confirm("Bạn có chắc muốn xóa Room này không?")) return;
  await RoomAPI.delete(roomId);
  alert("🗑️ Đã xóa Room!");
  loadRooms();
  setSelectedRoom(null);
  setPanoramas([]);
  setHotspots([]);
};

const handleDeletePanorama = async (panoId) => {
  if (!window.confirm("Xóa panorama này?")) return;
  await PanoramaAPI.delete(panoId);
  alert("🗑️ Đã xóa Panorama!");
  if (selectedRoom) loadPanoramas(selectedRoom);
};

const handleDeleteHotspot = async (hotspotId, panoId) => {
  if (!window.confirm("Xóa hotspot này?")) return;
  await HotspotAPI.delete(hotspotId);
  alert("🗑️ Đã xóa Hotspot!");
  loadHotspots(panoId);
};

  const handleAddRoom = async (e) => {
    e.preventDefault();
    if (!form.roomName) return alert("Nhập tên phòng!");
    await RoomAPI.create({ name: form.roomName });
    setForm({ ...form, roomName: "" });
    loadRooms();
  };

  const handleAddPanorama = async (e) => {
  e.preventDefault();
  if (!selectedRoom) return alert("Chọn phòng trước!");
  
  const fd = new FormData();
  fd.append("roomId", selectedRoom);
  fd.append("title", form.panoTitle);
  fd.append("image", form.panoFile);

  const newPano = await PanoramaAPI.create(fd);
  alert("✅ Upload panorama thành công!");

  setForm({ ...form, panoTitle: "", panoFile: null });
  loadPanoramas(selectedRoom);

  console.log("📸 Panorama uploaded:", newPano.imageUrl); 
};

const handleQuizFormChange = (e) => {
    const { name, value } = e.target;
    setQuizForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (
      !quizForm.question ||
      !quizForm.optionA ||
      !quizForm.optionB ||
      !quizForm.optionC ||
      !quizForm.optionD
    ) {
      return alert("Vui lòng nhập đầy đủ câu hỏi và 4 đáp án.");
    }

    const newQuestion = {
      question: quizForm.question,
      options: [
        quizForm.optionA,
        quizForm.optionB,
        quizForm.optionC,
        quizForm.optionD,
      ],
      correctAnswer: quizForm.correctAnswer,
    };

    await QuizAPI.create(newQuestion);
    alert("✅ Thêm câu hỏi thành công!");
    loadQuestions();
    setQuizForm({
      question: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "A",
    });
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm("Xóa câu hỏi này?")) return;
    await QuizAPI.delete(questionId);
    alert("🗑️ Đã xóa câu hỏi!");
    loadQuestions();
  };


  // ===== VIEWER =====
  const openViewer = async (pano) => {
  setSelectedPanorama(pano.id);
  setShowViewer(true);
  const data = await HotspotAPI.getByPanorama(pano.id);
  setHotspots(data);

  // 🧩 Fix: ép lại link ảnh thật để không bị blob
  let fixedUrl = pano.imageUrl;
  if (fixedUrl.startsWith("blob:") || fixedUrl.startsWith("/uploads")) {
    fixedUrl = `http://localhost:4000${pano.imageUrl.replace("blob:", "").replace(/^\/+/, "/")}`;
  }
  pano.imageUrl = fixedUrl;

  console.log("🖼️ Final panorama URL used:", fixedUrl);
  setTimeout(() => initPanoramaViewer(pano, data), 200);
};


 const initPanoramaViewer = (pano, hotspotData) => {
  if (!viewerContainerRef.current) return;
  viewerContainerRef.current.innerHTML = "";
  viewerContainerRef.current.style.pointerEvents = "auto";

  if (panoViewerRef.current) {
    panoViewerRef.current.dispose();
    panoViewerRef.current = null;
  }

  //  Tạo viewer trước
  const viewer = new PANOLENS.Viewer({
    container: viewerContainerRef.current,
    autoRotate: false,
    cameraFov: 80,
  });
  panoViewerRef.current = viewer;

  //  Tạo panorama
  const panorama = new PANOLENS.ImagePanorama(pano.imageUrl);
  window._pano = panorama;
  panorama.crossOrigin = "anonymous";
  panoObjRef.current = panorama;

  //  Gắn panorama vào viewer trước khi đăng ký click
  viewer.add(panorama);

  //  Bắt sự kiện panorama đã sẵn sàng
  panorama.addEventListener("enter", () => {
    console.log("🟢 Panorama entered, mesh ready?", !!panorama.mesh);

    // Nếu mesh chưa tồn tại, thử đợi 1s để WebGL build xong
    if (!panorama.mesh) {
      console.warn("⚠️ Mesh chưa sẵn sàng, retry sau 1s...");
      setTimeout(() => {
        console.log("🔁 Kiểm tra lại mesh:", !!panorama.mesh);
      }, 1000);
      return;
    }

    // Hiển thị hotspot
    hotspotData.forEach((h) => {
      const spot = new PANOLENS.Infospot(400, PANOLENS.DataImage.Info);
      spot.position.set(h.posX, h.posY, h.posZ);
      spot.addHoverText(h.label);
      panorama.add(spot);
    });
  });

  //  Xử lý click
  panorama.addEventListener("click", async (event) => {
    if (!panorama.mesh) {
      console.warn("⚠️ Mesh vẫn chưa sẵn sàng — click bị bỏ qua.");
      return;
    }

    const raycaster = panoViewerRef.current?.raycaster;
    const intersects = raycaster.intersectObject(panorama.mesh, true);
    if (!intersects.length) return alert("⚠️ Không xác định được vị trí click!");

    const pos = intersects[0].point;
    console.log("✅ Click position:", pos);

    if (!form.hotspotLabel || !form.toPanoramaId)
      return alert("⚠️ Nhập label và chọn panorama đích trước!");

    const newHotspot = {
      fromPanoramaId: pano.id,
      toPanoramaId: form.toPanoramaId,
      label: form.hotspotLabel,
      posX: parseFloat(pos.x.toFixed(3)),
      posY: parseFloat(pos.y.toFixed(3)),
      posZ: parseFloat(pos.z.toFixed(3)),
    };

    await HotspotAPI.create(newHotspot);
    alert(`✅ Tạo hotspot "${newHotspot.label}" thành công!`);
    loadHotspots(pano.id);
    setForm({ ...form, hotspotLabel: "", toPanoramaId: "" });
  });
};



  // ===== RENDER UI =====
  return (
    <div
      style={{
        fontFamily: "Georgia, serif",
        backgroundColor: "#f8f4ec",
        minHeight: "100vh",
        color: "#3e2723",
      }}
    >
      <header
        style={{
          backgroundColor: "#4e342e",
          color: "white",
          padding: "15px 30px",
          fontSize: "22px",
          fontWeight: "bold",
        }}
      >
        🏛️ DTU Virtual Museum — Quản Trị Dữ Liệu
      </header>


        <nav style={{ padding: "10px 20px", backgroundColor: "#c8bcaf" }}>
        <button
          style={activeTab === "museum" ? tabBtnActive : tabBtn}
          onClick={() => setActiveTab("museum")}
        >
          🏛️ Quản lý Bảo tàng
        </button>
        <button
          style={activeTab === "quiz" ? tabBtnActive : tabBtn}
          onClick={() => setActiveTab("quiz")}
        >
          ❓ Quản lý Câu hỏi
        </button>
      </nav>


        {activeTab === "museum" && (
      <main style={{ display: "flex", gap: "20px", padding: "20px" }}>
        {/* ROOM */}
        <section style={sectionStyle}>
          <h3>🗂️ Rooms</h3>
          <form onSubmit={handleAddRoom}>
            <input
              type="text"
              placeholder="Tên phòng..."
              value={form.roomName}
              onChange={(e) => setForm({ ...form, roomName: e.target.value })}
              style={inputStyle}
            />
            <button type="submit" style={btnBrown}>
              ➕ Thêm
            </button>
          </form>

          <ul style={{ marginTop: "10px", listStyle: "none", paddingLeft: 0 }}>
           {rooms.map((r) => (
  <li
    key={r.id}
    style={{
      ...listItemStyle,
      background: selectedRoom === r.id ? "#d7ccc8" : "transparent",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <span
      style={{ cursor: "pointer", flex: 1, padding: "4px" }}
      onClick={() => {
        setSelectedRoom(r.id);
        loadPanoramas(r.id);
      }}
    >
      {r.name}
    </span>
    <button
      onClick={() => handleDeleteRoom(r.id)}
      style={{
        background: "transparent",
        color: "red",
        border: "none",
        cursor: "pointer",
        fontSize: "16px",
      }}
    >
      🗑️
    </button>
  </li>
))}

          </ul>
        </section>

      
       {/* PANORAMA */}
<section style={sectionStyle}>
  <h3>🖼️ Panoramas</h3>

  {/* Nếu chưa chọn phòng, hiển thị thông báo hướng dẫn */}
  {!selectedRoom ? (
    <div
      style={{
        padding: "10px",
        border: "1px dashed #ccc",
        borderRadius: "6px",
        background: "#fff8e1",
        color: "#6d4c41",
        marginBottom: "10px",
        fontStyle: "italic",
      }}
    >
      ⚠️ Vui lòng chọn một <strong>Room</strong> ở cột bên trái để thêm hoặc
      xem danh sách Panorama.
    </div>
  ) : (
    <form onSubmit={handleAddPanorama} encType="multipart/form-data">
      <input
        type="text"
        placeholder="Tên panorama..."
        value={form.panoTitle}
        onChange={(e) => setForm({ ...form, panoTitle: e.target.value })}
        style={inputStyle}
        disabled={!selectedRoom}
      />
      <input
        type="file"
        onChange={(e) => setForm({ ...form, panoFile: e.target.files[0] })}
        disabled={!selectedRoom}
      />
      <button
        type="submit"
        style={{
          ...btnBrown,
          opacity: selectedRoom ? 1 : 0.6,
          cursor: selectedRoom ? "pointer" : "not-allowed",
        }}
        disabled={!selectedRoom}
      >
        🪶 Upload
      </button>
    </form>
  )}

  {/* Danh sách panorama */}
  <div style={gridStyle}>
    {panoramas.length === 0 && selectedRoom && (
      <p style={{ gridColumn: "1 / -1", color: "#777" }}>
        (Chưa có panorama trong phòng này)
      </p>
    )}

    {panoramas.map((p) => (
      <div
        key={p.id}
        style={{
          ...cardStyle,
          background: selectedPanorama === p.id ? "#d7ccc8" : "#fafafa",
        }}
      >
        <strong>{p.title}</strong>
        <img src={p.imageUrl} alt={p.title} style={imgStyle} />
        <button
          onClick={() => openViewer(p)}
          style={{ ...btnBrown, width: "100%", marginTop: "5px" }}
        >
          👁️ Xem & Chỉnh Hotspots
        </button>
      </div>
    ))}
  </div>
</section>


        {/* HOTSPOTS */}
        <section style={sectionStyle}>
          <h3>⭕ Hotspots</h3>
          <div style={{ marginBottom: "8px" }}>
            <input
              type="text"
              placeholder="Label hotspot..."
              value={form.hotspotLabel}
              onChange={(e) =>
                setForm({ ...form, hotspotLabel: e.target.value })
              }
              style={inputStyle}
            />
            <select
              value={form.toPanoramaId}
              onChange={(e) =>
                setForm({ ...form, toPanoramaId: e.target.value })
              }
              style={inputStyle}
            >
              <option value="">→ Chọn đích</option>
              {panoramas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <table style={tableStyle}>
            <thead>
              <tr style={{ background: "#efebe9" }}>
                <th>Label</th>
                <th>To</th>
                <th>Pos</th>
              </tr>
            </thead>
            <tbody>
              {hotspots.map((h) => (
                <tr key={h.id}>
                  <td>{h.label}</td>
                  <td>{h.toPanoramaId?.slice(0, 6)}</td>
                  <td>
                    {h.posX}, {h.posY}, {h.posZ}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
        )}

        {activeTab === "quiz" && (
        <main style={{ padding: "20px", display: "flex", gap: "20px" }}>
          {/* FORM THÊM CÂU HỎI */}
          <section style={{ ...sectionStyle, flex: 1 }}>
            <h3>📝 Thêm câu hỏi mới</h3>
            <form onSubmit={handleAddQuestion} style={quizFormStyle}>
              <label>Câu hỏi:</label>
              <textarea
                name="question"
                rows="3"
                placeholder="Nhập nội dung câu hỏi..."
                value={quizForm.question}
                onChange={handleQuizFormChange}
                style={quizInput}
              />

              <label>Đáp án A:</label>
              <input
                name="optionA"
                type="text"
                placeholder="Nội dung đáp án A"
                value={quizForm.optionA}
                onChange={handleQuizFormChange}
                style={quizInput}
              />

              <label>Đáp án B:</label>
              <input
                name="optionB"
                type="text"
                placeholder="Nội dung đáp án B"
                value={quizForm.optionB}
                onChange={handleQuizFormChange}
                style={quizInput}
              />

              <label>Đáp án C:</label>
              <input
                name="optionC"
                type="text"
                placeholder="Nội dung đáp án C"
                value={quizForm.optionC}
                onChange={handleQuizFormChange}
                style={quizInput}
              />

              <label>Đáp án D:</label>
              <input
                name="optionD"
                type="text"
                placeholder="Nội dung đáp án D"
                value={quizForm.optionD}
                onChange={handleQuizFormChange}
                style={quizInput}
              />

              <label>Đáp án đúng:</label>
              <select
                name="correctAnswer"
                value={quizForm.correctAnswer}
                onChange={handleQuizFormChange}
                style={quizSelect}
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>

              <button type="submit" style={btnBrown}>
                ➕ Thêm câu hỏi
              </button>
            </form>
          </section>

          {/* DANH SÁCH CÂU HỎI */}
          <section style={{ ...sectionStyle, flex: 2 }}>
            <h3>📚 Danh sách câu hỏi</h3>
            <table style={{ ...tableStyle, fontSize: "14px" }}>
              <thead>
                <tr style={{ background: "#efebe9" }}>
                  <th style={{width: '40%'}}>Câu hỏi</th>
                  <th style={{width: '40%'}}>Các đáp án</th>
                  <th style={{width: '10%'}}>Đúng</th>
                  <th style={{width: '10%'}}>Xóa</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q) => (
                  <tr key={q.id}>
                    <td>{q.question}</td>
                    <td>
                      <ul style={{margin: 0, paddingLeft: '20px'}}>
                        {q.options.map((opt, index) => (
                          <li key={index} style={{fontWeight: ['A','B','C','D'][index] === q.correctAnswer ? 'bold' : 'normal'}}>
                            {opt}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td style={{textAlign: 'center', fontWeight: 'bold', color: '#4e342e'}}>{q.correctAnswer}</td>
                    <td style={{textAlign: 'center'}}>
                      <button onClick={() => handleDeleteQuestion(q.id)} style={deleteBtnStyle}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      )}

     {showViewer && (
  <div style={viewerModal}>
    <div ref={viewerContainerRef} style={viewerBox}></div>

    {/*  Form nhập Hotspot ngay trong Viewer */}
    <div
      style={{
        position: "absolute",
        right: "20px",
        bottom: "20px",
        background: "rgba(255,255,255,0.95)",
        padding: "10px 15px",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0,0,0,0.3)",
        width: "260px",
      }}
    >
      <h4 style={{ marginTop: 0, color: "#4e342e", fontSize: "14px" }}>
        ➕ Thêm Hotspot
      </h4>
      <input
        type="text"
        placeholder="Label hotspot..."
        value={form.hotspotLabel}
        onChange={(e) =>
          setForm({ ...form, hotspotLabel: e.target.value })
        }
        style={{
          width: "100%",
          marginBottom: "5px",
          padding: "6px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />
      <select
        value={form.toPanoramaId}
        onChange={(e) =>
          setForm({ ...form, toPanoramaId: e.target.value })
        }
        style={{
          width: "100%",
          padding: "6px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          marginBottom: "5px",
        }}
      >
        <option value="">→ Chọn panorama đích</option>
        {panoramas.map((p) => (
          <option key={p.id} value={p.id}>
            {p.title}
          </option>
        ))}
      </select>
      <p
        style={{
          fontSize: "12px",
          color: "#555",
          marginTop: "5px",
          lineHeight: "1.4em",
        }}
      >
        👉 Sau khi nhập Label và chọn đích, click vào vị trí trong ảnh để đặt
        hotspot.
      </p>
    </div>

    <button onClick={() => setShowViewer(false)} style={btnClose}>
      ✖️ Đóng Viewer
    </button>
  </div>
)}


      <footer style={footerStyle}>
        © 2025 DTU Virtual Museum — Quản Trị Dữ Liệu
      </footer>
    </div>
  );
}

// ===== STYLE OBJECTS =====
const sectionStyle = {
  flex: 1,
  background: "#fff",
  borderRadius: 8,
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  padding: 20,
};

const listItemStyle = {
  padding: "6px",
  borderRadius: 6,
  border: "1px solid #ccc",
  marginBottom: 5,
  cursor: "pointer",
};

const btnBrown = {
  padding: "8px 12px",
  background: "#6d4c41",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: '14px',
};

const inputStyle = {
  padding: "8px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  marginRight: "5px",
  marginBottom: "5px",
};

const cardStyle = {
  border: "1px solid #ccc",
  borderRadius: "6px",
  padding: "8px",
};

const imgStyle = {
  width: "100%",
  height: "120px",
  objectFit: "cover",
  borderRadius: "4px",
  marginTop: "5px",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px",
  marginTop: "10px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "10px",
};

const viewerModal = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.9)",
  zIndex: 9999,
  display: "flex",
  flexDirection: "column",
};

const viewerBox = { flex: 1, width: "100%", height: "100%" };

const btnClose = {
  position: "absolute",
  top: 20,
  right: 20,
  background: "#6d4c41",
  color: "white",
  border: "none",
  borderRadius: "4px",
  padding: "6px 12px",
};

const footerStyle = {
  textAlign: "center",
  background: "#4e342e",
  color: "white",
  padding: "10px",
  fontSize: "13px",
  marginTop: 'auto',
};

const tabBtn = {
  padding: "10px 15px",
  border: "none",
  background: "transparent",
  cursor: "pointer",
  fontSize: "16px",
  color: "#3e2723",
  fontWeight: "500",
  opacity: 0.7,
};

const tabBtnActive = {
  ...tabBtn,
  fontWeight: "bold",
  opacity: 1,
  borderBottom: "3px solid #4e342e",
};

const deleteBtnStyle = {
  background: "transparent",
  color: "#c62828",
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
  padding: '4px'
};

const noticeBoxStyle = {
  padding: "10px",
  border: "1px dashed #ccc",
  borderRadius: "6px",
  background: "#fff8e1",
  color: "#6d4c41",
  marginBottom: "10px",
  fontStyle: "italic",
};

const quizFormStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const quizInput = {
  padding: "8px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  width: "100%",
  boxSizing: 'border-box'
};

const quizSelect = {
  ...quizInput,
  width: 'auto',
  alignSelf: 'flex-start'
};
