import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileCard } from './FileCard';
import { AnalysisPanel } from './AnalysisPanel';
import styles from './EvidenceBoard.module.css';
import { AnalysisResult } from '../types/analysis';

interface EvidenceBoardProps {
  analysis: AnalysisResult;
  folderPath: string;
}

export function EvidenceBoard({ analysis, folderPath }: EvidenceBoardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    // Show analysis panel after cards have loaded
    const timer = setTimeout(() => setShowPanel(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className={styles.header}>
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={styles.title}
        >
          INVESTIGATION BOARD
        </motion.h2>
        <motion.p
          className={styles.path}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {folderPath}
        </motion.p>
      </div>

      <div className={styles.mainContent}>
        <motion.div
          className={styles.boardContainer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(212, 165, 116, 0.08) 0%, transparent 50%)`,
            backgroundAttachment: 'fixed',
          }}
        >
          <div className={styles.board}>
            {analysis.largest_files.length > 0 ? (
              <motion.div
                className={styles.cardGrid}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, staggerChildren: 0.02 }}
              >
                {analysis.largest_files.map((file, index) => (
                  <FileCard key={`${file.path}-${index}`} file={file} index={index} />
                ))}

                {/* Add all files from file_types analysis */}
                {Object.entries(analysis.file_types).map(([ext, info], typeIndex) =>
                  analysis.largest_files.slice(0, 5).map((file) => {
                    if (!file.extension && ext === 'no-extension') {
                      return null;
                    }
                    if (file.extension.toLowerCase() === ext.toLowerCase()) {
                      return null;
                    }
                    return null;
                  })
                )}
              </motion.div>
            ) : (
              <motion.div
                className={styles.emptyState}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p>No files detected in this directory.</p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {showPanel && <AnalysisPanel analysis={analysis} />}
      </div>

      <div className={styles.redString} />
    </motion.div>
  );
}
