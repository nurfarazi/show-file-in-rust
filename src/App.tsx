import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderPicker } from './components/FolderPicker';
import { EvidenceBoard } from './components/EvidenceBoard';
import { AnalysisResult } from './types/analysis';

function App() {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFolderSelected = async (path: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await invoke<AnalysisResult>('analyze_folder_command', {
        path: path,
      });
      setSelectedFolder(path);
      setAnalysis(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      console.error('Analysis failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFolder(null);
    setAnalysis(null);
    setError(null);
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed',
              top: '1rem',
              right: '1rem',
              padding: '1rem 1.5rem',
              background: 'rgba(204, 85, 85, 0.9)',
              color: '#fff',
              borderRadius: '4px',
              zIndex: 9999,
              maxWidth: '400px',
              fontFamily: 'var(--font-mono)',
            }}
          >
            <p>{error}</p>
            <button
              onClick={() => setError(null)}
              style={{
                marginTop: '0.5rem',
                padding: '0.5rem 1rem',
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: '#fff',
                borderRadius: '2px',
                cursor: 'pointer',
                fontSize: '0.8rem',
              }}
            >
              Dismiss
            </button>
          </motion.div>
        )}

        {!analysis ? (
          <FolderPicker key="picker" onFolderSelected={handleFolderSelected} isLoading={isLoading} />
        ) : (
          <motion.div
            key="board"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ width: '100%', height: '100%' }}
          >
            <EvidenceBoard analysis={analysis} folderPath={selectedFolder!} />
            <button
              onClick={handleReset}
              style={{
                position: 'fixed',
                top: '1rem',
                left: '1rem',
                padding: '0.75rem 1.5rem',
                background: 'var(--accent-amber)',
                color: '#1a1a1a',
                border: 'none',
                borderRadius: '2px',
                cursor: 'pointer',
                fontFamily: 'var(--font-ui)',
                fontWeight: 600,
                fontSize: '0.875rem',
                zIndex: 999,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              ← New Investigation
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
