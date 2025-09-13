; Smart Folder Zen Uninstall Cleanup Script
; This script runs during uninstallation to clean up application data

!macro NSIS_HOOK_PREUNINSTALL
  ; This runs before removing any files, registry keys and shortcuts
  ; Stop any running processes first
  nsExec::Exec 'taskkill /f /im "smart_folder_zen.exe" /t'
  Pop $0
!macroend

!macro NSIS_HOOK_POSTUNINSTALL
  ; This runs after files, registry keys and shortcuts have been removed
  
  ; Remove application data directories
  RMDir /r "$APPDATA\com.smartfolderzen.app"
  RMDir /r "$LOCALAPPDATA\com.smartfolderzen.app"
  
  ; Remove autostart registry entry
  DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "smart_folder_zen"
  
  ; Try alternative app data paths in case the identifier changed
  RMDir /r "$APPDATA\smart_folder_zen"
  RMDir /r "$LOCALAPPDATA\smart_folder_zen"
  
  ; Remove any remaining program files
  RMDir /r "$PROGRAMFILES\smart_folder_zen"
  RMDir /r "$PROGRAMFILES32\smart_folder_zen"
  
  ; Message to user about successful cleanup
  MessageBox MB_OK "Smart Folder Zen has been completely removed from your system.$\r$\n$\r$\nAll application data and settings have been deleted."
!macroend