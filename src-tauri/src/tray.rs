use crate::folder::FolderManager;
use crate::settings::AppSettings;
use std::sync::Mutex;
use tauri::{
    menu::{Menu, MenuItem, PredefinedMenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Manager, Runtime,
};

pub fn create_tray<R: Runtime>(app: &tauri::AppHandle<R>) -> tauri::Result<()> {

    let quit_i = MenuItem::with_id(app, "quit", "退出", true, None::<&str>)?;
    let show_i = MenuItem::with_id(app, "show", "显示设置", true, None::<&str>)?;
    let create_i = MenuItem::with_id(app, "create_now", "立即创建", true, None::<&str>)?;
    let open_i = MenuItem::with_id(app, "open_folder", "打开目录", true, None::<&str>)?;
    let separator = PredefinedMenuItem::separator(app)?;

    let menu = Menu::with_items(
        app,
        &[&create_i, &open_i, &separator, &show_i, &separator, &quit_i],
    )?;

    let _tray = TrayIconBuilder::with_id("main-tray")
        .tooltip("Smart Folder Zen")
        .icon(app.default_window_icon().unwrap().clone())
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_menu_event(move |app, event| match event.id.as_ref() {
            "quit" => {
                // Cleanup before exit
                cleanup_before_exit(app);
                app.exit(0);
            }
            "show" => {
                if let Err(e) = show_settings_window(app) {
                    eprintln!("Failed to show settings: {:?}", e);
                }
            }
            "create_now" => {
                if let Err(e) = create_folder_now(app) {
                    eprintln!("Failed to create folder: {:?}", e);
                    // TODO: Show notification to user
                }
            }
            "open_folder" => {
                if let Err(e) = open_current_folder(app) {
                    eprintln!("Failed to open folder: {:?}", e);
                    // TODO: Show notification to user
                }
            }
            _ => {}
        })
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } = event
            {
                let app = tray.app_handle();
                if let Err(e) = show_settings_window(&app) {
                    eprintln!("Failed to show settings on tray click: {:?}", e);
                }
            }
        })
        .build(app)?;

    Ok(())
}

fn show_settings_window<R: Runtime>(app: &tauri::AppHandle<R>) -> tauri::Result<()> {
    if let Some(window) = app.get_webview_window("main") {
        window.show()?;
        window.set_focus()?;
        window.unminimize()?;
    }
    Ok(())
}

fn create_folder_now<R: Runtime>(app: &tauri::AppHandle<R>) -> Result<(), Box<dyn std::error::Error>> {
    let settings_state = app.state::<Mutex<AppSettings>>();
    let settings = settings_state.lock().map_err(|e| {
        format!("Failed to lock settings: {}", e)
    })?;

    let result = FolderManager::create_today_folder(&settings);
    
    match result {
        Ok(path) => {
            println!("Successfully created folder: {}", path);
            // TODO: Show success notification
        }
        Err(e) => {
            eprintln!("Failed to create folder: {}", e);
            // TODO: Show error notification
        }
    }

    Ok(())
}

fn open_current_folder<R: Runtime>(app: &tauri::AppHandle<R>) -> Result<(), Box<dyn std::error::Error>> {
    let settings_state = app.state::<Mutex<AppSettings>>();
    let settings = settings_state.lock().map_err(|e| {
        format!("Failed to lock settings: {}", e)
    })?;

    let folder_path = if FolderManager::today_folder_exists(&settings) {
        FolderManager::get_today_folder_path(&settings)
    } else {
        settings.folder_path.clone()
    };

    drop(settings); // Release the lock

    match FolderManager::open_folder_in_explorer(&folder_path) {
        Ok(_) => println!("Successfully opened folder: {}", folder_path),
        Err(e) => {
            eprintln!("Failed to open folder: {}", e);
            // TODO: Show error notification
        }
    }

    Ok(())
}

fn cleanup_before_exit<R: Runtime>(app: &tauri::AppHandle<R>) {
    // Disable autostart when explicitly quitting the application
    use tauri_plugin_autostart::ManagerExt;
    
    if let Err(e) = app.autolaunch().disable() {
        eprintln!("Warning: Failed to disable autostart on exit: {}", e);
    } else {
        println!("Autostart disabled on exit");
    }
}