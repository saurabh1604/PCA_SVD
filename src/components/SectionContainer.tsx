import React from 'react';

interface SectionContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const SectionContainer: React.FC<SectionContainerProps> = ({ title, subtitle, children }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700 slide-in-from-bottom-4">
      <div className="border-b border-slate-700 pb-6">
        <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">{title}</h2>
        {subtitle && <p className="text-slate-400 text-lg max-w-3xl leading-relaxed">{subtitle}</p>}
      </div>
      <div className="space-y-12">
        {children}
      </div>
    </div>
  );
};
