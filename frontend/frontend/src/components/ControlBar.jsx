import {
  FaHome, FaPlus, FaMinus, FaArrowsAlt, FaPlay,
  FaInfoCircle, FaShareAlt, FaQuestionCircle, FaVrCardboard
} from "react-icons/fa";

export default function ControlBar({ onZoomIn, onZoomOut }) {
  return (
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center space-x-3 
                    bg-black/50 px-4 py-2 rounded-lg text-white text-lg z-10">
      <button className="hover:text-yellow-300"><FaArrowsAlt /></button>
      <button className="hover:text-yellow-300"><FaVrCardboard /></button>
      <button className="hover:text-yellow-300"><FaHome /></button>
      <button onClick={onZoomOut} className="hover:text-yellow-300"><FaMinus /></button>
      <button onClick={onZoomIn} className="hover:text-yellow-300"><FaPlus /></button>
      <button className="hover:text-yellow-300"><FaInfoCircle /></button>
      <button className="hover:text-yellow-300"><FaShareAlt /></button>
      <button className="hover:text-yellow-300"><FaQuestionCircle /></button>
      <button className="hover:text-yellow-300"><FaPlay /></button>
    </div>
  );
}
