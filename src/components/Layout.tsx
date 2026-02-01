import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Layers, Box } from 'lucide-react';
import clsx from 'clsx';

type Tab = 'fundamentals' | 'svd' | 'pca';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'fundamentals', label: 'Fundamentals', icon: <Layers size={18} /> },
    { id: 'svd', label: 'Geometric SVD', icon: <Box size={18} /> },
    { id: 'pca', label: 'PCA & SVD', icon: <Brain size={18} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="bg-surface/50 backdrop-blur-md border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-primary to-purple-600 p-2 rounded-lg">
                <Brain className="text-white" size={24} />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Intuitive Math
              </h1>
            </div>

            <nav className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={clsx(
                    "relative px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
                    activeTab === tab.id ? "text-white" : "text-slate-400 hover:text-slate-200"
                  )}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-slate-700 rounded-md"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {tab.icon} {tab.label}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      <footer className="border-t border-slate-800 mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>Visualizing the beauty of Linear Algebra.</p>
        </div>
      </footer>
    </div>
  );
};
