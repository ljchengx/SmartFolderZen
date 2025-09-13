import { webLightTheme } from "@fluentui/react-components";
import type { Theme } from "@fluentui/react-components";

export const smartFolderTheme: Theme = {
  ...webLightTheme,
  // 覆盖品牌色相关的 color tokens
  colorBrandBackground: "#0066CC", // Smart Folder Zen 品牌主色
  colorBrandBackgroundHover: "#005BB5",
  colorBrandBackgroundPressed: "#004A9F",
  colorCompoundBrandForeground1: "#0066CC",

  // 覆盖圆角相关的 radius tokens
  borderRadiusMedium: "6px",
  borderRadiusLarge: "8px",

  // 覆盖字体相关的 font tokens
  fontFamilyBase: '"Segoe UI", "Microsoft YaHei", "PingFang SC", "Helvetica Neue", Arial, sans-serif',
};