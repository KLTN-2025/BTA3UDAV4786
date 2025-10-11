import { FaMapMarkerAlt, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useState } from "react";

function HotspotBar({ hotspots, onSelect }) {
  const [index, setIndex] = useState(0);

  const prevSpot = () => {
    setIndex((prev) => (prev > 0 ? prev - 1 : hotspots.length - 1));
    onSelect(hotspots[(index - 1 + hotspots.length) % hotspots.length]);
  };

  const nextSpot = () => {
    setIndex((prev) => (prev + 1) % hotspots.length);
    onSelect(hotspots[(index + 1) % hotspots.length]);
  };

  return (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center space-x-4 bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl z-30">
      <button
        onClick={prevSpot}
        className="text-white text-2xl hover:text-yellow-300"
      >
        <FaArrowLeft />
      </button>

      <div className="flex flex-col items-center">
        <FaMapMarkerAlt className="text-red-500 text-3xl" />
        <span className="text-xs text-white mt-1">{hotspots[index].name}</span>
      </div>

      <button
        onClick={nextSpot}
        className="text-white text-2xl hover:text-yellow-300"
      >
        <FaArrowRight />
      </button>
    </div>
  );
}

export default HotspotBar;
