import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ModeContext } from "../context/ModeContext";
import HotspotBar from "../components/HotspotBar";
import { 
  FaHome, FaPlus, FaMinus, FaArrowsAlt, FaPlay, 
  FaInfoCircle, FaShareAlt, FaQuestionCircle, FaVrCardboard, FaLandmark 
} from "react-icons/fa";

function Home() {
  const { mode } = useContext(ModeContext);
  const [currentSpot, setCurrentSpot] = useState(null);
  const navigate = useNavigate();

  const hotspots = [
    { id: 1, name: "Khu A", image: "/spot1.jpg" },
    { id: 2, name: "Khu B", image: "/spot2.jpg" },
    { id: 3, name: "Khu C", image: "/spot3.jpg" },
  ];

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Hình nền */}
      <img
        src={currentSpot ? currentSpot.image : "/museum-bg.jpeg"}
        alt="Museum"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Logo (điều hướng về trang chủ) */}
      <div 
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 flex items-center space-x-2 bg-black/40 px-3 py-2 rounded-lg 
                   text-white cursor-pointer hover:bg-black/60 transition"
      >
        <FaLandmark className="text-yellow-400 text-xl" />
        <div>
          <h1 className="text-lg font-bold">DTU VM</h1>
          <p className="text-xs text-gray-300">Virtual Museum</p>
        </div>
      </div>

      {/* Thanh công cụ */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center space-x-3 
                      bg-black/50 px-4 py-2 rounded-lg text-white text-lg">
        <button className="hover:text-yellow-300"><FaArrowsAlt /></button>
        <button className="hover:text-yellow-300"><FaVrCardboard /></button>
        <button className="hover:text-yellow-300"><FaHome /></button>
        <button className="hover:text-yellow-300"><FaMinus /></button>
        <button className="hover:text-yellow-300"><FaPlus /></button>
        <button className="hover:text-yellow-300"><FaInfoCircle /></button>
        <button className="hover:text-yellow-300"><FaShareAlt /></button>
        <button className="hover:text-yellow-300"><FaQuestionCircle /></button>
        <button className="hover:text-yellow-300"><FaPlay /></button>
      </div>

      {/* Góc phải trên */}
      <div className="absolute top-4 right-4 flex items-center space-x-3">
        <img src="/compass.png" alt="Compass" className="w-12 h-12" />
        <img src="/flag-vn.jpg" alt="VN Flag" className="w-10 h-7 rounded-sm border border-white" />
      </div>

      {/* Góc phải dưới: cô gái hướng dẫn viên & chat */}
      <div className="absolute bottom-4 right-4 flex flex-col items-center space-y-3">
        <img src="/gui-avatar.jpg" alt="AI Guide" className="w-14 h-14 rounded-full border-2 border-yellow-300 cursor-pointer hover:scale-105 transition" />
        <button className="bg-yellow-400 text-black p-3 rounded-full shadow-lg hover:bg-yellow-500">
          💬
        </button>
      </div>

      {/* Nếu đang ở chế độ point thì hiển thị HotspotBar */}
      {mode === "point" && (
        <HotspotBar
          hotspots={hotspots}
          onSelect={(spot) => setCurrentSpot(spot)}
        />
      )}
    </div>
  );
}

export default Home;
