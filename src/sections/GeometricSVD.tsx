import React from 'react';
import { MathJax } from 'better-react-mathjax';
import { SectionContainer } from '../components/SectionContainer';
import { SVDUnitCircle } from './svd/SVDUnitCircle';
import { MathDisplay } from '../components/MathDisplay';

export const GeometricSVD: React.FC = () => {
  return (
    <SectionContainer
      title="The Geometry of SVD"
      subtitle="Singular Value Decomposition says that any matrix transformation can be broken down into three simple steps."
    >
      <div className="space-y-12">
        <div className="max-w-4xl mx-auto space-y-8">
             <div className="flex justify-center">
                <div className="bg-slate-900 px-8 py-4 rounded-xl shadow-lg border border-slate-700">
                     <MathDisplay tex="M = U \Sigma V^T" className="text-3xl" />
                </div>
             </div>

             <MathJax>
                 <p className="text-slate-300 text-lg text-center">
                     Every matrix $M$ performs a linear transformation. SVD reveals the DNA of this transformation:
                 </p>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                     <div className="bg-slate-800/50 p-5 rounded-lg border-l-4 border-blue-500">
                         <h4 className="font-bold text-white mb-2 text-lg">1. Rotate ($V^T$)</h4>
                         <p className="text-sm text-slate-400 leading-relaxed">
                            First, we rotate the space to align the data with the coordinate axes.
                         </p>
                     </div>
                     <div className="bg-slate-800/50 p-5 rounded-lg border-l-4 border-amber-500">
                         <h4 className="font-bold text-white mb-2 text-lg">2. Stretch ($\Sigma$)</h4>
                         <p className="text-sm text-slate-400 leading-relaxed">
                            Then, we stretch or shrink space along the axes. The amount of stretching is given by the singular values $\sigma_i$.
                         </p>
                     </div>
                     <div className="bg-slate-800/50 p-5 rounded-lg border-l-4 border-purple-500">
                         <h4 className="font-bold text-white mb-2 text-lg">3. Rotate ($U$)</h4>
                         <p className="text-sm text-slate-400 leading-relaxed">
                            Finally, we rotate the stretched result to its final orientation in the output space.
                         </p>
                     </div>
                 </div>
             </MathJax>
        </div>

        <SVDUnitCircle />

        <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-8 backdrop-blur-sm">
            <h3 className="font-bold text-xl text-blue-100 mb-3">Why is this important for PCA?</h3>
            <MathJax>
                <p className="text-slate-300 leading-relaxed">
                    This geometric intuition is the key to understanding PCA. PCA basically asks: "What are the main axes of variance?"
                    <br/><br/>
                    In SVD terms, if we apply SVD to our data matrix, the <strong>Principal Components</strong> are simply the directions where the "stretching" ($\Sigma$) is largest!
                    The next section connects these dots explicitly.
                </p>
            </MathJax>
        </div>
      </div>
    </SectionContainer>
  );
};
