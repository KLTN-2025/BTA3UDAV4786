import { Link } from "react-router-dom";
import {
  FaMapMarkedAlt,
  FaQuestionCircle,
  FaInfoCircle,
  FaMap,
  FaEllipsisV,
  FaTimes,
  FaShareAlt,
} from "react-icons/fa";
import { useContext, useState } from "react";
import { ModeContext } from "../context/ModeContext";

function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openShare, setOpenShare] = useState(false);
  const { setMode } = useContext(ModeContext);

  return (
    <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col items-center z-20">
      {/* Nút toggle menu */}
      <button
        onClick={() => setOpenMenu(!openMenu)}
        className="text-white text-xl bg-black/40 p-2 rounded-full hover:text-yellow-300 transition"
      >
        {openMenu ? <FaTimes /> : <FaEllipsisV />}
      </button>

      {/* Menu cuộn ra / thu vào */}
      <div
        className={`flex flex-col items-center bg-black/30 backdrop-blur-md rounded-2xl mt-4 
        space-y-6 p-3 transform transition-all duration-300 origin-top
        ${
          openMenu
            ? "scale-y-100 opacity-100"
            : "scale-y-0 opacity-0 pointer-events-none"
        }`}
      >
        {/* Khám phá */}
        <Link to="/explore" className="group relative">
          <FaMapMarkedAlt className="text-white text-2xl hover:text-yellow-300" />
          <span className="tooltip">Khám phá</span>
        </Link>

        {/* Trắc nghiệm */}
        <Link to="/quiz" className="group relative">
          <FaQuestionCircle className="text-white text-2xl hover:text-yellow-300" />
          <span className="tooltip">Trắc nghiệm</span>
        </Link>

        {/* Giới thiệu */}
        <Link to="/about" className="group relative">
          <FaInfoCircle className="text-white text-2xl hover:text-yellow-300" />
          <span className="tooltip">Giới thiệu</span>
        </Link>

        {/* Dropdown chế độ khám phá */}
        <div className="group relative">
          <button
            onClick={() => setOpenDropdown(!openDropdown)}
            className="text-white text-2xl hover:text-yellow-300"
          >
            <FaMap />
          </button>
          <span className="tooltip">Chế độ khám phá</span>

          {openDropdown && (
            <div className="absolute left-[-160px] top-0 bg-black/70 rounded-lg shadow-lg py-2 w-40">
              <button
                onClick={() => {
                  setMode("point");
                  setOpenDropdown(false);
                }}
                className="block w-full text-left px-4 py-2 text-white hover:bg-yellow-500 hover:text-black"
              >
                Theo điểm
              </button>
              <button
                onClick={() => {
                  setMode("free");
                  setOpenDropdown(false);
                }}
                className="block w-full text-left px-4 py-2 text-white hover:bg-yellow-500 hover:text-black"
              >
                Tự do
              </button>
            </div>
          )}
        </div>

        {/* Dropdown Chia sẻ & Mời bạn bè */}
        <div className="group relative">
          <button
            onClick={() => setOpenShare(!openShare)}
            className="text-white text-2xl hover:text-yellow-300"
          >
            <FaShareAlt />
          </button>
          <span className="tooltip">Chia sẻ</span>

          {openShare && (
            <div className="absolute left-[-180px] top-0 bg-black/70 rounded-lg shadow-lg py-2 w-44">
              <button
                onClick={() => alert("Chia sẻ Facebook")}
                className="block w-full text-left px-4 py-2 text-white hover:bg-yellow-500 hover:text-black"
              >
                Chia sẻ mạng xã hội
              </button>
              <button
                onClick={() => alert("Mời bạn bè")}
                className="block w-full text-left px-4 py-2 text-white hover:bg-yellow-500 hover:text-black"
              >
                Khám phá cùng bạn bè
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
