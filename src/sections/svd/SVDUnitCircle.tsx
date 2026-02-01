import React, { useState, useMemo } from 'react';
import { Slider } from '../../components/ui/Slider';
import { Card } from '../../components/ui/Card';
import { MathDisplay } from '../../components/MathDisplay';

export const SVDUnitCircle: React.FC = () => {
  // SVD Components
  const [vAngle, setVAngle] = useState(45);
  const [sigma1, setSigma1] = useState(2);
  const [sigma2, setSigma2] = useState(0.8);
  const [uAngle, setUAngle] = useState(30);

  // Animation Progress
  const [progress, setProgress] = useState(0);

  // Helper to transform point based on progress
  const transformPoint = (x: number, y: number) => {
    // Step 1: Rotate by V^T (vAngle)
    const radV = (-vAngle * Math.PI) / 180; // V^T is inverse rotation usually, but let's just say rotation by vAngle
    // Actually in SVD M = U S V^T. V is orthogonal. V^T is a rotation. Let's call the first rotation angle alpha.
    // If V is rot(theta), V^T is rot(-theta).
    // Let's just say "First Rotation" is by vAngle.

    // Lerp factors
    const t1 = Math.min(Math.max(progress, 0), 1);
    const t2 = Math.min(Math.max(progress - 1, 0), 1);
    const t3 = Math.min(Math.max(progress - 2, 0), 1);

    // 1. Rotation 1
    const r1 = radV * t1;
    const c1 = Math.cos(r1);
    const s1 = Math.sin(r1);
    let nx = x * c1 - y * s1;
    let ny = x * s1 + y * c1;

    // 2. Stretch
    // Scale factors interpolate from 1 to sigma
    const sx = 1 + (sigma1 - 1) * t2;
    const sy = 1 + (sigma2 - 1) * t2;
    nx = nx * sx;
    ny = ny * sy;

    // 3. Rotation 2
    const radU = (uAngle * Math.PI) / 180;
    const r2 = radU * t3;
    const c2 = Math.cos(r2);
    const s2 = Math.sin(r2);
    const fx = nx * c2 - ny * s2;
    const fy = nx * s2 + ny * c2;

    return { x: fx, y: fy };
  };

  // Generate Grid and Circle
  const gridPoints = useMemo(() => {
    const lines = [];
    const steps = 10;
    const range = 1.5;

    // Vertical lines
    for(let i = -steps; i <= steps; i++) {
        const x = (i / steps) * range;
        const line = [];
        for(let j = -steps; j <= steps; j++) {
             const y = (j / steps) * range;
             line.push({x, y});
        }
        lines.push(line);
    }
    // Horizontal lines
    for(let j = -steps; j <= steps; j++) {
        const y = (j / steps) * range;
        const line = [];
        for(let i = -steps; i <= steps; i++) {
             const x = (i / steps) * range;
             line.push({x, y});
        }
        lines.push(line);
    }
    return lines;
  }, []);

  const circlePoints = useMemo(() => {
    const pts = [];
    for(let i=0; i<=360; i+=5) {
        const rad = i * Math.PI / 180;
        pts.push({x: Math.cos(rad), y: Math.sin(rad)});
    }
    return pts;
  }, []);

  const basisX = useMemo(() => [{x:0, y:0}, {x:1, y:0}], []);
  const basisY = useMemo(() => [{x:0, y:0}, {x:0, y:1}], []);

  // Rendering Helpers
  const width = 500;
  const height = 400;
  const scale = 80; // pixels per unit
  const mapX = (x: number) => x * scale + width/2;
  const mapY = (y: number) => -y * scale + height/2;

  // Compute transformed paths
  const transformPath = (points: {x:number, y:number}[]) => {
      return points.map(p => transformPoint(p.x, p.y));
  };

  const transformedCircle = transformPath(circlePoints);
  const transformedBasisX = transformPath(basisX);
  const transformedBasisY = transformPath(basisY);

  const getStepDescription = () => {
      if(progress < 0.5) return "Step 0: Start with Unit Circle & Grid";
      if(progress < 1.5) return "Step 1: Rotate by V^T";
      if(progress < 2.5) return "Step 2: Stretch by Sigma (Singular Values)";
      return "Step 3: Rotate by U (Final Transform)";
  };

  // Compute Matrix M values for display
  // M = U * S * V^T (assuming V^T is rotation by vAngle)
  // Let's just compute the columns of M by transforming (1,0) and (0,1) fully.
  const finalX = (() => {
      // Force full transform logic calculation
      const r1 = (-vAngle * Math.PI) / 180;
      const x1 = Math.cos(r1); const y1 = Math.sin(r1);
      const x2 = x1 * sigma1; const y2 = y1 * sigma2;
      const r2 = (uAngle * Math.PI) / 180;
      return { x: x2*Math.cos(r2) - y2*Math.sin(r2), y: x2*Math.sin(r2) + y2*Math.cos(r2) };
  })();
  const finalY = (() => {
       const r1 = (-vAngle * Math.PI) / 180;
       const x1 = -Math.sin(r1); const y1 = Math.cos(r1); // (0,1) rotated
       const x2 = x1 * sigma1; const y2 = y1 * sigma2;
       const r2 = (uAngle * Math.PI) / 180;
       return { x: x2*Math.cos(r2) - y2*Math.sin(r2), y: x2*Math.sin(r2) + y2*Math.cos(r2) };
  })();


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="flex flex-col items-center justify-center bg-slate-900/50 min-h-[400px]">
        <svg width={width} height={height} className="overflow-visible">
            {/* Grid */}
            {gridPoints.map((line, i) => {
                const tLine = transformPath(line);
                const d = `M ${tLine.map(p => `${mapX(p.x)},${mapY(p.y)}`).join(' L ')}`;
                return <path key={i} d={d} stroke="#334155" strokeWidth={1} fill="none" opacity={0.5} />;
            })}

            {/* Axes Lines */}
             <line x1={0} y1={height/2} x2={width} y2={height/2} stroke="#475569" strokeWidth={1} />
             <line x1={width/2} y1={0} x2={width/2} y2={height} stroke="#475569" strokeWidth={1} />

            {/* Circle */}
            <path
                d={`M ${transformedCircle.map(p => `${mapX(p.x)},${mapY(p.y)}`).join(' L ')} Z`}
                stroke="#cbd5e1"
                strokeWidth={2}
                fill="rgba(255,255,255,0.05)"
            />

            {/* Basis Vectors */}
            {/* X (Red) */}
            <line
                x1={mapX(transformedBasisX[0].x)} y1={mapY(transformedBasisX[0].y)}
                x2={mapX(transformedBasisX[1].x)} y2={mapY(transformedBasisX[1].y)}
                stroke="#ef4444" strokeWidth={4} strokeLinecap="round"
            />
             {/* Y (Green) */}
             <line
                x1={mapX(transformedBasisY[0].x)} y1={mapY(transformedBasisY[0].y)}
                x2={mapX(transformedBasisY[1].x)} y2={mapY(transformedBasisY[1].y)}
                stroke="#10b981" strokeWidth={4} strokeLinecap="round"
            />
        </svg>
        <div className="mt-4 text-center font-bold text-lg text-primary">
            {getStepDescription()}
        </div>
      </Card>

      <div className="space-y-8">
         <div className="bg-surface/50 p-6 rounded-xl border border-slate-700">
             <h3 className="text-xl font-bold mb-6 text-white">SVD Components</h3>

             <div className="space-y-6">
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-blue-400 font-mono">1. V^T (Rotation)</span>
                    </div>
                    <Slider label="Angle" value={vAngle} min={-180} max={180} onChange={setVAngle} formatValue={v => `${v}°`} />
                </div>

                <div className="p-4 bg-slate-800/50 rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-amber-400 font-mono">2. Sigma (Stretch)</span>
                    </div>
                    <Slider label="σ₁ (Scale X)" value={sigma1} min={0.5} max={3} step={0.1} onChange={setSigma1} />
                    <Slider label="σ₂ (Scale Y)" value={sigma2} min={0.5} max={3} step={0.1} onChange={setSigma2} />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-purple-400 font-mono">3. U (Rotation)</span>
                    </div>
                    <Slider label="Angle" value={uAngle} min={-180} max={180} onChange={setUAngle} formatValue={v => `${v}°`} />
                </div>
             </div>
         </div>

         <div className="space-y-4">
             <h3 className="text-lg font-bold">Animation Control</h3>
             <Slider
                label="Progress"
                value={progress}
                min={0}
                max={3}
                step={0.01}
                onChange={setProgress}
                className="py-4"
             />
             <div className="flex justify-between text-xs text-slate-500 px-1">
                 <span>Original</span>
                 <span>Rotate 1</span>
                 <span>Stretch</span>
                 <span>Rotate 2</span>
             </div>
         </div>

         <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-700">
             <MathDisplay
               tex={`M \\approx \\begin{bmatrix} ${finalX.x.toFixed(2)} & ${finalY.x.toFixed(2)} \\\\ ${finalX.y.toFixed(2)} & ${finalY.y.toFixed(2)} \\end{bmatrix}`}
               block
             />
             <p className="text-center text-slate-500 text-xs mt-2">The resulting transformation matrix</p>
         </div>
      </div>
    </div>
  );
};
