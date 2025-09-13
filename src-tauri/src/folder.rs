use crate::error::{AppError, AppResult};
use crate::settings::AppSettings;
use chrono::{Local, NaiveDate};
use std::fs;
use std::path::PathBuf;

pub struct FolderManager;

impl FolderManager {
    /// 创建今天的文件夹
    pub fn create_today_folder(settings: &AppSettings) -> AppResult<String> {
        let today = Local::now().date_naive();
        Self::create_folder_for_date(settings, &today)
    }

    /// 为指定日期创建文件夹
    pub fn create_folder_for_date(settings: &AppSettings, date: &NaiveDate) -> AppResult<String> {
        // 验证基础路径
        settings.validate_path()?;

        let folder_name = settings.date_format.format_date(date);
        let folder_path = PathBuf::from(&settings.folder_path).join(&folder_name);

        // 检查文件夹是否已存在
        if folder_path.exists() {
            return Ok(folder_path.to_string_lossy().to_string());
        }

        // 创建文件夹
        fs::create_dir_all(&folder_path)
            .map_err(|e| AppError::file_system(&format!("创建文件夹失败: {}", e)))?;

        println!("Created folder: {}", folder_path.display());
        Ok(folder_path.to_string_lossy().to_string())
    }

    /// 检查今天的文件夹是否存在
    pub fn today_folder_exists(settings: &AppSettings) -> bool {
        let today = Local::now().date_naive();
        Self::folder_exists_for_date(settings, &today)
    }

    /// 检查指定日期的文件夹是否存在
    pub fn folder_exists_for_date(settings: &AppSettings, date: &NaiveDate) -> bool {
        let folder_name = settings.date_format.format_date(date);
        let folder_path = PathBuf::from(&settings.folder_path).join(&folder_name);
        folder_path.exists() && folder_path.is_dir()
    }

    /// 获取今天应该创建的文件夹路径
    pub fn get_today_folder_path(settings: &AppSettings) -> String {
        let today = Local::now().date_naive();
        let folder_name = settings.date_format.format_date(&today);
        let folder_path = PathBuf::from(&settings.folder_path).join(&folder_name);
        folder_path.to_string_lossy().to_string()
    }

    /// 打开文件夹在文件管理器中
    pub fn open_folder_in_explorer(path: &str) -> AppResult<()> {
        let path_buf = PathBuf::from(path);
        
        if !path_buf.exists() {
            return Err(AppError::invalid_path("文件夹不存在"));
        }

        #[cfg(target_os = "windows")]
        {
            std::process::Command::new("explorer")
                .arg(&path)
                .spawn()
                .map_err(|_| AppError::file_system("无法打开文件管理器"))?;
        }

        #[cfg(target_os = "macos")]
        {
            std::process::Command::new("open")
                .arg(&path)
                .spawn()
                .map_err(|_| AppError::file_system("无法打开Finder"))?;
        }

        #[cfg(target_os = "linux")]
        {
            std::process::Command::new("xdg-open")
                .arg(&path)
                .spawn()
                .map_err(|_| AppError::file_system("无法打开文件管理器"))?;
        }

        Ok(())
    }

    /// 验证路径是否有效
    pub fn validate_folder_path(path: &str) -> AppResult<()> {
        let path_buf = PathBuf::from(path);
        
        if !path_buf.exists() {
            return Err(AppError::invalid_path("路径不存在"));
        }
        
        if !path_buf.is_dir() {
            return Err(AppError::invalid_path("路径不是目录"));
        }

        // 测试写入权限
        let test_file = path_buf.join(".smart_folder_zen_test");
        match fs::write(&test_file, "") {
            Ok(_) => {
                let _ = fs::remove_file(&test_file);
                Ok(())
            }
            Err(_) => Err(AppError::permission_denied("没有写入权限")),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::settings::DateFormat;
    use tempfile::tempdir;

    #[test]
    fn test_create_folder() {
        let temp_dir = tempdir().unwrap();
        let settings = AppSettings {
            folder_path: temp_dir.path().to_string_lossy().to_string(),
            date_format: DateFormat::YYYYMMDD,
            auto_start: false,
            auto_create_on_startup: true,
        };

        let result = FolderManager::create_today_folder(&settings);
        assert!(result.is_ok());
        
        let folder_path = result.unwrap();
        assert!(PathBuf::from(&folder_path).exists());
    }

    #[test]
    fn test_date_format() {
        use chrono::NaiveDate;
        
        let date = NaiveDate::from_ymd_opt(2024, 3, 15).unwrap();
        
        assert_eq!(DateFormat::MMDD.format_date(&date), "0315");
        assert_eq!(DateFormat::YYYYMMDD.format_date(&date), "2024-03-15");
    }
}