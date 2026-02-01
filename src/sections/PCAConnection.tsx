import React from 'react';
import { MathJax } from 'better-react-mathjax';
import { SectionContainer } from '../components/SectionContainer';
import { PCAVis3D } from './pca/PCAVis3D';
import { MathDisplay } from '../components/MathDisplay';

const TEX_COV_DEF = "C = \\frac{1}{n-1} X^T X";
const TEX_SUBST = "X^T X = (V \\Sigma U^T)(U \\Sigma V^T)";
const TEX_CONCLUSION = "C = V \\left(\\frac{\\Sigma^2}{n-1}\\right) V^T";

export const PCAConnection: React.FC = () => {
  return (
    <SectionContainer
      title="Connecting SVD to PCA"
      subtitle="How do we actually find these Principal Components? The answer is in the SVD."
    >
      <div className="space-y-20">
         {/* Math Proof */}
         <div className="space-y-8">
             <MathJax>
                 <div className="prose prose-invert max-w-3xl">
                    <p className="text-slate-300 text-lg leading-relaxed">
                        We know that PCA looks for the eigenvectors of the <strong>Covariance Matrix</strong> $C$.
                        But calculating $C$ directly can be expensive or numerically unstable.
                        <br/>
                        Let's see what happens if we plug the SVD of our data matrix $X$ (where $X = U \Sigma V^T$) into the definition of Covariance.
                    </p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-colors">
                        <h4 className="text-blue-400 font-bold mb-4">Step 1: Definition of Covariance</h4>
                        <MathDisplay block tex={TEX_COV_DEF} />
                        <p className="text-sm text-slate-400 mt-4">
                            The covariance matrix is essentially the dot product of the data with itself (scaled by $n-1$).
                        </p>
                    </div>

                    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 hover:border-amber-500/50 transition-colors">
                         <h4 className="text-amber-400 font-bold mb-4">Step 2: Substitute SVD</h4>
                         <MathDisplay block tex={TEX_SUBST} />
                         <p className="text-sm text-slate-400 mt-4">
                            We substitute $X$. Since $U$ is an orthogonal matrix, $U^T U = I$ (Identity), so they cancel out!
                         </p>
                    </div>
                 </div>

                 <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 p-8 rounded-xl border border-purple-500/30 text-center relative overflow-hidden mt-8">
                     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-amber-500"></div>
                     <h4 className="text-white font-bold text-2xl mb-6">The Grand Conclusion</h4>
                     <MathDisplay block tex={TEX_CONCLUSION} className="text-3xl my-6" />
                     <p className="text-slate-200 mt-6 max-w-2xl mx-auto text-lg leading-relaxed">
                         This is an <strong>Eigendecomposition</strong>!
                         <br/><br/>
                         It proves that the <strong>Principal Components</strong> (eigenvectors of $C$) are exactly the columns of $V$ (the "Right Singular Vectors" from SVD).
                         <br/>
                         And the variance along each component is {`$\\frac{\\sigma^2}{n-1}$`}.
                     </p>
                 </div>
             </MathJax>
         </div>

         {/* 3D Visualization */}
         <div className="space-y-8">
             <MathJax>
                 <div className="border-t border-slate-700 pt-8">
                    <h3 className="text-2xl font-bold text-white mb-2">Interactive 3D PCA</h3>
                    <p className="text-slate-400 max-w-3xl">
                        Below is a 3D dataset generated with SVD parameters. The colored arrows represent the Principal Components derived from the Singular Vectors ($V$).
                        Notice how they perfectly align with the axes of the data ellipsoid.
                    </p>
                 </div>
             </MathJax>
             <PCAVis3D />
         </div>
      </div>
    </SectionContainer>
  );
};
