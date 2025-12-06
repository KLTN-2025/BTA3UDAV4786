import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Sphere, Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

const PanoramaScene = forwardRef(({ image, hotspots, onHotspotClick }, ref) => {
  const { camera, gl } = useThree();
  const controlsRef = useRef();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const keysRef = useRef({ 
    forward: false, backward: false, left: false, right: false 
  });

  const MIN_FOV = 30;
  const MAX_FOV = 90;
  const ZOOM_STEP = 5;
  const ROTATE_SPEED = 5.0;

  const handleZoom = (dir) => {
    if (isTransitioning) return;
    const currentFov = camera.fov;
    const newFov = THREE.MathUtils.clamp(
      currentFov + (dir === "in" ? -ZOOM_STEP : ZOOM_STEP),
      MIN_FOV,
      MAX_FOV
    );
    camera.fov = newFov;
    camera.updateProjectionMatrix();
  };

  useImperativeHandle(ref, () => ({
    zoomIn: () => handleZoom("in"),
    zoomOut: () => handleZoom("out"),
  }));

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isTransitioning) return;
      switch(e.code) {
        case 'KeyW': case 'ArrowUp': keysRef.current.forward = true; break;
        case 'KeyS': case 'ArrowDown': keysRef.current.backward = true; break;
        case 'KeyA': case 'ArrowLeft': keysRef.current.left = true; break;
        case 'KeyD': case 'ArrowRight': keysRef.current.right = true; break;
        default: break;
      }
    };

    const handleKeyUp = (e) => {
      switch(e.code) {
        case 'KeyW': case 'ArrowUp': keysRef.current.forward = false; break;
        case 'KeyS': case 'ArrowDown': keysRef.current.backward = false; break;
        case 'KeyA': case 'ArrowLeft': keysRef.current.left = false; break;
        case 'KeyD': case 'ArrowRight': keysRef.current.right = false; break;
        default: break;
      }
    };

    const handleWheel = (e) => {
      e.preventDefault();
      if (isTransitioning) return;
      if (e.deltaY < 0) handleZoom("in"); else handleZoom("out");
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    const dom = gl.domElement;
    dom.addEventListener("wheel", handleWheel);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      dom.removeEventListener("wheel", handleWheel);
    };
  }, [isTransitioning, gl]);

  useFrame((state, delta) => {
    if (controlsRef.current && !isTransitioning) {
      const controls = controlsRef.current;
      const speed = ROTATE_SPEED * delta;

      if (keysRef.current.left) controls.setAzimuthalAngle(controls.getAzimuthalAngle() + speed);
      if (keysRef.current.right) controls.setAzimuthalAngle(controls.getAzimuthalAngle() - speed);
      if (keysRef.current.forward) controls.setPolarAngle(controls.getPolarAngle() + speed);
      if (keysRef.current.backward) controls.setPolarAngle(controls.getPolarAngle() - speed);
      
      controls.update();
    }
  });

  const [textureMain, setTextureMain] = useState(null);
  const [textureNext, setTextureNext] = useState(null);
  const fadeMaterialRef = useRef(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(image, (tex) => {
      tex.wrapS = THREE.RepeatWrapping;
      tex.repeat.x = -1;
      setTextureMain(tex);
    });
  }, []); 

  const handleHotspotClick = (spot) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    const targetVec = new THREE.Vector3(spot.x, spot.y, spot.z);
    const spherical = new THREE.Spherical().setFromVector3(targetVec);

    const tl = gsap.timeline();
    tl.to(controlsRef.current, {
      azimuthAngle: spherical.theta,
      polarAngle: Math.PI / 2,
      duration: 0.8,
      ease: "power2.inOut"
    })
    .to(camera, {
      fov: 60,
      duration: 0.8,
      ease: "power2.inOut"
    }, "<");

    onHotspotClick(spot);
  };

  useEffect(() => {
    if (!image || !textureMain) return;
    if (textureMain.image.src === image) return;

    setIsTransitioning(true);

    const loader = new THREE.TextureLoader();
    loader.load(image, (newTex) => {
      newTex.wrapS = THREE.RepeatWrapping;
      newTex.repeat.x = -1;
      setTextureNext(newTex); 

      gsap.to(camera, { fov: 75, duration: 1.5, ease: "power2.out" });

      const fadeObj = { val: 0 };
      gsap.to(fadeObj, {
        val: 1,
        duration: 1,
        ease: "none",
        onUpdate: () => {
          if (fadeMaterialRef.current) {
            fadeMaterialRef.current.opacity = fadeObj.val;
          }
        },
        onComplete: () => {
          setTextureMain(newTex);
          setTextureNext(null);
          setIsTransitioning(false);
        }
      });
    });
  }, [image]);

  return (
    <>
      {textureMain && (
        <Sphere args={[500, 64, 64]} scale={[1, 1, 1]}>
          <meshBasicMaterial map={textureMain} side={THREE.BackSide} depthWrite={false} />
        </Sphere>
      )}

      {textureNext && (
        <Sphere args={[490, 64, 64]} scale={[1, 1, 1]}>
          <meshBasicMaterial 
            ref={fadeMaterialRef} 
            map={textureNext} 
            side={THREE.BackSide} 
            transparent={true} 
            opacity={0}
            depthWrite={false} 
            depthTest={false} 
          />
        </Sphere>
      )}

      {hotspots && hotspots.map((spot) => {
        if (spot.type === 'nav' || !spot.type) {
        const vecXZ = new THREE.Vector3(spot.x, 0, spot.z);
        vecXZ.normalize().multiplyScalar(950); 
        const floorY = -150; 

        return (
          <group 
            key={spot.id} 
            position={[vecXZ.x, floorY, -vecXZ.z]} 
            onClick={(e) => {
              e.stopPropagation();
              handleHotspotClick(spot);
            }}
            onPointerOver={() => document.body.style.cursor = 'pointer'}
            onPointerOut={() => document.body.style.cursor = 'auto'}
          >
            
           
            <mesh rotation={[-Math.PI / 2, 0, 0]} renderOrder={0} visible={false}>
                <circleGeometry args={[120, 32]} /> 
                <meshBasicMaterial />
            </mesh>

        
            <mesh rotation={[-Math.PI / 2, 0, 0]} renderOrder={1}>
               <ringGeometry args={[40, 70, 32]} /> 
               <meshBasicMaterial 
                 color="#00ffff" 
                 transparent 
                 opacity={0.6}  
                 side={THREE.DoubleSide} 
                 depthTest={false} 
               />
            </mesh>

            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.5, 0]} renderOrder={2}>
               <circleGeometry args={[30, 32]} />
               <meshBasicMaterial 
                 color="#ffffff" 
                 transparent 
                 opacity={0.9} 
                 side={THREE.DoubleSide}
                 depthTest={false} 
               />
            </mesh>
            
            {/* Label */}
            {/* <Html center position={[0, 50, 0]} pointerEvents="none" style={{ pointerEvents: 'none' }}>
               <div style={{ 
                 color: '#00ffff', // Chữ màu xanh Neon theo tông
                 textShadow: '0 2px 4px #000000', 
                 fontSize: '16px', // Font to hơn
                 fontWeight: '900',
                 fontFamily: 'Arial, sans-serif',
                 background: 'rgba(0, 0, 0, 0.7)',
                 padding: '8px 12px',
                 borderRadius: '20px',
                 border: '2px solid #00ffff', // Viền neon
                 whiteSpace: 'nowrap',
                 transform: 'scale(1.5)', // Hack scale cho to nữa
                 boxShadow: '0 0 10px #00ffff' // Đổ bóng phát sáng
               }}>
                  {spot.label || "BƯỚC TỚI ➔"}
               </div>
            </Html> */}
          </group>
        );
      }
      if (spot.type === 'info') {
            const vec = new THREE.Vector3(spot.x, spot.y, spot.z); 
            vec.normalize().multiplyScalar(450); // Kéo lại gần tường

            return (
              <group 
                key={spot.id} 
                position={[vec.x, vec.y, -vec.z]} 
                onClick={(e) => { 
                    e.stopPropagation(); 
                    onHotspotClick(spot); 
                }}
                onPointerOver={() => document.body.style.cursor = 'help'}
                onPointerOut={() => document.body.style.cursor = 'auto'}
              >
              
                <mesh 
                    visible={false}
                    lookAt={() => new THREE.Vector3(0,0,0)} 
                >
                    <planeGeometry args={[60, 60]} /> 
                    <meshBasicMaterial side={THREE.DoubleSide} />
                </mesh>

                <mesh renderOrder={5}>
                   <circleGeometry args={[20, 32]} />
                   <meshBasicMaterial color="rgba(0,0,0,0.7)" transparent depthTest={false}/>
                </mesh>
                <mesh renderOrder={6}>
                   <ringGeometry args={[20, 23, 32]} />
                   <meshBasicMaterial color="#FFD700" transparent side={THREE.DoubleSide} depthTest={false} />
                </mesh>

                <Html center position={[0, 0, 0]} style={{ pointerEvents: 'none' }}>
                   <div className="flex flex-col items-center">
                      <div className="text-2xl drop-shadow-md">ℹ️</div>
                      <div className="mt-2 bg-black/80 text-[#FFD700] px-2 py-1 rounded text-xs font-bold whitespace-nowrap border border-yellow-600/50">
                         {spot.label}
                      </div>
                   </div>
                </Html>
              </group>
            );
        }

        if (spot.type === 'chat') {
        const vec = new THREE.Vector3(spot.x, spot.y, spot.z);
        vec.normalize().multiplyScalar(450); // Khoảng cách hiển thị

        return (
          <group 
            key={spot.id} 
            position={[vec.x, vec.y, -vec.z]} 
            onClick={(e) => { 
                e.stopPropagation(); 
                onHotspotClick(spot);
            }}
            onPointerOver={() => document.body.style.cursor = 'help'}
            onPointerOut={() => document.body.style.cursor = 'auto'}
          >
          
            <mesh visible={false} lookAt={() => new THREE.Vector3(0,0,0)}>
                <planeGeometry args={[60, 80]} />
                <meshBasicMaterial side={THREE.DoubleSide} />
            </mesh>

        
            <mesh>
                <ringGeometry args={[20, 25, 32]} />
                <meshBasicMaterial color="#9C27B0" transparent opacity={0.6} side={THREE.DoubleSide} />
            </mesh>

        
            <Html center position={[0, 0, 0]} style={{ pointerEvents: 'none' }}>
                <div className="flex flex-col items-center animate-bounce-slow">
                  
                   <div className="text-4xl filter drop-shadow-lg cursor-pointer transform hover:scale-110 transition-transform">
                      🤖
                   </div>
                   <div className="mt-1 bg-purple-900/90 text-white px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap border border-purple-400 shadow-[0_0_10px_#9C27B0]">
                      {spot.label}
                   </div>
                </div>
            </Html>
          </group>
        );
    }
        
        return null;
      })}

      <OrbitControls
        ref={controlsRef}
        enableZoom={false}
        enableRotate={!isTransitioning}
        rotateSpeed={-0.5}
        enableDamping
        enablePan={false}
      />
    </>
  );
});

export default PanoramaScene;