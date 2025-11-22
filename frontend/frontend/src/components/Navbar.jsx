import { Link, useNavigate } from "react-router-dom";
import {
  FaMapMarkedAlt,
  FaInfoCircle,
  FaMap,
  FaEllipsisV,
  FaTimes,
  FaShareAlt,
  FaGraduationCap,
  FaFacebookF,
  FaTwitter,
  FaDownload,
  FaUsers
} from "react-icons/fa";
import { useContext, useState } from "react";
import { ModeContext } from "../context/ModeContext";
import { v4 as uuidv4 } from 'uuid';

function Navbar({ onShare }) {
  const [openMenu, setOpenMenu] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openShare, setOpenShare] = useState(false);
  const { setMode } = useContext(ModeContext);
  const navigate = useNavigate();

  const handleCreateGroup = () => {
    const newRoomId = `room-${uuidv4().slice(0, 8)}`;
    navigate(`/?room=${newRoomId}`);
    
    const link = `${window.location.origin}/?room=${newRoomId}`;
    navigator.clipboard.writeText(link);
    alert(`✅ Đã tạo phòng: ${newRoomId}\n🔗 Link đã copy vào bộ nhớ tạm!\nGửi cho bạn bè để cùng tham quan nhé.`);
    
    
    setOpenMenu(false);
  };

  return (
    <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col items-center z-20">
     
      <button
        onClick={() => setOpenMenu(!openMenu)}
        className="text-white text-xl bg-black/40 p-2 rounded-full hover:text-yellow-300 transition backdrop-blur-sm border border-white/10"
      >
        {openMenu ? <FaTimes /> : <FaEllipsisV />}
      </button>

      
      <div
        className={`flex flex-col items-center bg-black/60 backdrop-blur-md rounded-2xl mt-4 
        space-y-6 p-3 transform transition-all duration-300 origin-top border border-white/10
        ${
          openMenu
            ? "scale-y-100 opacity-100"
            : "scale-y-0 opacity-0 pointer-events-none"
        }`}
      >
        
        <Link to="/explore" className="group relative">
          <FaMapMarkedAlt className="text-white text-2xl hover:text-yellow-300 transition" />
          <span className="tooltip-right">Khám phá</span>
        </Link>

      
        <Link to="/learning" className="group relative">
          <FaGraduationCap className="text-white text-2xl hover:text-yellow-300 transition" />
          <span className="tooltip-right">Học tập</span>
        </Link>

       
        <Link to="/about" className="group relative">
          <FaInfoCircle className="text-white text-2xl hover:text-yellow-300 transition" />
          <span className="tooltip-right">Giới thiệu</span>
        </Link>

        
        <div className="group relative">
          <button
            onClick={() => setOpenDropdown(!openDropdown)}
            className="text-white text-2xl hover:text-yellow-300 transition"
          >
            <FaMap />
          </button>
          <span className="tooltip-right">Chế độ xem</span>

          {openDropdown && (
            <div className="absolute right-[60px] top-0 bg-black/80 rounded-lg shadow-lg py-2 w-40 border border-yellow-500/30 backdrop-blur-xl animate-fadeIn">
              <button
                onClick={() => {
                  setMode("point");
                  setOpenDropdown(false);
                }}
                className="block w-full text-left px-4 py-2 text-white hover:bg-yellow-600 hover:text-white transition"
              >
                📍 Theo điểm
              </button>
              <button
                onClick={() => {
                  setMode("free");
                  setOpenDropdown(false);
                }}
                className="block w-full text-left px-4 py-2 text-white hover:bg-yellow-600 hover:text-white transition"
              >
                🕊️ Tự do
              </button>
            </div>
          )}
        </div>

      
        <div className="group relative">
          <button
            onClick={() => setOpenShare(!openShare)}
            className={`text-2xl transition ${openShare ? "text-yellow-300" : "text-white hover:text-yellow-300"}`}
          >
            <FaShareAlt />
          </button>
          <span className="tooltip-right">Chia sẻ</span>

          {openShare && (
            <div className="absolute right-[60px] top-[-40px] bg-black/80 backdrop-blur-xl rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)] p-3 w-48 border border-yellow-500/30 animate-fadeIn">
              <p className="text-gray-400 text-[10px] mb-2 text-center uppercase tracking-wider">Chụp & Chia sẻ góc này</p>
              
              <button onClick={() => onShare && onShare('facebook')} className="flex items-center w-full text-left px-3 py-2 text-white hover:bg-[#1877F2] rounded-lg transition mb-1">
                <FaFacebookF className="mr-3" /> Facebook
              </button>
              
              <button onClick={() => onShare && onShare('twitter')} className="flex items-center w-full text-left px-3 py-2 text-white hover:bg-[#1DA1F2] rounded-lg transition mb-1">
                <FaTwitter className="mr-3" /> Twitter
              </button>

              <button onClick={() => onShare && onShare('download')} className="flex items-center w-full text-left px-3 py-2 text-white hover:bg-gray-600 rounded-lg transition">
                <FaDownload className="mr-3" /> Tải ảnh về
              </button>
            </div>
          )}
        </div>

       
        <button 
            onClick={handleCreateGroup}
            className="group relative text-white text-2xl hover:text-yellow-300 transition"
        >
            <FaUsers />
            <span className="tooltip-right">Khám phá theo nhóm</span>
        </button>

      </div>

     
      <style>{`
        .tooltip-right {
            position: absolute;
            right: 140%; 
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0,0,0,0.8);
            color: #fcd34d; 
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s;
            border: 1px solid rgba(255,255,255,0.1);
            z-index: 50;
        }
        .group:hover .tooltip-right {
            opacity: 1;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateX(-10px); }
            to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeIn {
            animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default Navbar;