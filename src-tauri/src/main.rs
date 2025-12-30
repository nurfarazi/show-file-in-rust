mod analyzer;
mod commands;

use commands::analyze_folder_command;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![analyze_folder_command])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
