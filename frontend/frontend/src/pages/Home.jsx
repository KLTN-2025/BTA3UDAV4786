import { Suspense, useState, useContext, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, Loader } from "@react-three/drei";
import { useNavigate, useSearchParams } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { ModeContext } from "../context/ModeContext";
import { PanoramaAPI } from "../api/panoramaApi";
import { HotspotAPI } from "../api/hotspotApi";
import { ArtifactAPI } from "../api/artifactApi";
import HotspotBar from "../components/HotspotBar";
import PanoramaScene from "../components/PanoramaScene";
import ControlBar from "../components/ControlBar";
import LogoCorner from "../components/LogoCorner";
import Navbar from "../components/Navbar";
import ChatBox from "../components/ChatBox";
import GuideChatModal from "../components/GuideChatModal"
import HistoryModal from "../components/HistoryModal";
import ArtifactModal from "../components/ArtifactModal";
import ExploreModal from "../components/ExploreModal";
import TimelineDrawer from "../components/TimelineDrawer";
import { FaChevronRight } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { useChat } from "../hooks/useChat";
import XRWrapper, { xrStore } from "../components/XRWrapper";
import { confirmDelete, notifySuccess, notifyError } from '../utils/alertHelper';

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
  const [showExplore, setShowExplore] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

  const [allPanoramas, setAllPanoramas] = useState([]);
  const [allHotspots, setAllHotspots] = useState([]);
  const [currentPano, setCurrentPano] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showHistory, setShowHistory] = useState(false);
  const [visitHistory, setVisitHistory] = useState([]);
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [selectedChatSpot, setSelectedChatSpot] = useState(null);
  const handleToggleVR = () => {
    xrStore.enterVR();
  };
  

  useEffect(() => {
    async function loadData() {
      try {
        const [panos, spots] = await Promise.all([
          PanoramaAPI.list(),
          HotspotAPI.list()
        ]);
        
        setAllPanoramas(panos);
        setAllHotspots(spots);

        // Chọn pano đầu tiên làm mặc định
        if (panos.length > 0) {
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

  useEffect(() => {
    if (!currentPano) return;
    const savedHistory = JSON.parse(localStorage.getItem("visit_history") || "[]");
    const filteredHistory = savedHistory.filter(h => h.id !== currentPano.id);

    const newEntry = {
      id: currentPano.id,
      title: currentPano.title,
      image: currentPano.imageUrl,
      timestamp: Date.now()
    };

    const newHistory = [newEntry, ...filteredHistory].slice(0, 20);

    setVisitHistory(newHistory);
    localStorage.setItem("visit_history", JSON.stringify(newHistory));

  }, [currentPano]);

  const handleLeaveGroup = () => {
    if (window.confirm("Bạn có chắc muốn rời nhóm và xóa đoạn chat?")) {
        setSearchParams({}); 
        setShowChat(false);
        clearMessages();
        
    }
  };

  

  const processPanoUrl = (pano) => {
    let fixedUrl = pano.imageUrl;
    if (fixedUrl.startsWith("blob:") || fixedUrl.startsWith("/uploads")) {
      fixedUrl = `http://localhost:4000${pano.imageUrl.replace("blob:", "").replace(/^\/+/, "/")}`;
    }
    return { ...pano, imageUrl: fixedUrl };
  };

  const currentPanoHotspots = allHotspots.filter(
    (h) => currentPano && h.fromPanoramaId === currentPano.id
  );


  const handleHotspotClick = async (spot) => {
    if (spot.type === 'nav' || !spot.type) {
        const nextPano = allPanoramas.find((p) => p.id === spot.toPanoramaId);
        if (nextPano) {
          setCurrentPano(processPanoUrl(nextPano));
        }
    } 
    
    else if (spot.type === 'info' && spot.artifactId) {
        try {
            if (spot.artifact) {
                setSelectedArtifact(spot.artifact);
            } 
            else {
                const data = await ArtifactAPI.getById(spot.artifactId);
                setSelectedArtifact(data);
            }
        } catch (e) {
            console.error("Lỗi tải vật phẩm:", e);
        }
    }

    else if (spot.type === 'chat') {
       setSelectedChatSpot({
           name: spot.label,
           instruction: spot.instruction, 
           knowledge: spot.knowledge     
       });
    }
  };


  const handleViewArtifactFromChat = (artifactData) => {
      setSelectedArtifact({
          id: artifactData.external_id || artifactData.id,
          name: artifactData.name,
          description: artifactData.description,
          imageUrl: artifactData.imageUrl
      });
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
    const currentUrl = window.location.href;

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

  const handleHistorySelect = (panoId) => {
    const targetPano = allPanoramas.find(p => p.id === panoId);
    if (targetPano) {
      setCurrentPano(processPanoUrl(targetPano));
    }
  };

  const handleClearHistory = () => {
    setVisitHistory([]);
    localStorage.removeItem("visit_history");
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-black text-white">Đang tải dữ liệu bảo tàng...</div>;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <Navbar 
      onShare={handleScreenshotAndShare}
      onToggleHistory={() => setShowHistory(!showHistory)}
      onOpenExplore={() => setShowExplore(true)}
       />
      <LogoCorner onClick={() => navigate("/")} />
      
      
      {currentPano ? (
        <Canvas gl={{ preserveDrawingBuffer: true }} camera={{ position: [0, 0, 0.1], fov: 75 }} className="absolute inset-0" ref={canvasRef} >
          <XRWrapper>
          <Suspense fallback={null}>
            <PanoramaScene
              ref={panoRef}
              image={currentPano.imageUrl}
              hotspots={currentPanoHotspots}
              onHotspotClick={handleHotspotClick}
              
            />
          </Suspense>
          </XRWrapper>
        </Canvas>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-white">
          Chưa có dữ liệu Panorama nào.
        </div>
      )}

      <div className="absolute inset-0 pointer-events-none" />

      {!showTimeline && (
          <button 
            onClick={() => setShowTimeline(true)}
            className="absolute top-24 left-0 z-40 bg-gradient-to-r from-[#4e342e] to-[#3e2723] text-white pl-4 pr-6 py-2 rounded-r-full shadow-lg flex items-center gap-3 group border-l-4 border-yellow-500"
          >
          
            <div className="flex flex-col items-start">
                <span className="text-[10px] text-yellow-200 uppercase tracking-widest leading-none mb-0.5">Khám phá</span>
                <span className="font-bold text-sm font-serif leading-none">Lịch Sử DTU</span>
            </div>
            <FaChevronRight className="text-white/50" />
          </button>
      )}

      {showTimeline && (
        <TimelineDrawer onClose={() => setShowTimeline(false)} />
      )}

      {showExplore && (
        <ExploreModal 
          onClose={() => setShowExplore(false)}
        />
      )}

      {showHistory && (
        <HistoryModal 
          history={visitHistory}
          onSelect={handleHistorySelect}
          onClose={() => setShowHistory(false)}
          onClear={handleClearHistory}
        />
      )}

      {selectedArtifact && (
        <ArtifactModal 
            artifact={selectedArtifact} 
            onClose={() => {
                setSelectedArtifact(null);
                window.speechSynthesis.cancel();
            }} 
        />
      )}

      <ControlBar
        onZoomIn={() => panoRef.current?.zoomIn()}
        onZoomOut={() => panoRef.current?.zoomOut()}
        onToggleVR={handleToggleVR}
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

      {selectedChatSpot && (
          <GuideChatModal 
             guideName={selectedChatSpot.name}
             instruction={selectedChatSpot.instruction}
             knowledge={selectedChatSpot.knowledge}
             onClose={() => setSelectedChatSpot(null)}
             onViewArtifact={handleViewArtifactFromChat}
          />
       )}
    </div>
  );
}