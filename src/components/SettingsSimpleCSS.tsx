import React, { useState } from 'react';
import { AppSettings } from '../types/settings';

const SettingsSimpleCSS: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({
    folder_path: '',
    date_format: 'YYYYMMDD',
    auto_start: false,
    auto_create_on_startup: true
  });

  const [message, setMessage] = useState('');

  const handleSelectFolder = async () => {
    try {
      // 简化版本 - 后续集成完整功能
      setMessage('文件夹选择功能将在后续版本完善');
    } catch (err) {
      setMessage('选择文件夹失败: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleSave = async () => {
    try {
      // 简化版本 - 后续集成完整功能
      setMessage('设置保存功能将在后续版本完善');
    } catch (err) {
      setMessage('保存设置失败: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleReset = () => {
    setSettings((prev: AppSettings) => ({
      ...prev,
      folder_path: '',
      date_format: 'YYYYMMDD',
      auto_start: false,
      auto_create_on_startup: true
    }));
    setMessage('设置已重置');
  };

  const handleFormatChange = (format: 'MMDD' | 'YYYYMMDD') => {
    setSettings((prev: AppSettings) => ({ ...prev, date_format: format }));
  };

  const handlePathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings((prev: AppSettings) => ({ ...prev, folder_path: e.target.value }));
  };

  const handleAutoStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings((prev: AppSettings) => ({ ...prev, auto_start: e.target.checked }));
  };

  const handleAutoCreateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings((prev: AppSettings) => ({ ...prev, auto_create_on_startup: e.target.checked }));
  };

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      minHeight: '100vh'
    }}>
      <header style={{
        textAlign: 'center',
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '2px solid #f0f0f0'
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '600',
          color: '#2c3e50',
          margin: '0 0 10px 0'
        }}>
          Smart Folder Zen
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#7f8c8d',
          margin: 0
        }}>
          智能文件夹自动创建工具
        </p>
      </header>

      {message && (
        <div style={{
          padding: '12px 16px',
          marginBottom: '20px',
          backgroundColor: message.includes('失败') ? '#fee' : '#e8f5e8',
          border: `1px solid ${message.includes('失败') ? '#fcc' : '#d4edda'}`,
          borderRadius: '6px',
          color: message.includes('失败') ? '#c3262c' : '#155724',
          fontSize: '14px'
        }}>
          {message}
        </div>
      )}

      <div style={{
        display: 'grid',
        gap: '25px'
      }}>
        {/* 文件夹路径设置 */}
        <div style={{
          padding: '20px',
          border: '1px solid #e1e8ed',
          borderRadius: '8px',
          backgroundColor: '#fafbfc'
        }}>
          <h3 style={{
            margin: '0 0 15px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: '#2c3e50'
          }}>
            📁 文件夹路径
          </h3>
          <div style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            marginBottom: '10px'
          }}>
            <input
              type="text"
              value={settings.folder_path}
              onChange={handlePathChange}
              placeholder="选择文件夹路径..."
              style={{
                flex: 1,
                padding: '10px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'inherit'
              }}
            />
            <button
              onClick={handleSelectFolder}
              style={{
                padding: '10px 16px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              浏览
            </button>
          </div>
          <p style={{
            fontSize: '12px',
            color: '#666',
            margin: '5px 0 0 0'
          }}>
            选择要创建日期文件夹的根目录
          </p>
        </div>

        {/* 日期格式设置 */}
        <div style={{
          padding: '20px',
          border: '1px solid #e1e8ed',
          borderRadius: '8px',
          backgroundColor: '#fafbfc'
        }}>
          <h3 style={{
            margin: '0 0 15px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: '#2c3e50'
          }}>
            📅 日期格式
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '6px',
              backgroundColor: settings.date_format === 'MMDD' ? '#e3f2fd' : 'transparent'
            }}>
              <input
                type="radio"
                name="dateFormat"
                value="MMDD"
                checked={settings.date_format === 'MMDD'}
                onChange={() => handleFormatChange('MMDD')}
                style={{ marginRight: '10px' }}
              />
              <div>
                <strong>MMDD</strong>
                <span style={{ color: '#666', marginLeft: '8px' }}>例如: 0912</span>
              </div>
            </label>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '6px',
              backgroundColor: settings.date_format === 'YYYYMMDD' ? '#e3f2fd' : 'transparent'
            }}>
              <input
                type="radio"
                name="dateFormat"
                value="YYYYMMDD"
                checked={settings.date_format === 'YYYYMMDD'}
                onChange={() => handleFormatChange('YYYYMMDD')}
                style={{ marginRight: '10px' }}
              />
              <div>
                <strong>YYYYMMDD</strong>
                <span style={{ color: '#666', marginLeft: '8px' }}>例如: 20240912</span>
              </div>
            </label>
          </div>
        </div>

        {/* 自动化设置 */}
        <div style={{
          padding: '20px',
          border: '1px solid #e1e8ed',
          borderRadius: '8px',
          backgroundColor: '#fafbfc'
        }}>
          <h3 style={{
            margin: '0 0 15px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: '#2c3e50'
          }}>
            ⚙️ 自动化设置
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '8px'
            }}>
              <input
                type="checkbox"
                checked={settings.auto_start}
                onChange={handleAutoStartChange}
                style={{ marginRight: '10px' }}
              />
              <div>
                <div style={{ fontWeight: '500' }}>开机自动启动</div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                  系统启动时自动运行应用程序
                </div>
              </div>
            </label>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '8px'
            }}>
              <input
                type="checkbox"
                checked={settings.auto_create_on_startup}
                onChange={handleAutoCreateChange}
                style={{ marginRight: '10px' }}
              />
              <div>
                <div style={{ fontWeight: '500' }}>启动时自动创建文件夹</div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                  应用启动时自动创建当日文件夹
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div style={{
        display: 'flex',
        gap: '15px',
        marginTop: '30px',
        paddingTop: '20px',
        borderTop: '1px solid #eee'
      }}>
        <button
          onClick={handleSave}
          style={{
            flex: 1,
            padding: '12px 20px',
            backgroundColor: '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          保存设置
        </button>
        <button
          onClick={handleReset}
          style={{
            flex: 1,
            padding: '12px 20px',
            backgroundColor: '#95a5a6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          重置设置
        </button>
      </div>
    </div>
  );
};

export default SettingsSimpleCSS;