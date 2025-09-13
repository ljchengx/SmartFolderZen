use std::sync::Mutex;
use tauri::Manager;

mod commands;
mod error;
mod folder;
mod settings;
mod tray;

use commands::*;
use folder::FolderManager;
use settings::AppSettings;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            Some(vec!["--minimized"]),
        ))
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_single_instance::init(|app, _argv, _cwd| {
            // 当尝试启动第二个实例时，显示主窗口
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.show();
                let _ = window.set_focus();
                let _ = window.unminimize();
            }
        }))
        .setup(|app| {
            // 初始化设置
            let settings = AppSettings::load(app.handle())
                .unwrap_or_else(|_| AppSettings::default());
            
            // 将设置存储到应用状态中
            app.manage(Mutex::new(settings.clone()));
            
            // 创建系统托盘
            tray::create_tray(app.handle())?;
            
            // 如果启用了启动时自动创建，则创建今天的文件夹
            if settings.auto_create_on_startup {
                if let Err(e) = FolderManager::create_today_folder(&settings) {
                    eprintln!("Failed to create today's folder on startup: {}", e);
                }
            }
            
            // 隐藏主窗口（启动到托盘）
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.hide();
            }
            
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            create_today_folder,
            open_folder_in_explorer,
            get_settings,
            save_settings,
            validate_folder_path,
            get_today_folder_status,
            show_main_window,
            hide_main_window,
            quit_app,
            enable_autostart,
            disable_autostart,
            is_autostart_enabled,
            select_folder_dialog
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
