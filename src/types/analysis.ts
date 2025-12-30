export interface FileInfo {
  path: string;
  name: string;
  extension: string;
  size: number;
  modified: string;
  depth: number;
}

export interface FileTypeInfo {
  count: number;
  total_size: number;
  average_size: number;
}

export interface DuplicateInfo {
  pattern: string;
  count: number;
  files: string[];
}

export interface NamingStats {
  camel_case_count: number;
  snake_case_count: number;
  kebab_case_count: number;
}

export interface AnalysisResult {
  total_files: number;
  total_size: number;
  total_folders: number;
  file_types: Record<string, FileTypeInfo>;
  largest_files: FileInfo[];
  oldest_file: FileInfo | null;
  newest_file: FileInfo | null;
  avg_file_age_days: number;
  max_depth: number;
  hidden_file_count: number;
  duplicate_patterns: DuplicateInfo[];
  naming_stats: NamingStats;
}
