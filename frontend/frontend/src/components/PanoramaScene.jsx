import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Sphere, Html, OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useSpring } from "@react-spring/three";

const PanoramaScene = forwardRef(({ image }, ref) => {
  const texture = useTexture(image);
  const { camera, gl } = useThree();
  const controlsRef = useRef();

  const [target, setTarget] = useState(new THREE.Vector3(0, 0, -1));
  const [fov, setFov] = useState(camera.fov);
  const springTarget = useSpring({
    to: { x: target.x, y: target.y, z: target.z },
    config: { mass: 2, tension: 25, friction: 40 },
  });

  // === Giới hạn và tốc độ zoom ===
  const MIN_FOV = 30;
  const MAX_FOV = 90;
  const ZOOM_STEP = 5;

  // === Zoom có animation (mượt dần) ===
  const zoomSpring = useSpring({
    fov,
    config: { mass: 1, tension: 90, friction: 25 },
    onChange: ({ value }) => {
      camera.fov = value.fov;
      camera.updateProjectionMatrix();
    },
  });

  // === Hàm zoom ===
  const handleZoom = (dir) => {
    const newFov = THREE.MathUtils.clamp(
      fov + (dir === "in" ? -ZOOM_STEP : ZOOM_STEP),
      MIN_FOV,
      MAX_FOV
    );
    setFov(newFov); 
  };

 
  useImperativeHandle(ref, () => ({
    zoomIn: () => handleZoom("in"),
    zoomOut: () => handleZoom("out"),
  }));

  // === Zoom bằng bánh xe chuột ===
  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      if (e.deltaY < 0) handleZoom("in");
      else handleZoom("out");
    };
    const dom = gl.domElement;
    dom.addEventListener("wheel", handleWheel);
    return () => dom.removeEventListener("wheel", handleWheel);
  }, [fov, gl]);

  // === Zoom bằng bàn phím (+/-) ===
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "+" || e.key === "=") handleZoom("in");
      if (e.key === "-" || e.key === "_") handleZoom("out");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [fov]);

  // === Click để xoay hướng nhìn ===
  const handleClick = (e) => {
    e.stopPropagation();
    const p = e.point;
    setTarget(p.clone().normalize());
  };

  // === Cập nhật target xoay mượt ===
  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.target.set(
        springTarget.x.get(),
        springTarget.y.get(),
        springTarget.z.get()
      );
      controlsRef.current.update();
    }
  });

  return (
    <>
      {/* Panorama sphere đảo ngược */}
      <Sphere args={[500, 64, 64]} scale={[-1, 1, 1]} onClick={handleClick}>
        <meshBasicMaterial map={texture} side={THREE.BackSide} />
      </Sphere>

      {/* Crosshair ở giữa màn hình */}
      <Html center>
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "white",
            opacity: 0.8,
            transform: "translate(-50%, -50%)",
          }}
        />
      </Html>

      {/* Orbit Controls (chỉ xoay, zoom riêng đã xử lý) */}
      <OrbitControls
        ref={controlsRef}
        enableZoom={false}
        enableRotate
        rotateSpeed={0.35}
        enablePan={false}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
});

export default PanoramaScene;
