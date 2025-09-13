use crate::error::AppError;
use crate::folder::FolderManager;
use crate::settings::AppSettings;
use tauri::{Manager, State};
use std::sync::Mutex;

pub type SettingsState<'a> = State<'a, Mutex<AppSettings>>;

#[tauri::command]
pub async fn create_today_folder(
    settings_state: SettingsState<'_>,
) -> Result<String, AppError> {
    let settings = settings_state.lock().map_err(|_| {
        AppError::configuration("无法获取设置状态")
    })?;
    
    FolderManager::create_today_folder(&settings)
}

#[tauri::command]
pub async fn open_folder_in_explorer(
    path: Option<String>,
    settings_state: SettingsState<'_>,
) -> Result<(), AppError> {
    let folder_path = if let Some(path) = path {
        path
    } else {
        let settings = settings_state.lock().map_err(|_| {
            AppError::configuration("无法获取设置状态")
        })?;
        
        if FolderManager::today_folder_exists(&settings) {
            FolderManager::get_today_folder_path(&settings)
        } else {
            settings.folder_path.clone()
        }
    };

    FolderManager::open_folder_in_explorer(&folder_path)
}

#[tauri::command]
pub async fn get_settings(
    app: tauri::AppHandle,
) -> Result<AppSettings, AppError> {
    AppSettings::load(&app)
}

#[tauri::command]
pub async fn save_settings(
    app: tauri::AppHandle,
    settings: AppSettings,
    settings_state: SettingsState<'_>,
) -> Result<(), AppError> {
    // 验证新设置
    settings.validate_path()?;
    
    // 保存到文件
    settings.save(&app)?;
    
    // 更新内存中的状态
    let mut state = settings_state.lock().map_err(|_| {
        AppError::configuration("无法更新设置状态")
    })?;
    *state = settings;
    
    Ok(())
}

#[tauri::command]
pub async fn validate_folder_path(path: String) -> Result<(), AppError> {
    FolderManager::validate_folder_path(&path)
}

#[tauri::command]
pub async fn get_today_folder_status(
    settings_state: SettingsState<'_>,
) -> Result<FolderStatus, AppError> {
    let settings = settings_state.lock().map_err(|_| {
        AppError::configuration("无法获取设置状态")
    })?;
    
    let exists = FolderManager::today_folder_exists(&settings);
    let path = FolderManager::get_today_folder_path(&settings);
    
    Ok(FolderStatus { exists, path })
}

#[derive(serde::Serialize)]
pub struct FolderStatus {
    pub exists: bool,
    pub path: String,
}

#[tauri::command]
pub async fn show_main_window(app: tauri::AppHandle) -> Result<(), AppError> {
    if let Some(window) = app.get_webview_window("main") {
        window.show().map_err(|_| {
            AppError::configuration("无法显示主窗口")
        })?;
        window.set_focus().map_err(|_| {
            AppError::configuration("无法聚焦主窗口")
        })?;
    }
    Ok(())
}

#[tauri::command]
pub async fn hide_main_window(app: tauri::AppHandle) -> Result<(), AppError> {
    if let Some(window) = app.get_webview_window("main") {
        window.hide().map_err(|_| {
            AppError::configuration("无法隐藏主窗口")
        })?;
    }
    Ok(())
}

#[tauri::command]
pub async fn quit_app(app: tauri::AppHandle) {
    // Cleanup before exit - disable autostart
    use tauri_plugin_autostart::ManagerExt;
    
    if let Err(e) = app.autolaunch().disable() {
        eprintln!("Warning: Failed to disable autostart on exit: {}", e);
    } else {
        println!("Autostart disabled on exit");
    }
    
    app.exit(0);
}

#[tauri::command]
pub async fn enable_autostart(app: tauri::AppHandle) -> Result<(), AppError> {
    use tauri_plugin_autostart::ManagerExt;
    
    let autostart = app.autolaunch();
    autostart.enable().map_err(|e| {
        AppError::configuration(&format!("启用自动启动失败: {}", e))
    })
}

#[tauri::command]
pub async fn disable_autostart(app: tauri::AppHandle) -> Result<(), AppError> {
    use tauri_plugin_autostart::ManagerExt;
    
    let autostart = app.autolaunch();
    autostart.disable().map_err(|e| {
        AppError::configuration(&format!("禁用自动启动失败: {}", e))
    })
}

#[tauri::command]
pub async fn is_autostart_enabled(app: tauri::AppHandle) -> Result<bool, AppError> {
    use tauri_plugin_autostart::ManagerExt;
    
    let autostart = app.autolaunch();
    autostart.is_enabled().map_err(|e| {
        AppError::configuration(&format!("检查自动启动状态失败: {}", e))
    })
}

#[tauri::command]
pub async fn select_folder_dialog(app: tauri::AppHandle) -> Result<Option<String>, AppError> {
    use tauri_plugin_dialog::DialogExt;
    use std::sync::mpsc;
    
    let (tx, rx) = mpsc::channel();
    
    app.dialog()
        .file()
        .set_title("选择文件夹")
        .pick_folder(move |path| {
            let _ = tx.send(path);
        });
    
    let selected = rx.recv().map_err(|_| {
        AppError::configuration("文件夹选择对话框错误")
    })?;
        
    match selected {
        Some(path) => Ok(Some(path.to_string())),
        None => Ok(None),
    }
}