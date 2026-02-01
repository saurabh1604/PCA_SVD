import React from 'react';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  formatValue?: (val: number) => string;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step = 0.1,
  onChange,
  formatValue,
  className = ''
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex justify-between items-center text-sm">
        <label className="text-slate-300 font-medium">{label}</label>
        <span className="text-primary font-mono bg-primary/10 px-2 py-0.5 rounded text-xs">
          {formatValue ? formatValue(value) : value.toFixed(1)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
    </div>
  );
};
