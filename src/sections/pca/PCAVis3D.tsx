import React, { useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Slider } from '../../components/ui/Slider';

const PointCloud = ({ points, showProjection }: { points: THREE.Vector3[], showProjection: boolean }) => {
  const positions = useMemo(() => {
    const arr = new Float32Array(points.length * 3);
    points.forEach((p, i) => {
       arr[i*3] = p.x;
       arr[i*3+1] = p.y;
       arr[i*3+2] = showProjection ? 0 : p.z; // Project to xy plane if toggled
    });
    return arr;
  }, [points, showProjection]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
          size={0.15}
          color={showProjection ? "#f59e0b" : "#60a5fa"}
          sizeAttenuation
          transparent
          opacity={0.8}
      />
    </points>
  );
};

const AxisArrow = ({ dir, length, color, label }: { dir: THREE.Vector3, length: number, color: string, label: string }) => {
    const end = dir.clone().multiplyScalar(length);
    return (
        <group>
            <Line points={[[0,0,0], end]} color={color} lineWidth={3} />
            <Html position={end.toArray()}>
                <div style={{ color, fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0.5)', padding: '2px 5px', borderRadius: '4px' }}>{label}</div>
            </Html>
        </group>
    );
};

export const PCAVis3D: React.FC = () => {
    const [scale1, setScale1] = useState(3);
    const [scale2, setScale2] = useState(1);
    const [scale3, setScale3] = useState(0.5);
    const [showProjection, setShowProjection] = useState(false);

    // Fixed rotation to make it interesting (aligns with (1,1,1) somewhat)
    const rotation = useMemo(() => new THREE.Euler(Math.PI/4, Math.PI/3, 0), []);

    // Principal Components (Axes)
    const pc1 = useMemo(() => new THREE.Vector3(1,0,0).applyEuler(rotation).normalize(), [rotation]);
    const pc2 = useMemo(() => new THREE.Vector3(0,1,0).applyEuler(rotation).normalize(), [rotation]);
    const pc3 = useMemo(() => new THREE.Vector3(0,0,1).applyEuler(rotation).normalize(), [rotation]);

    const dataPoints = useMemo(() => {
        const pts = [];
        for(let i=0; i<300; i++) {
            // Box-Muller-ish approximation
            const u = Math.random() + Math.random() - 1;
            const v = Math.random() + Math.random() - 1;
            const w = Math.random() + Math.random() - 1;

            const vec = new THREE.Vector3(u * scale1, v * scale2, w * scale3);
            vec.applyEuler(rotation);
            pts.push(vec);
        }
        return pts;
    }, [scale1, scale2, scale3, rotation]);

    return (
        <div className="flex flex-col gap-6">
            <div className="h-[500px] w-full bg-slate-900/50 rounded-xl overflow-hidden border border-slate-700 relative">
                <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />

                    {/* Grid Helper */}
                    <gridHelper args={[10, 10, "#1e293b", "#1e293b"]} />
                    <axesHelper args={[1]} />

                    <PointCloud points={dataPoints} showProjection={showProjection} />

                    {/* PC Vectors */}
                    {!showProjection && (
                        <>
                            <AxisArrow dir={pc1} length={scale1} color="#ef4444" label="PC1" />
                            <AxisArrow dir={pc2} length={scale2} color="#10b981" label="PC2" />
                            <AxisArrow dir={pc3} length={scale3} color="#3b82f6" label="PC3" />
                        </>
                    )}

                    {showProjection && (
                        <>
                           {/* Projected PC Vectors (PC1 and PC2 roughly if aligned) */}
                           {/* Actually, if we just project Z to 0, the PCs might look different.
                               But visually we just want to show "Flattening". */}
                            <gridHelper args={[10, 10, "#334155", "#334155"]} position={[0, -0.01, 0]} rotation={[0,0,0]} />
                        </>
                    )}

                    <OrbitControls autoRotate={!showProjection} autoRotateSpeed={1} />
                </Canvas>

                <div className="absolute bottom-4 left-4 bg-slate-900/80 p-4 rounded-lg backdrop-blur text-sm text-slate-300 max-w-xs">
                    <p>Drag to rotate. Scroll to zoom.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                 <div className="bg-surface/50 p-6 rounded-xl border border-slate-700 space-y-6">
                    <h3 className="font-bold text-lg text-white">Data Variance (Singular Values)</h3>
                    <Slider label="σ₁ (PC1 Spread)" value={scale1} min={1} max={5} onChange={setScale1} />
                    <Slider label="σ₂ (PC2 Spread)" value={scale2} min={0.5} max={3} onChange={setScale2} />
                    <Slider label="σ₃ (PC3 Spread)" value={scale3} min={0.1} max={2} onChange={setScale3} />
                 </div>

                 <div className="bg-surface/50 p-6 rounded-xl border border-slate-700 flex flex-col justify-center h-full">
                     <h3 className="font-bold text-lg text-white mb-4">Dimensionality Reduction</h3>
                     <p className="text-slate-400 text-sm mb-6">
                         PCA allows us to drop the dimensions with the least variance (lowest $\sigma$).
                         <br/>
                         Toggle below to project this 3D data onto the 2D plane defined by the top components.
                     </p>
                     <button
                        onClick={() => setShowProjection(!showProjection)}
                        className={`px-6 py-3 rounded-lg font-bold transition-all ${showProjection ? 'bg-amber-500 text-black hover:bg-amber-400' : 'bg-slate-700 text-white hover:bg-slate-600'}`}
                     >
                        {showProjection ? "Restore 3D View" : "Project to 2D (Flatten)"}
                     </button>
                 </div>
            </div>
        </div>
    );
};
