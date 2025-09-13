# Smart Folder Zen

[English](README.en.md) | 中文

一个基于 Tauri、React 和 TypeScript 构建的智能文件夹管理应用程序。

## Smart Folder Zen 是什么？

Smart Folder Zen 是一个轻量级的桌面工具，可以根据当前日期自动创建日期文件夹。非常适合需要按日期整理文件的用户 - 无论是每日工作文件、下载内容还是项目资料。

## 核心功能

### 📅 **自动创建日期文件夹**
- **基于日期的文件夹**: 根据今天的日期自动创建文件夹
- **灵活的命名规则**: 可选择 `MMDD`（如 "0315"）或 `YYYY-MM-DD`（如 "2024-03-15"）格式
- **智能创建**: 仅在文件夹不存在时才创建新文件夹
- **启动自动化**: 可选择在电脑启动时自动创建今天的文件夹

### ⚙️ **简单配置**
- **现代化界面设计**: 简洁呼吸感界面，卡片式日期格式选择
- **易于设置**: 选择创建日期文件夹的基础路径
- **集成式控件**: 浏览按钮内置于输入框中，提供流畅体验
- **实时预览**: 查看所选日期格式在今天日期下的显示效果
- **路径验证**: 确保所选文件夹存在且可写入
- **持久化设置**: 自动保存和恢复你的偏好设置

### 🚀 **系统集成**
- **系统托盘**: 在后台静默运行，不占用桌面空间
- **开机自启**: 在 Windows 启动时自动运行
- **单实例运行**: 防止多个副本同时运行
- **快速访问**: 点击托盘图标即可打开设置或立即创建文件夹

### 📂 **快捷操作**
- **即时创建文件夹**: 一键创建今天的文件夹
- **在资源管理器中打开**: 直接在 Windows 资源管理器中打开创建的文件夹
- **智能打开**: 如果今天的文件夹存在就打开它，否则打开基础文件夹

## 适合谁使用？

- **日常整理者** - 按日期分类文件（照片、文档、下载）的用户
- **专业人士** - 需要基于日期的项目组织管理
- **学生** - 按日期整理课业和作业的学习者
- **任何人** - 偏好按时间顺序组织文件的用户

## 技术栈

- **前端**: React 18、TypeScript、Vite
- **UI 框架**: Fluent UI 2 (微软设计系统)
- **后端**: Tauri v2 (Rust)
- **构建工具**: Vite
- **包管理器**: npm

## 环境要求

开始之前，请确保已安装以下环境：

- [Node.js](https://nodejs.org/) (v16 或更高版本)
- [Rust](https://rustup.rs/)
- [Tauri 前置要求](https://tauri.app/v1/guides/getting-started/prerequisites)

## 安装步骤

1. 克隆仓库：
   ```bash
   git clone https://github.com/ljchengx/SmartFolderZen.git
   cd SmartFolderZen
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

## 开发

启动开发服务器：

```bash
npm run dev
```

这将同时启动 Vite 开发服务器和 Tauri 开发应用。

## 构建

构建生产版本：

```bash
npm run tauri:build
```

构建调试版本：

```bash
npm run tauri:build:debug
```

## 项目结构

```
smart_folder_zen/
├── src/                 # React 前端源代码
├── src-tauri/          # Tauri 后端 (Rust)
├── public/             # 静态资源
├── dist/               # 构建输出
└── docs/               # 文档
```

## 可用脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建前端生产版本
- `npm run preview` - 预览生产构建
- `npm run tauri` - 运行 Tauri CLI 命令
- `npm run tauri:build` - 构建完整应用程序
- `npm run tauri:build:debug` - 构建调试版本

## 参与贡献

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 推荐的 IDE 设置

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## 技术支持

如果您有任何问题或遇到问题，请在 GitHub 上开启一个 issue。