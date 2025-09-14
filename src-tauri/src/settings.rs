use crate::error::{AppError, AppResult};
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::Manager;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppSettings {
    pub folder_path: String,
    pub date_format: DateFormat,
    pub auto_start: bool,
    pub auto_create_on_startup: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum DateFormat {
    MMDD,
    YYYYMMDD,
}

impl DateFormat {
    pub fn format_date(&self, date: &chrono::NaiveDate) -> String {
        match self {
            DateFormat::MMDD => date.format("%m%d").to_string(),
            DateFormat::YYYYMMDD => date.format("%Y-%m-%d").to_string(),
        }
    }
}

impl Default for AppSettings {
    fn default() -> Self {
        Self {
            folder_path: dirs::desktop_dir()
                .unwrap_or_else(|| PathBuf::from("."))
                .to_string_lossy()
                .to_string(),
            date_format: DateFormat::YYYYMMDD,
            auto_start: true,
            auto_create_on_startup: true,
        }
    }
}

impl AppSettings {
    pub fn load(app: &tauri::AppHandle) -> AppResult<Self> {
        let config_path = Self::get_config_path(app)?;
        
        if !config_path.exists() {
            let default_settings = Self::default();
            default_settings.save(app)?;
            return Ok(default_settings);
        }

        let content = fs::read_to_string(&config_path)
            .map_err(|_| AppError::configuration("无法读取配置文件"))?;
        
        serde_json::from_str(&content)
            .map_err(|_| AppError::configuration("配置文件格式错误"))
    }

    pub fn save(&self, app: &tauri::AppHandle) -> AppResult<()> {
        let config_path = Self::get_config_path(app)?;
        
        if let Some(parent) = config_path.parent() {
            fs::create_dir_all(parent)
                .map_err(|_| AppError::configuration("无法创建配置目录"))?;
        }

        let content = serde_json::to_string_pretty(self)
            .map_err(|_| AppError::configuration("无法序列化配置"))?;
        
        fs::write(&config_path, content)
            .map_err(|_| AppError::configuration("无法保存配置文件"))
    }

    pub fn validate_path(&self) -> AppResult<()> {
        let path = PathBuf::from(&self.folder_path);
        
        if !path.exists() {
            return Err(AppError::invalid_path("指定的路径不存在"));
        }
        
        if !path.is_dir() {
            return Err(AppError::invalid_path("指定的路径不是目录"));
        }
        
        // 检查写入权限
        let test_file = path.join(".test_write_permission");
        match fs::write(&test_file, "") {
            Ok(_) => {
                let _ = fs::remove_file(&test_file);
                Ok(())
            }
            Err(_) => Err(AppError::permission_denied("没有写入权限")),
        }
    }

    fn get_config_path(app: &tauri::AppHandle) -> AppResult<PathBuf> {
        app.path().app_config_dir()
            .map(|path| path.join("settings.json"))
            .map_err(|_| AppError::configuration("无法获取配置目录"))
    }
}