import React, { useState, useMemo } from 'react';
import { MathJax } from 'better-react-mathjax';
import { generateGaussianData } from '../../utils/math';
import { Slider } from '../../components/ui/Slider';
import { Card } from '../../components/ui/Card';
import { MathDisplay } from '../../components/MathDisplay';

const COUNT = 150;
const INITIAL_DATA = generateGaussianData(COUNT);

export const CovarianceDemo: React.FC = () => {
  const [scaleX, setScaleX] = useState(2.5);
  const [scaleY, setScaleY] = useState(1.0);
  const [angle, setAngle] = useState(30); // degrees

  // Transform data
  const transformedData = useMemo(() => {
    const rad = (angle * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    return INITIAL_DATA.map(p => {
      // Scale
      const sx = p.x * scaleX;
      const sy = p.y * scaleY;
      // Rotate
      const rx = sx * cos - sy * sin;
      const ry = sx * sin + sy * cos;
      return { x: rx, y: ry };
    });
  }, [scaleX, scaleY, angle]);

  // Ellipse Path (2 Standard Deviations)
  const ellipsePath = useMemo(() => {
    const pts = [];
    for(let i = 0; i <= 360; i += 5) {
      const r = (i * Math.PI) / 180;
      // 2 sigma circle
      const cx = 2 * Math.cos(r);
      const cy = 2 * Math.sin(r);

      // Scale
      const sx = cx * scaleX;
      const sy = cy * scaleY;

      // Rotate
      const rad = (angle * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);

      const rx = sx * cos - sy * sin;
      const ry = sx * sin + sy * cos;
      pts.push({x: rx, y: ry});
    }
    return pts;
  }, [scaleX, scaleY, angle]);

  // Calculate Covariance Matrix
  const { varX, varY, covXY } = useMemo(() => {
    let sumX = 0, sumY = 0;
    transformedData.forEach(p => { sumX += p.x; sumY += p.y; });
    const meanX = sumX / COUNT;
    const meanY = sumY / COUNT;

    let vX = 0, vY = 0, cXY = 0;
    transformedData.forEach(p => {
      vX += (p.x - meanX) ** 2;
      vY += (p.y - meanY) ** 2;
      cXY += (p.x - meanX) * (p.y - meanY);
    });
    return { varX: vX / (COUNT - 1), varY: vY / (COUNT - 1), covXY: cXY / (COUNT - 1) };
  }, [transformedData]);

  // Rendering helpers
  const width = 400;
  const height = 350;
  const mapX = (x: number) => (x / 12) * (width / 2) + width / 2;
  const mapY = (y: number) => -(y / 12) * (height / 2) + height / 2;

  const pathD = `M ${ellipsePath.map(p => `${mapX(p.x)},${mapY(p.y)}`).join(' L ')} Z`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <Card className="flex flex-col items-center justify-center bg-slate-900/50 relative overflow-hidden">
        <svg width={width} height={height} className="overflow-visible z-10">
          {/* Grid lines */}
          <line x1={0} y1={height/2} x2={width} y2={height/2} stroke="#334155" strokeWidth={1} />
          <line x1={width/2} y1={0} x2={width/2} y2={height} stroke="#334155" strokeWidth={1} />

          {/* Ellipse */}
          <path
             d={pathD}
             fill="rgba(59, 130, 246, 0.1)"
             stroke="#3b82f6"
             strokeWidth={2}
             strokeDasharray="4 4"
          />

          {/* Points */}
          {transformedData.map((p, i) => (
            <circle
              key={i}
              cx={mapX(p.x)}
              cy={mapY(p.y)}
              r={3}
              fill="#60a5fa"
              opacity={0.6}
            />
          ))}
        </svg>
      </Card>

      <div className="space-y-8">
        <div>
           <h3 className="text-xl font-bold mb-4 text-primary">Covariance Matrix</h3>
           <div className="bg-slate-900/80 p-6 rounded-xl border border-slate-700 shadow-inner">
             <MathDisplay
               block
               tex={`C = \\begin{bmatrix} ${varX.toFixed(2)} & ${covXY.toFixed(2)} \\\\ ${covXY.toFixed(2)} & ${varY.toFixed(2)} \\end{bmatrix}`}
             />
           </div>
           <MathJax>
             <p className="text-slate-400 text-sm mt-4 leading-relaxed">
               This matrix captures the shape of the data cloud.
               <br/>
               <span className="text-blue-400 font-bold">Diagonal</span> elements ({"$C_{xx}, C_{yy}$"}) show variance (spread) along axes.
               <br/>
               <span className="text-purple-400 font-bold">Off-diagonal</span> elements ({"$C_{xy}$"}) show correlation.
             </p>
           </MathJax>
        </div>

        <div className="space-y-6 bg-surface/50 p-6 rounded-xl border border-slate-700">
          <Slider label="Spread X (Scale)" value={scaleX} min={0.5} max={5} onChange={setScaleX} />
          <Slider label="Spread Y (Scale)" value={scaleY} min={0.5} max={5} onChange={setScaleY} />
          <Slider label="Correlation (Rotate)" value={angle} min={-90} max={90} step={1} onChange={setAngle} formatValue={v => `${v.toFixed(0)}°`} />
        </div>
      </div>
    </div>
  );
};
