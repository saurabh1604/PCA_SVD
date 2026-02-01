import { useState } from 'react';
import { MathJaxContext } from 'better-react-mathjax';
import { Layout } from './components/Layout';
import { Fundamentals } from './sections/Fundamentals';
import { GeometricSVD } from './sections/GeometricSVD';
import { PCAConnection } from './sections/PCAConnection';

// MathJax Configuration
const mathJaxConfig = {
  loader: { load: ["input/tex", "output/chtml"] },
  tex: {
    inlineMath: [["$", "$"], ["\\(", "\\)"]],
    displayMath: [["$$", "$$"], ["\\[", "\\]"]],
    packages: { "[+]": ["base", "ams"] }
  }
};

type Tab = 'fundamentals' | 'svd' | 'pca';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('fundamentals');

  return (
    <MathJaxContext config={mathJaxConfig}>
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === 'fundamentals' && <Fundamentals />}
        {activeTab === 'svd' && <GeometricSVD />}
        {activeTab === 'pca' && <PCAConnection />}
      </Layout>
    </MathJaxContext>
  );
}

export default App;
