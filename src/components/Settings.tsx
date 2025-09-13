import * as React from 'react';
import {
  makeStyles,
  shorthands,
  Button,
  Input,
  Label,
  Card,
  CardHeader,
  Text,
  RadioGroup,
  Radio,
  Spinner,
  tokens,
  useToastController,
  Toast,
  ToastTitle,
  ToastBody,
  Toaster,
} from '@fluentui/react-components';
import type { InputProps, RadioGroupProps } from '@fluentui/react-components';
import { FolderRegular, CalendarRegular, SaveRegular, ArrowResetRegular, CheckmarkCircleRegular, ErrorCircleRegular } from '@fluentui/react-icons';
import { open } from '@tauri-apps/plugin-dialog';
import { invoke } from '@tauri-apps/api/core';
import { AppSettings } from '../types/settings';

const useStyles = makeStyles({
  container: {
    backgroundColor: tokens.colorNeutralBackground1,
    height: '100vh',
    ...shorthands.padding('48px', '32px'),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    maxWidth: '720px',
    margin: '0 auto',
  },

  // 头部区域 - 左对齐设计
  header: {
    marginBottom: '48px',
    width: '100%',
  },
  title: {
    fontSize: '28px',
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorNeutralForeground1,
    marginBottom: '8px',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '16px',
    color: tokens.colorNeutralForeground3,
    fontWeight: tokens.fontWeightRegular,
  },

  // 设置内容区域 - 增加垂直间距
  settingsContent: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    ...shorthands.gap('48px'),
  },

  // 字段组 - 更好的视觉分组
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  
  fieldHeader: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    marginBottom: '16px',
  },
  
  fieldIcon: {
    fontSize: '20px',
    color: tokens.colorBrandForeground1,
  },
  
  fieldTitle: {
    fontSize: '18px',
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    margin: 0,
  },

  // 带集成按钮的输入框
  inputContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: '8px',
  },
  
  input: {
    width: '100%',
    height: '44px',
    paddingRight: '100px',
    fontSize: '16px',
  },
  
  browseButton: {
    position: 'absolute',
    right: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
    height: '28px',
    minWidth: '72px',
    fontSize: '14px',
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    ...shorthands.border('none'),
    borderRadius: '6px',
    '&:hover': {
      backgroundColor: tokens.colorBrandBackgroundHover,
    },
  },

  // 卡片式日期格式选择
  formatCardsContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    ...shorthands.gap('16px'),
    marginBottom: '8px',
  },
  
  formatCard: {
    ...shorthands.padding('20px'),
    borderRadius: '12px',
    ...shorthands.border('2px', 'solid', tokens.colorNeutralStroke2),
    backgroundColor: tokens.colorNeutralBackground1,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'center',
    '&:hover': {
      ...shorthands.borderColor(tokens.colorBrandStroke1),
      backgroundColor: tokens.colorNeutralBackground2,
    },
  },
  
  formatCardSelected: {
    ...shorthands.borderColor(tokens.colorBrandStroke1),
    backgroundColor: tokens.colorBrandBackground2,
    boxShadow: `0 0 0 1px ${tokens.colorBrandStroke1}`,
  },
  
  formatCardIcon: {
    fontSize: '24px',
    marginBottom: '8px',
    display: 'block',
  },
  
  formatCardTitle: {
    fontSize: '16px',
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    marginBottom: '4px',
  },
  
  formatCardPreview: {
    fontSize: '14px',
    color: tokens.colorNeutralForeground3,
  },

  // 描述文本
  description: {
    fontSize: '14px',
    color: tokens.colorNeutralForeground3,
    lineHeight: '1.4',
  },

  // 分隔线
  divider: {
    width: '100%',
    height: '1px',
    backgroundColor: tokens.colorNeutralStroke3,
  },

  // 操作按钮区域 - 右对齐
  actionButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    ...shorthands.gap('12px'),
    width: '100%',
    paddingTop: '24px',
  },
  
  resetButton: {
    height: '40px',
    fontSize: '14px',
    fontWeight: tokens.fontWeightRegular,
    color: tokens.colorNeutralForeground2,
    backgroundColor: 'transparent',
    ...shorthands.border('none'),
    '&:hover': {
      color: tokens.colorNeutralForeground1,
      backgroundColor: tokens.colorNeutralBackground2,
    },
  },
  
  saveButton: {
    height: '40px',
    minWidth: '120px',
    fontSize: '14px',
    fontWeight: tokens.fontWeightSemibold,
    borderRadius: '8px',
  },
  
  loadingContent: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    justifyContent: 'center',
  },
});

const Settings: React.FC = () => {
  const classes = useStyles();
  const folderPathId = React.useId();
  const dateFormatId = React.useId();
  const toasterId = React.useId();
  const { dispatchToast } = useToastController(toasterId);

  const [settings, setSettings] = React.useState<AppSettings>({
    folder_path: '',
    date_format: 'YYYYMMDD',
    auto_start: true, // 默认启用，不可更改
    auto_create_on_startup: true // 默认启用，不可更改
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const showToast = (title: string, message: string, intent: 'success' | 'error' | 'info' = 'info') => {
    const icon = intent === 'success' ? <CheckmarkCircleRegular /> : 
                 intent === 'error' ? <ErrorCircleRegular /> : 
                 undefined;

    dispatchToast(
      <Toast>
        <ToastTitle media={icon}>{title}</ToastTitle>
        <ToastBody>{message}</ToastBody>
      </Toast>,
      { intent }
    );
  };

  // 加载设置
  React.useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await invoke<AppSettings>('get_settings');
        setSettings(savedSettings);
      } catch (err) {
        console.error('加载设置失败:', err);
        showToast('加载失败', '无法加载保存的设置，使用默认设置', 'error');
      }
    };

    loadSettings();
  }, []);

  const handleSelectFolder = async () => {
    setIsLoading(true);
    try {
      const selectedPath = await open({
        directory: true,
        multiple: false,
        title: '选择文件夹'
      });
      
      if (selectedPath && typeof selectedPath === 'string') {
        setSettings(prev => ({ ...prev, folder_path: selectedPath }));
        showToast('文件夹已选择', '路径设置成功', 'success');
      }
    } catch (err) {
      showToast('选择失败', '无法选择文件夹: ' + (err instanceof Error ? err.message : String(err)), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings.folder_path) {
      showToast('保存失败', '请先选择文件夹路径', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await invoke('save_settings', { settings });
      showToast('保存成功', '设置已成功保存', 'success');
    } catch (err) {
      showToast('保存失败', '无法保存设置: ' + (err instanceof Error ? err.message : String(err)), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSettings(prev => ({
      ...prev,
      folder_path: '',
      date_format: 'YYYYMMDD',
    }));
    showToast('重置成功', '设置已恢复到默认值', 'success');
  };

  const handlePathChange: InputProps['onChange'] = (event, data) => {
    setSettings(prev => ({ ...prev, folder_path: data.value }));
  };

  const handleDateFormatChange = (format: 'MMDD' | 'YYYYMMDD') => {
    setSettings(prev => ({ ...prev, date_format: format }));
  };

  const getCurrentDatePreview = (format: string) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    return format === 'MMDD' ? `${month}${day}` : `${year}${month}${day}`;
  };

  return (
    <>
      <Toaster toasterId={toasterId} />
      <div className={classes.container}>
        {/* 头部 */}
        <header className={classes.header}>
          <Text className={classes.title}>Smart Folder Zen</Text>
          <Text className={classes.subtitle}>智能文件夹自动创建工具</Text>
        </header>

        {/* 设置内容 */}
        <div className={classes.settingsContent}>
          {/* 文件夹路径设置 */}
          <div className={classes.fieldGroup}>
            <div className={classes.fieldHeader}>
              <span className={classes.fieldIcon}>📂</span>
              <Text className={classes.fieldTitle}>根目录路径 (Root Directory Path)</Text>
            </div>
            <div className={classes.inputContainer}>
              <Input
                id={folderPathId}
                value={settings.folder_path}
                onChange={handlePathChange}
                placeholder="E:\Tmp\inbox"
                disabled={isLoading}
                className={classes.input}
              />
              <Button
                onClick={handleSelectFolder}
                disabled={isLoading}
                className={classes.browseButton}
              >
                {isLoading ? <Spinner size="tiny" /> : '浏览...'}
              </Button>
            </div>
            <Text className={classes.description}>
              新创建的日期文件夹将存放于此
            </Text>
          </div>

          {/* 日期格式设置 */}
          <div className={classes.fieldGroup}>
            <div className={classes.fieldHeader}>
              <span className={classes.fieldIcon}>🗓️</span>
              <Text className={classes.fieldTitle}>日期格式 (Date Format)</Text>
            </div>
            <div className={classes.formatCardsContainer}>
              <div 
                className={`${classes.formatCard} ${settings.date_format === 'MMDD' ? classes.formatCardSelected : ''}`}
                onClick={() => handleDateFormatChange('MMDD')}
              >
                <span className={classes.formatCardIcon}>{settings.date_format === 'MMDD' ? '◉' : '○'}</span>
                <div className={classes.formatCardTitle}>MMDD</div>
                <div className={classes.formatCardPreview}>预览: {getCurrentDatePreview('MMDD')}</div>
              </div>
              <div 
                className={`${classes.formatCard} ${settings.date_format === 'YYYYMMDD' ? classes.formatCardSelected : ''}`}
                onClick={() => handleDateFormatChange('YYYYMMDD')}
              >
                <span className={classes.formatCardIcon}>{settings.date_format === 'YYYYMMDD' ? '◉' : '○'}</span>
                <div className={classes.formatCardTitle}>YYYYMMDD</div>
                <div className={classes.formatCardPreview}>预览: {getCurrentDatePreview('YYYYMMDD')}</div>
              </div>
            </div>
            <Text className={classes.description}>
              选择您偏好的文件夹命名方式
            </Text>
          </div>
        </div>

        {/* 分隔线 */}
        <div className={classes.divider} />

        {/* 操作按钮 */}
        <div className={classes.actionButtons}>
          <Button
            onClick={handleReset}
            disabled={isLoading}
            className={classes.resetButton}
          >
            重置
          </Button>
          <Button
            appearance="primary"
            icon={<SaveRegular />}
            onClick={handleSave}
            disabled={isLoading}
            className={classes.saveButton}
          >
            {isLoading ? (
              <div className={classes.loadingContent}>
                <Spinner size="tiny" />
                保存中...
              </div>
            ) : (
              '保存设置'
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default Settings;