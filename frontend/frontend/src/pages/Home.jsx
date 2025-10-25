import { Suspense, useState, useContext, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useNavigate } from "react-router-dom";
import { ModeContext } from "../context/ModeContext";
import HotspotBar from "../components/HotspotBar";
import PanoramaScene from "../components/PanoramaScene";
import ControlBar from "../components/ControlBar";
import LogoCorner from "../components/LogoCorner";
import AIGuide from "../components/AIGuide";

export default function Home() {
  const { mode } = useContext(ModeContext);
  const [currentSpot, setCurrentSpot] = useState(null);
  const navigate = useNavigate();
  const panoRef = useRef(); 

  const hotspots = [
    { id: 1, name: "Khu A", image: "/spot1.jpg" },
    { id: 2, name: "Khu B", image: "/spot2.jpg" },
    { id: 3, name: "Khu C", image: "/spot3.jpg" },
  ];

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }} className="absolute inset-0">
        <Suspense fallback={<Html>Đang tải ảnh 360...</Html>}>
          <PanoramaScene
            ref={panoRef}
            image={
              currentSpot
                ? currentSpot.image
                : "/assets/z7084010545091_f4e6a2e2ee6f7c4dc28232850a2c5017.jpg"
            }
          />
        </Suspense>
      </Canvas>

      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      <LogoCorner onClick={() => navigate("/")} />
      <ControlBar
        onZoomIn={() => panoRef.current?.zoomIn()}
        onZoomOut={() => panoRef.current?.zoomOut()}
      />
      <AIGuide />

      {mode === "point" && (
        <HotspotBar hotspots={hotspots} onSelect={(spot) => setCurrentSpot(spot)} />
      )}
    </div>
  );
}
