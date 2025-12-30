use chrono::{DateTime, Local, Duration};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::Path;
use walkdir::WalkDir;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FileInfo {
    pub path: String,
    pub name: String,
    pub extension: String,
    pub size: u64,
    pub modified: String,
    pub depth: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FileTypeInfo {
    pub count: usize,
    pub total_size: u64,
    pub average_size: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DuplicateInfo {
    pub pattern: String,
    pub count: usize,
    pub files: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NamingStats {
    pub camel_case_count: usize,
    pub snake_case_count: usize,
    pub kebab_case_count: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AnalysisResult {
    pub total_files: usize,
    pub total_size: u64,
    pub total_folders: usize,
    pub file_types: HashMap<String, FileTypeInfo>,
    pub largest_files: Vec<FileInfo>,
    pub oldest_file: Option<FileInfo>,
    pub newest_file: Option<FileInfo>,
    pub avg_file_age_days: f64,
    pub max_depth: usize,
    pub hidden_file_count: usize,
    pub duplicate_patterns: Vec<DuplicateInfo>,
    pub naming_stats: NamingStats,
}

pub fn analyze_folder(path: &str) -> Result<AnalysisResult, String> {
    let root_path = Path::new(path);

    if !root_path.is_dir() {
        return Err("Invalid directory path".to_string());
    }

    let mut files = Vec::new();
    let mut folders = 0;
    let mut hidden_file_count = 0;
    let now = Local::now();

    // Walk directory tree
    for entry in WalkDir::new(root_path)
        .into_iter()
        .filter_map(|e| e.ok())
    {
        let path = entry.path();
        let depth = entry.depth();

        // Count hidden files (starting with .)
        if path
            .file_name()
            .and_then(|name| name.to_str())
            .map(|name| name.starts_with('.'))
            .unwrap_or(false)
        {
            hidden_file_count += 1;
        }

        if path.is_file() {
            if let Ok(metadata) = fs::metadata(path) {
                let file_name = path
                    .file_name()
                    .and_then(|n| n.to_str())
                    .unwrap_or("unknown")
                    .to_string();

                let extension = path
                    .extension()
                    .and_then(|e| e.to_str())
                    .unwrap_or("")
                    .to_string();

                let modified_time: DateTime<Local> = metadata.modified()
                    .ok()
                    .and_then(|t| t.duration_since(std::time::UNIX_EPOCH).ok())
                    .map(|d| Local::now() - Duration::from_std(d).unwrap())
                    .unwrap_or_else(|| Local::now());

                files.push(FileInfo {
                    path: path.to_string_lossy().to_string(),
                    name: file_name,
                    extension,
                    size: metadata.len(),
                    modified: modified_time.format("%Y-%m-%d %H:%M").to_string(),
                    depth,
                });
            }
        } else if path.is_dir() && path != root_path {
            folders += 1;
        }
    }

    // Analysis: file types
    let mut file_types: HashMap<String, FileTypeInfo> = HashMap::new();
    for file in &files {
        let ext = if file.extension.is_empty() {
            "no-extension".to_string()
        } else {
            file.extension.clone()
        };

        file_types
            .entry(ext)
            .and_modify(|info| {
                info.count += 1;
                info.total_size += file.size;
            })
            .or_insert_with(|| FileTypeInfo {
                count: 1,
                total_size: file.size,
                average_size: file.size,
            });
    }

    // Calculate averages
    for info in file_types.values_mut() {
        info.average_size = if info.count > 0 {
            info.total_size / info.count as u64
        } else {
            0
        };
    }

    // Get largest files (top 10)
    let mut sorted_files = files.clone();
    sorted_files.sort_by(|a, b| b.size.cmp(&a.size));
    let largest_files: Vec<FileInfo> = sorted_files.iter().take(10).cloned().collect();

    // File age analysis
    let mut oldest_file: Option<FileInfo> = None;
    let mut newest_file: Option<FileInfo> = None;
    let mut total_age_days = 0.0;

    for file in &files {
        if let Ok(modified_date) = chrono::DateTime::parse_from_rfc3339(&format!(
            "{}+00:00",
            file.modified.replace(" ", "T")
        )) {
            let age = (now.timestamp() - modified_date.timestamp()) as f64 / 86400.0;
            total_age_days += age;

            // Track oldest
            if oldest_file.is_none()
                || age > chrono::DateTime::parse_from_rfc3339(&format!(
                    "{}+00:00",
                    oldest_file
                        .as_ref()
                        .unwrap()
                        .modified
                        .replace(" ", "T")
                ))
                .map(|d| (now.timestamp() - d.timestamp()) as f64 / 86400.0)
                .unwrap_or(0.0)
            {
                oldest_file = Some(file.clone());
            }

            // Track newest
            if newest_file.is_none()
                || age < chrono::DateTime::parse_from_rfc3339(&format!(
                    "{}+00:00",
                    newest_file
                        .as_ref()
                        .unwrap()
                        .modified
                        .replace(" ", "T")
                ))
                .map(|d| (now.timestamp() - d.timestamp()) as f64 / 86400.0)
                .unwrap_or(f64::MAX)
            {
                newest_file = Some(file.clone());
            }
        }
    }

    let avg_file_age_days = if !files.is_empty() {
        total_age_days / files.len() as f64
    } else {
        0.0
    };

    // Duplicate detection (by filename pattern)
    let mut name_counts: HashMap<String, Vec<String>> = HashMap::new();
    for file in &files {
        let base_name = Path::new(&file.name)
            .file_stem()
            .and_then(|s| s.to_str())
            .unwrap_or("")
            .to_string();

        name_counts
            .entry(base_name)
            .or_insert_with(Vec::new)
            .push(file.name.clone());
    }

    let duplicate_patterns: Vec<DuplicateInfo> = name_counts
        .into_iter()
        .filter(|(_, v)| v.len() > 1)
        .map(|(pattern, files)| DuplicateInfo {
            pattern,
            count: files.len(),
            files,
        })
        .collect();

    // Naming statistics
    let mut naming_stats = NamingStats {
        camel_case_count: 0,
        snake_case_count: 0,
        kebab_case_count: 0,
    };

    for file in &files {
        let name = &file.name;
        if name.contains('_') {
            naming_stats.snake_case_count += 1;
        } else if name.contains('-') {
            naming_stats.kebab_case_count += 1;
        } else if name.chars().any(|c| c.is_uppercase()) {
            naming_stats.camel_case_count += 1;
        }
    }

    let total_size: u64 = files.iter().map(|f| f.size).sum();
    let max_depth = files.iter().map(|f| f.depth).max().unwrap_or(0);

    Ok(AnalysisResult {
        total_files: files.len(),
        total_size,
        total_folders: folders,
        file_types,
        largest_files,
        oldest_file,
        newest_file,
        avg_file_age_days,
        max_depth,
        hidden_file_count,
        duplicate_patterns,
        naming_stats,
    })
}
