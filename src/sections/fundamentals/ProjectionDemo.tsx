import React, { useState, useMemo } from 'react';
import { generateGaussianData } from '../../utils/math';
import { Slider } from '../../components/ui/Slider';
import { Card } from '../../components/ui/Card';

const COUNT = 40;
const RAW_DATA = generateGaussianData(COUNT);
// Create a fixed correlated dataset
const FIXED_DATA = RAW_DATA.map(p => ({
    x: p.x * 2.5 + p.y * 0.5,
    y: p.x * 1.0 + p.y * 0.8
}));
// Center it exactly
const meanX = FIXED_DATA.reduce((s, p) => s + p.x, 0) / COUNT;
const meanY = FIXED_DATA.reduce((s, p) => s + p.y, 0) / COUNT;
const DATA = FIXED_DATA.map(p => ({ x: p.x - meanX, y: p.y - meanY }));

const TOTAL_VARIANCE = DATA.reduce((sum, p) => sum + (p.x**2 + p.y**2), 0);

export const ProjectionDemo: React.FC = () => {
  const [angle, setAngle] = useState(0); // degrees

  const { projectedData, capturedVariance, reconstructionError } = useMemo(() => {
    const rad = (angle * Math.PI) / 180;
    const ux = Math.cos(rad);
    const uy = Math.sin(rad);

    let currentVar = 0;
    const projs = DATA.map(p => {
        // Dot product
        const dot = p.x * ux + p.y * uy;
        currentVar += dot * dot;

        // Projected point vector
        return {
            orig: p,
            proj: { x: dot * ux, y: dot * uy },
            val: dot // scalar value on line
        };
    });

    return {
        projectedData: projs,
        capturedVariance: currentVar,
        reconstructionError: TOTAL_VARIANCE - currentVar
    };
  }, [angle]);

  // Normalize for display (0-100%)
  const varPercent = (capturedVariance / TOTAL_VARIANCE) * 100;
  const errPercent = (reconstructionError / TOTAL_VARIANCE) * 100;

  // Rendering helpers
  const width = 400;
  const height = 350;
  const mapX = (x: number) => (x / 10) * (width / 2) + width / 2;
  const mapY = (y: number) => -(y / 10) * (height / 2) + height / 2;

  // Line endpoints (for visualization)
  const rad = (angle * Math.PI) / 180;
  const lx1 = Math.cos(rad) * 10;
  const ly1 = Math.sin(rad) * 10;
  const lx2 = -lx1;
  const ly2 = -ly1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <Card className="flex flex-col items-center justify-center bg-slate-900/50">
        <svg width={width} height={height} className="overflow-visible">
          {/* Axis */}
          <line x1={0} y1={height/2} x2={width} y2={height/2} stroke="#334155" strokeWidth={1} />
          <line x1={width/2} y1={0} x2={width/2} y2={height} stroke="#334155" strokeWidth={1} />

          {/* Projection Line */}
          <line
            x1={mapX(lx1)} y1={mapY(ly1)}
            x2={mapX(lx2)} y2={mapY(ly2)}
            stroke="#f59e0b" strokeWidth={2}
          />

          {/* Projection segments (error lines) */}
          {projectedData.map((p, i) => (
            <line
                key={`line-${i}`}
                x1={mapX(p.orig.x)} y1={mapY(p.orig.y)}
                x2={mapX(p.proj.x)} y2={mapY(p.proj.y)}
                stroke="#ef4444"
                strokeWidth={1}
                strokeOpacity={0.4}
            />
          ))}

          {/* Original Points */}
          {projectedData.map((p, i) => (
            <circle
              key={`orig-${i}`}
              cx={mapX(p.orig.x)}
              cy={mapY(p.orig.y)}
              r={3}
              fill="#60a5fa"
              opacity={0.4}
            />
          ))}

           {/* Projected Points */}
           {projectedData.map((p, i) => (
            <circle
              key={`proj-${i}`}
              cx={mapX(p.proj.x)}
              cy={mapY(p.proj.y)}
              r={3}
              fill="#f59e0b"
            />
          ))}
        </svg>
      </Card>

      <div className="space-y-8">
        <div>
           <h3 className="text-xl font-bold mb-4 text-primary">Dimensionality Reduction</h3>
           <p className="text-slate-400 text-sm mb-6">
             We want to find a line (1D subspace) that best represents the 2D data.
             This involves a trade-off:
           </p>

           <div className="space-y-4">
             <div>
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-amber-400 font-bold">Captured Variance</span>
                    <span>{varPercent.toFixed(1)}%</span>
                </div>
                <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${varPercent}%` }}></div>
                </div>
                <p className="text-xs text-slate-500 mt-1">Goal: Maximize the spread of projected points (yellow).</p>
             </div>

             <div>
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-red-400 font-bold">Reconstruction Error</span>
                    <span>{errPercent.toFixed(1)}%</span>
                </div>
                <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 transition-all duration-300" style={{ width: `${errPercent}%` }}></div>
                </div>
                <p className="text-xs text-slate-500 mt-1">Goal: Minimize the distance from original points to the line (red lines).</p>
             </div>
           </div>
        </div>

        <div className="bg-surface/50 p-6 rounded-xl border border-slate-700">
          <Slider
             label="Rotate Line"
             value={angle}
             min={0}
             max={180}
             step={1}
             onChange={setAngle}
             formatValue={v => `${v.toFixed(0)}°`}
          />
           <p className="text-xs text-slate-400 mt-4 italic">
             Notice: When Variance is maximized, Error is minimized. They sum to a constant!
             PCA finds the angle where the amber bar is full.
           </p>
        </div>
      </div>
    </div>
  );
};
