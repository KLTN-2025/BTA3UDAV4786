import { Suspense, useState, useContext, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, Loader } from "@react-three/drei";
import { useNavigate, useSearchParams } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { ModeContext } from "../context/ModeContext";
import { PanoramaAPI } from "../api/panoramaApi";
import { HotspotAPI } from "../api/hotspotApi";
import HotspotBar from "../components/HotspotBar";
import PanoramaScene from "../components/PanoramaScene";
import ControlBar from "../components/ControlBar";
import LogoCorner from "../components/LogoCorner";
import AIGuide from "../components/AIGuide";
import Navbar from "../components/Navbar";
import ChatBox from "../components/ChatBox";
import { AuthContext } from "../context/AuthContext";
import { useChat } from "../hooks/useChat";

export default function Home() {
  const { mode } = useContext(ModeContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const panoRef = useRef();
  const canvasRef = useRef(null);

 
  const roomId = searchParams.get("room");
  
  const currentUsername = user?.displayName || user?.username || `Khách ${Math.floor(Math.random() * 1000)}`;
  const { messages, sendMessage, clearMessages } = useChat(roomId, currentUsername);
  const [showChat, setShowChat] = useState(!!roomId);


   // States dữ liệu
  const [allPanoramas, setAllPanoramas] = useState([]);
  const [allHotspots, setAllHotspots] = useState([]);
  const [currentPano, setCurrentPano] = useState(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    async function loadData() {
      try {
        const [panos, spots] = await Promise.all([
          PanoramaAPI.list(),
          HotspotAPI.list()
        ]);
        
        setAllPanoramas(panos);
        setAllHotspots(spots);

        // Chọn pano đầu tiên làm mặc định nếu có
        if (panos.length > 0) {
          // Xử lý URL ảnh
          const startPano = processPanoUrl(panos[0]);
          setCurrentPano(startPano);
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu tour:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (roomId) {
      setShowChat(true);
    }
  }, [roomId]);

  const handleLeaveGroup = () => {
    if (window.confirm("Bạn có chắc muốn rời nhóm và xóa đoạn chat?")) {
        setSearchParams({}); 
        setShowChat(false);
        clearMessages();
        
    }
  };

  // Hàm xử lý URL ảnh
  const processPanoUrl = (pano) => {
    let fixedUrl = pano.imageUrl;
    if (fixedUrl.startsWith("blob:") || fixedUrl.startsWith("/uploads")) {
      fixedUrl = `http://localhost:4000${pano.imageUrl.replace("blob:", "").replace(/^\/+/, "/")}`;
    }
    return { ...pano, imageUrl: fixedUrl };
  };

  // Lấy hotspots của pano hiện tại
  const currentPanoHotspots = allHotspots.filter(
    (h) => currentPano && h.fromPanoramaId === currentPano.id
  );


  const handleHotspotClick = (spot) => {
    const nextPano = allPanoramas.find((p) => p.id === spot.toPanoramaId);
    if (nextPano) {
      console.log("Chuyển đến:", nextPano.title);
      setCurrentPano(processPanoUrl(nextPano));
    } else {
      console.warn("Không tìm thấy pano đích:", spot.toPanoramaId);
    }
  };

 
  const handleBarSelect = (spot) => {
    const targetPano = allPanoramas.find(p => p.id === spot.id);
    if (targetPano) setCurrentPano(processPanoUrl(targetPano));
  };

  const handleScreenshotAndShare = (platform) => {
    const canvas = document.querySelector('canvas'); 
    if (!canvas) return;

    // Chụp ảnh từ Canvas
    const imageBase64 = canvas.toDataURL("image/png");

    // Tạo link giả để tải ảnh xuống
    const link = document.createElement('a');
    link.setAttribute('download', 'dtu-museum-checkin.png');
    link.setAttribute('href', imageBase64);
    link.click(); // Tự động click tải về

    
    let shareUrl = "";
    const currentUrl = window.location.href; // Link trang web hiện tại

    if (platform === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    } else if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent("Tôi đang tham quan Bảo tàng ảo DTU! #DTU #VirtualMuseum")}&url=${encodeURIComponent(currentUrl)}`;
    }

    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    
    alert("📸 Đã chụp ảnh góc nhìn hiện tại và tải xuống máy bạn! Hãy dùng nó để đăng bài nhé.");
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-black text-white">Đang tải dữ liệu bảo tàng...</div>;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <Navbar onShare={handleScreenshotAndShare} />
      <LogoCorner onClick={() => navigate("/")} />
      <AIGuide />
      
      {currentPano ? (
        <Canvas gl={{ preserveDrawingBuffer: true }} camera={{ position: [0, 0, 0.1], fov: 75 }} className="absolute inset-0" ref={canvasRef}>
          <Suspense fallback={null}>
            <PanoramaScene
              ref={panoRef}
              image={currentPano.imageUrl}
              hotspots={currentPanoHotspots}
              onHotspotClick={handleHotspotClick}
            />
          </Suspense>
        </Canvas>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-white">
          Chưa có dữ liệu Panorama nào.
        </div>
      )}

      <div className="absolute inset-0 pointer-events-none" />

      <ControlBar
        onZoomIn={() => panoRef.current?.zoomIn()}
        onZoomOut={() => panoRef.current?.zoomOut()}
      />

      {mode === "point" && (
        // Truyền danh sách pano làm dữ liệu cho thanh bar
        <HotspotBar 
          hotspots={allPanoramas.map(p => ({ id: p.id, name: p.title, image: processPanoUrl(p).imageUrl }))} 
          onSelect={handleBarSelect} 
        />
      )}
      
      <Loader />

      {showChat && roomId && (
        <ChatBox 
            roomId={roomId} 
            messages={messages}      
            sendMessage={sendMessage} 
            onClose={() => setShowChat(false)} 
            onLeave={handleLeaveGroup}        
        />
      )}
      
      
      {!showChat && roomId && (
        <button 
            onClick={() => setShowChat(true)}
            className="absolute bottom-20 left-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-500 transition-transform hover:scale-105 flex items-center gap-2 pointer-events-auto"
        >
            <span>💬</span> Chat ({messages.length})
        </button>
      )}
    </div>
  );
}