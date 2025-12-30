import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Zap, AlertCircle, TrendingUp } from 'lucide-react';
import styles from './AnalysisPanel.module.css';
import { AnalysisResult } from '../types/analysis';

interface AnalysisPanelProps {
  analysis: AnalysisResult;
}

export function AnalysisPanel({ analysis }: AnalysisPanelProps) {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
  };

  const topFileTypes = Object.entries(analysis.file_types)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 5);

  const suspectFiles = analysis.largest_files.slice(0, 3);

  return (
    <motion.div
      className={styles.panel}
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>CASE NOTES</h3>
        <span className={styles.detective}>🔍 Detective Report</span>
      </div>

      <div className={styles.content}>
        {/* Summary Stats */}
        <motion.section
          className={styles.section}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h4 className={styles.sectionTitle}>📋 Summary</h4>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.label}>Total Files</span>
              <span className={styles.value}>{analysis.total_files}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.label}>Total Folders</span>
              <span className={styles.value}>{analysis.total_folders}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.label}>Total Size</span>
              <span className={styles.value}>{formatBytes(analysis.total_size)}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.label}>Max Depth</span>
              <span className={styles.value}>{analysis.max_depth}</span>
            </div>
          </div>
        </motion.section>

        {/* Suspects of Interest */}
        <motion.section
          className={styles.section}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h4 className={styles.sectionTitle}>⚠️ Suspects of Interest</h4>
          <div className={styles.suspectList}>
            {suspectFiles.map((file, i) => (
              <div key={i} className={styles.suspect}>
                <span className={styles.rank}>#{i + 1}</span>
                <span className={styles.fileName}>{file.name}</span>
                <span className={styles.fileSize}>{formatBytes(file.size)}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* File Types Investigation */}
        <motion.section
          className={styles.section}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h4 className={styles.sectionTitle}>🔎 File Type Distribution</h4>
          <div className={styles.typesList}>
            {topFileTypes.map(([ext, info], i) => (
              <div key={ext} className={styles.typeRow}>
                <span className={styles.typeLabel}>
                  {ext === 'no-extension' ? '[no ext]' : ext.toUpperCase()}
                </span>
                <div className={styles.typeBar}>
                  <motion.div
                    className={styles.typeBarFill}
                    initial={{ width: 0 }}
                    animate={{ width: `${(info.count / analysis.total_files) * 100}%` }}
                    transition={{ delay: 0.7 + i * 0.1, duration: 0.8 }}
                  />
                </div>
                <span className={styles.typeCount}>{info.count}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Timeline */}
        {analysis.oldest_file && analysis.newest_file && (
          <motion.section
            className={styles.section}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h4 className={styles.sectionTitle}>📅 Timeline</h4>
            <div className={styles.timeline}>
              <div className={styles.timelineItem}>
                <span className={styles.label}>Oldest File</span>
                <span className={styles.value}>{analysis.oldest_file.modified}</span>
                <span className={styles.filename}>{analysis.oldest_file.name}</span>
              </div>
              <div className={styles.timelineItem}>
                <span className={styles.label}>Newest File</span>
                <span className={styles.value}>{analysis.newest_file.modified}</span>
                <span className={styles.filename}>{analysis.newest_file.name}</span>
              </div>
              <div className={styles.timelineItem}>
                <span className={styles.label}>Avg Age</span>
                <span className={styles.value}>
                  {analysis.avg_file_age_days.toFixed(0)} days
                </span>
              </div>
            </div>
          </motion.section>
        )}

        {/* Findings */}
        <motion.section
          className={styles.section}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <h4 className={styles.sectionTitle}>🔍 Key Findings</h4>
          <div className={styles.findings}>
            {analysis.duplicate_patterns.length > 0 && (
              <div className={styles.finding}>
                <span className={styles.icon}>⚠️</span>
                <span>
                  {analysis.duplicate_patterns.length} potential duplicate pattern
                  {analysis.duplicate_patterns.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
            {analysis.hidden_file_count > 0 && (
              <div className={styles.finding}>
                <span className={styles.icon}>🙈</span>
                <span>{analysis.hidden_file_count} hidden files detected</span>
              </div>
            )}
            {analysis.max_depth > 5 && (
              <div className={styles.finding}>
                <span className={styles.icon}>📚</span>
                <span>Deep folder structure detected (depth: {analysis.max_depth})</span>
              </div>
            )}
            {analysis.total_files > 1000 && (
              <div className={styles.finding}>
                <span className={styles.icon}>🔥</span>
                <span>Large file collection: {analysis.total_files}+ files</span>
              </div>
            )}
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}
