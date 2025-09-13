use serde::{Deserialize, Serialize};
use std::fmt;

#[derive(Debug, Serialize, Deserialize)]
pub struct AppError {
    pub message: String,
    pub error_type: ErrorType,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum ErrorType {
    FileSystem,
    InvalidPath,
    PermissionDenied,
    Configuration,
    Unknown,
}

impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}: {}", self.error_type_str(), self.message)
    }
}

impl AppError {
    pub fn new(message: &str, error_type: ErrorType) -> Self {
        Self {
            message: message.to_string(),
            error_type,
        }
    }

    pub fn file_system(message: &str) -> Self {
        Self::new(message, ErrorType::FileSystem)
    }

    pub fn invalid_path(message: &str) -> Self {
        Self::new(message, ErrorType::InvalidPath)
    }

    pub fn permission_denied(message: &str) -> Self {
        Self::new(message, ErrorType::PermissionDenied)
    }

    pub fn configuration(message: &str) -> Self {
        Self::new(message, ErrorType::Configuration)
    }

    fn error_type_str(&self) -> &str {
        match self.error_type {
            ErrorType::FileSystem => "文件系统错误",
            ErrorType::InvalidPath => "无效路径",
            ErrorType::PermissionDenied => "权限不足",
            ErrorType::Configuration => "配置错误",
            ErrorType::Unknown => "未知错误",
        }
    }
}

impl From<std::io::Error> for AppError {
    fn from(err: std::io::Error) -> Self {
        match err.kind() {
            std::io::ErrorKind::NotFound => AppError::invalid_path("路径不存在"),
            std::io::ErrorKind::PermissionDenied => AppError::permission_denied("没有访问权限"),
            _ => AppError::file_system(&format!("文件系统操作失败: {}", err)),
        }
    }
}

pub type AppResult<T> = Result<T, AppError>;