# Smart Folder Zen - 项目说明文档

## 项目概述
Smart Folder Zen 是一个桌面应用程序，用于自动创建基于日期的文件夹。使用 Tauri + React + TypeScript 技术栈开发。

## 核心功能要求

### 1. 基本功能
- **自动创建日期文件夹**：根据设置的路径和日期格式自动创建文件夹
- **开机自动启动**：默认启用，系统启动时自动运行应用程序
- **启动时自动创建文件夹**：默认启用，应用启动时自动创建当日文件夹

### 2. 设置界面要求
**仅包含以下两个设置选项**：
- **📁 文件夹路径选择**：用户选择要创建日期文件夹的根目录
- **📅 日期格式选择**：
  - MMDD（例如：0912）
  - YYYYMMDD（例如：20240912，默认）

**禁止包含的设置**：
- ❌ 开机自动启动选项（已默认启用，不可更改）
- ❌ 启动时自动创建文件夹选项（已默认启用，不可更改）
- ❌ 其他任何自动化设置选项

### 3. 图标要求
- 使用项目自定义 logo.png 作为应用图标
- 支持多种格式：PNG (32x32, 128x128, 128x128@2x, 512x512), ICO, ICNS
- 应用于：安装包图标、系统托盘图标、窗口图标
- 图标文件位置：`src-tauri/icons/` 目录

### 4. 安装包要求
- **仅生成 MSI 安装包**
- **禁止生成 NSIS 安装包**（已在 tauri.conf.json 中配置为只生成 msi）

## 技术架构

### 技术栈
- **前端**：React 18 + TypeScript + Vite
- **UI框架**：Fluent UI 2 (Microsoft 设计系统)
- **后端**：Tauri v2 + Rust
- **样式引擎**：Griffel (CSS-in-JS)

### 项目结构
```
smart_folder_zen/
├── src/                          # React 前端代码
│   ├── components/
│   │   └── Settings.tsx          # 设置界面组件（现代化设计）
│   ├── types/
│   │   └── settings.ts           # 类型定义
│   └── ...
├── src-tauri/                    # Tauri 后端代码
│   ├── icons/                    # 应用图标文件 (基于 logo.png)
│   ├── src/
│   │   ├── commands.rs           # Tauri 命令
│   │   ├── folder.rs             # 文件夹创建逻辑
│   │   ├── settings.rs           # 设置管理
│   │   └── tray.rs               # 系统托盘功能
│   └── tauri.conf.json           # Tauri 配置（仅 MSI 构建）
├── docs/
│   └── ui_design.md              # UI 设计文档和规范
└── CLAUDE.md                     # 本文档
```

### 配置文件关键设置

**tauri.conf.json**：
- `bundle.targets: ["msi"]` - 仅生成 MSI 安装包
- 图标路径指向自定义 logo 图标文件 (PNG, ICO, ICNS 格式)
- 窗口配置：720x600，不可调整大小

## 开发规范

### 代码要求
- 保持设置界面的简洁性，只包含必需的两个选项
- 使用 TypeScript 确保类型安全
- 支持使用现代UI框架提升用户体验

### 构建命令
- 开发：`npm run tauri:dev`
- 构建：`npm run tauri:build`
- 仅构建 MSI 安装包，不生成 NSIS

### Git 仓库
- 远程仓库：https://github.com/ljchengx/smart_zen.git
- 分支：master

## 设计原则

1. **简洁性**：界面只显示用户真正需要配置的选项
2. **自动化**：核心功能（开机启动、自动创建）默认启用，无需用户配置
3. **可靠性**：使用 MSI 安装包确保兼容性，避免 NSIS 权限问题
4. **美观性**：使用统一的自定义 logo 图标，保持品牌一致性
5. **现代化**：使用 Fluent UI 2 设计系统提供一致性的用户体验

## 注意事项

1. **严格遵循设置界面要求**：任何修改都不应添加额外的设置选项
2. **图标一致性**：所有图标都基于统一的 logo.png 设计，自动生成多种格式
3. **安装包限制**：永远只生成 MSI 包，不生成 NSIS 包
4. **默认行为**：开机启动和自动创建文件夹是默认开启的核心功能，不需要用户干预
5. **自动启动实现**：应用程序默认开启自动启动功能，在 `settings.rs` 中 `auto_start: true`，启动时自动配置系统自动启动

## 构建和测试

### 本地开发
```bash
npm install
npm run tauri:dev
```

### 生产构建
```bash
npm run tauri:build
```

构建产物位于 `src-tauri/target/release/bundle/msi/` 目录。

## UI 设计规范

### 设计理念
基于 `docs/ui_design.md` 文档，界面设计遵循以下核心原则：

1. **呼吸感设计**：使用充足的留白空间（48px 垂直间距），让界面元素有足够的呼吸空间
2. **现代化布局**：左对齐的标题和内容，符合现代软件界面的阅读习惯
3. **视觉降噪**：采用简洁的线条和区块，去掉不必要的卡片容器和分割线
4. **优化交互**：集成式浏览按钮、卡片式日期格式选择，提升操作便利性

### 界面特性
- **集成式输入控件**：浏览按钮内置于路径输入框内，节省空间且更现代
- **卡片式选择器**：日期格式使用可点击的卡片替代传统单选框
- **实时预览**：显示当前日期在所选格式下的预览效果
- **图标语义化**：使用 📂 和 🗓️ 表情符号增强视觉识别
- **右对齐操作**：操作按钮右对齐，符合用户从左到右的操作流程

### 技术实现
- **Fluent UI 2**：使用 `@fluentui/react-components` 和 `@fluentui/react-icons`
- **Griffel 样式引擎**：通过 `makeStyles` hook 实现类型安全的样式管理
- **Design Tokens**：使用 Fluent 设计令牌确保一致性的颜色、间距和字体
- **响应式设计**：使用 CSS Grid 和 Flexbox 实现灵活布局

### 窗口规格
- **尺寸**：720x600 像素，固定大小不可调整
- **最大宽度**：内容区域限制为 720px，确保良好的阅读体验
- **内边距**：48px 垂直，32px 水平，提供充足的呼吸感

## 自动启动功能

### 实现原理
应用程序默认启用自动启动功能，通过以下方式实现：

1. **默认配置**：在 `src-tauri/src/settings.rs:38` 中设置 `auto_start: true`
2. **启动时激活**：在 `src-tauri/src/lib.rs:43-50` 中，应用启动时自动调用系统自动启动API
3. **插件支持**：使用 `tauri_plugin_autostart` 插件处理不同操作系统的自动启动机制

### 技术实现
```rust
// settings.rs - 默认开启自动启动
impl Default for AppSettings {
    fn default() -> Self {
        Self {
            auto_start: true,  // 默认开启
            auto_create_on_startup: true,
            // ...
        }
    }
}

// lib.rs - 启动时自动配置系统自动启动
if settings.auto_start {
    use tauri_plugin_autostart::ManagerExt;
    let autostart = app.autolaunch();
    if let Err(e) = autostart.enable() {
        eprintln!("Failed to enable autostart on startup: {}", e);
    }
}
```

### 平台支持
- **Windows**：注册表启动项
- **macOS**：LaunchAgent 机制
- **Linux**：支持多种桌面环境的自动启动机制

## 图标管理

### 图标文件结构
```
src-tauri/icons/
├── logo.png          # 源图标文件 (1024x1024 推荐)
├── 32x32.png         # 32像素图标
├── 128x128.png       # 128像素图标
├── 128x128@2x.png    # 256像素高清图标
├── icon.png          # 512像素主图标
├── icon.ico          # Windows ICO格式 (多尺寸)
├── icon.icns         # macOS ICNS格式
└── icon_1024.png     # 1024像素用于ICNS转换
```

### 图标生成
当需要更新图标时：
1. 将新的 logo.png 文件准备好（建议1024x1024像素）
2. 使用 Python 脚本自动生成所有格式：
   ```python
   # 使用高质量 LANCZOS 重采样算法生成多种尺寸
   from PIL import Image
   import os
   
   # 生成PNG格式（32x32, 128x128, 256x256, 512x512, 1024x1024）
   # 生成ICO格式（Windows多尺寸图标）
   # 生成ICNS格式（macOS图标）
   
   # 使用 Image.LANCZOS 确保高质量缩放，avoid压缩模糊
   ```
3. 更新 `tauri.conf.json` 中的图标配置
4. 所有图标会自动应用到：
   - Windows 安装包 (.msi)
   - 应用程序主窗口
   - 系统托盘图标
   - 任务栏图标

### 图标规范
- **源文件**：建议使用 1024x1024 像素的 PNG 格式
- **设计要求**：图标应在各种尺寸下保持清晰可识别
- **背景**：支持透明背景，也支持实色背景
- **格式支持**：PNG, ICO, ICNS 三种主要格式

## 更新记录

### v1.0.1 (2024-09-14)
- ✅ **新增**：默认开启自动启动功能，无需用户手动配置
- ✅ **优化**：使用高质量图标生成，支持所有平台格式（PNG、ICO、ICNS）
- ✅ **改进**：应用启动时自动配置系统自动启动，确保功能正常工作
- ✅ **技术**：使用 LANCZOS 重采样算法生成清晰图标，避免模糊