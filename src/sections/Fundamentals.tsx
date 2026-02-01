import React from 'react';
import { SectionContainer } from '../components/SectionContainer';
import { CovarianceDemo } from './fundamentals/CovarianceDemo';
import { ProjectionDemo } from './fundamentals/ProjectionDemo';

export const Fundamentals: React.FC = () => {
  return (
    <SectionContainer
      title="Foundations of PCA"
      subtitle="Before we dive into Principal Component Analysis, we need to intuitively understand two key geometric concepts: Covariance and Projection."
    >
      <div className="space-y-24">
        {/* Topic 1 */}
        <div className="space-y-8">
          <div className="max-w-3xl">
            <h3 className="text-2xl font-semibold text-blue-400 mb-3">1. Variance & Covariance</h3>
            <p className="text-slate-300 leading-relaxed">
              In data science, we describe the "shape" of a dataset using the <strong>Covariance Matrix</strong>.
              <br/>
              If we treat data as a cloud of points, <strong>Variance</strong> tells us how wide the cloud is along the axes,
              and <strong>Covariance</strong> tells us if the cloud is tilted (correlated).
            </p>
          </div>
          <CovarianceDemo />
        </div>

        {/* Topic 2 */}
        <div className="space-y-8">
           <div className="max-w-3xl">
            <h3 className="text-2xl font-semibold text-amber-400 mb-3">2. Projection & Dimensionality Reduction</h3>
            <p className="text-slate-300 leading-relaxed">
              PCA is a method of <strong>Dimensionality Reduction</strong>. It projects data from a higher dimension (e.g., 2D) onto a lower dimension (e.g., 1D line).
              <br/>
              Intuitively, we want to find the "shadow" of the data that looks most like the original object.
              The "best" projection is the one that <span className="text-amber-400">maximizes Variance</span> (spread)
              and <span className="text-red-400">minimizes Error</span> (distance lost).
            </p>
          </div>
          <ProjectionDemo />
        </div>
      </div>
    </SectionContainer>
  );
};
