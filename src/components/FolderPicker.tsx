import React, { useState } from 'react';
import { open } from '@tauri-apps/plugin-dialog';
import { motion } from 'framer-motion';
import { Search as MagnifyingGlassIcon, Folder } from 'lucide-react';
import Lottie from 'lottie-react';
import styles from './FolderPicker.module.css';
import loadingAnimation from '../assets/animations/loading.json';

interface FolderPickerProps {
  onFolderSelected: (path: string) => void;
  isLoading?: boolean;
}

export function FolderPicker({ onFolderSelected, isLoading }: FolderPickerProps) {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const handlePickFolder = async () => {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
        title: 'Select a Folder to Investigate',
      });

      if (typeof selected === 'string' && selected) {
        setSelectedPath(selected);
        onFolderSelected(selected);
      }
    } catch (error) {
      console.error('Failed to select folder:', error);
    }
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className={styles.background} />

      <motion.div
        className={styles.content}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <h1 className={styles.title}>FILE DETECTIVE</h1>
        <p className={styles.subtitle}>Investigation Agency</p>

        <div className={styles.description}>
          <p>Open a case file and uncover the secrets hidden in your folders.</p>
          <p>Every file tells a story. Every pattern reveals the truth.</p>
        </div>

        <motion.button
          className={styles.pickButton}
          onClick={handlePickFolder}
          disabled={isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MagnifyingGlassIcon size={24} />
          <span>OPEN CASE FILE</span>
          <Folder size={24} />
        </motion.button>

        {selectedPath && (
          <motion.div
            className={styles.pathDisplay}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className={styles.label}>Current Investigation:</p>
            <p className={styles.path}>{selectedPath}</p>
          </motion.div>
        )}

        {isLoading && (
          <div className={styles.loading}>
            <Lottie 
              animationData={loadingAnimation} 
              loop={true} 
              style={{ width: 200, height: 200 }}
            />
          </div>
        )}
      </motion.div>

      <div className={styles.filmGrain} />
    </motion.div>
  );
}
