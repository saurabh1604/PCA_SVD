import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`bg-surface/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm shadow-xl ${className}`}>
      {children}
    </div>
  );
};
