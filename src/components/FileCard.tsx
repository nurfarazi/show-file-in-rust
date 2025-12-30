import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Image,
  Code,
  Music,
  Video,
  Archive,
  File,
  Clock,
  HardDrive,
} from 'lucide-react';
import styles from './FileCard.module.css';
import { FileInfo } from '../types/analysis';

interface FileCardProps {
  file: FileInfo;
  index: number;
}

export function FileCard({ file, index }: FileCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getIcon = (ext: string) => {
    switch (ext.toLowerCase()) {
      case 'pdf':
      case 'doc':
      case 'docx':
      case 'txt':
      case 'md':
        return <FileText size={24} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
      case 'svg':
        return <Image size={24} />;
      case 'js':
      case 'ts':
      case 'tsx':
      case 'jsx':
      case 'py':
      case 'rs':
      case 'go':
      case 'java':
      case 'cpp':
      case 'c':
      case 'h':
        return <Code size={24} />;
      case 'mp3':
      case 'wav':
      case 'flac':
      case 'aac':
        return <Music size={24} />;
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'mkv':
      case 'webm':
        return <Video size={24} />;
      case 'zip':
      case 'rar':
      case '7z':
      case 'tar':
      case 'gz':
        return <Archive size={24} />;
      default:
        return <File size={24} />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 50, rotate: -5 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{
        delay: index * 0.05,
        duration: 0.4,
        type: 'spring',
        stiffness: 100,
      }}
      whileHover={{ y: -8, boxShadow: '0 16px 48px rgba(0, 0, 0, 0.6)' }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className={styles.pin} />

      <div className={styles.header}>
        <div className={styles.iconWrapper}>{getIcon(file.extension)}</div>
        <div className={styles.filename}>
          <p className={styles.name}>{file.name}</p>
          <p className={styles.extension}>.{file.extension || 'unknown'}</p>
        </div>
      </div>

      <div className={styles.details}>
        <div className={styles.row}>
          <HardDrive size={14} />
          <span>{formatFileSize(file.size)}</span>
        </div>
        <div className={styles.row}>
          <Clock size={14} />
          <span>{file.modified}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.depth}>Depth: {file.depth}</span>
        </div>
      </div>

      {isExpanded && (
        <motion.div
          className={styles.expanded}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className={styles.divider} />
          <p className={styles.label}>Full Path:</p>
          <p className={styles.path}>{file.path}</p>
        </motion.div>
      )}

      <div className={styles.stamp}>
        <span>EVIDENCE</span>
      </div>
    </motion.div>
  );
}
