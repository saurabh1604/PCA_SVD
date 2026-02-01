import React from 'react';
import { MathJax } from 'better-react-mathjax';

interface MathDisplayProps {
  tex: string;
  block?: boolean;
  className?: string;
}

export const MathDisplay: React.FC<MathDisplayProps> = ({ tex, block = false, className = '' }) => {
  // We explicitly wrap the content in delimiters
  const content = block ? `\\[ ${tex} \\]` : `\\( ${tex} \\)`;

  // MathJax component from better-react-mathjax renders its children as math
  return (
    <div className={className}>
      <MathJax dynamic>{content}</MathJax>
    </div>
  );
};
