use crate::analyzer::{analyze_folder, AnalysisResult};

#[tauri::command]
pub async fn analyze_folder_command(path: String) -> Result<AnalysisResult, String> {
    analyze_folder(&path)
}
