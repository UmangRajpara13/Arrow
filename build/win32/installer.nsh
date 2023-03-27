!macro customInstall
  WriteRegStr HKCU "Software\Classes\Directory\Background\shell\Sonic" "" "Open Sonic here"
  WriteRegStr HKCU "Software\Classes\Directory\Background\shell\Sonic" "Icon" "$appExe"
  WriteRegStr HKCU "Software\Classes\Directory\Background\shell\Sonic\command" "" `$appExe "%V"`

  WriteRegStr HKCU "Software\Classes\Directory\shell\Sonic" "" "Open Sonic here"
  WriteRegStr HKCU "Software\Classes\Directory\shell\Sonic" "Icon" "$appExe"
  WriteRegStr HKCU "Software\Classes\Directory\shell\Sonic\command" "" `$appExe "%V"`

  WriteRegStr HKCU "Software\Classes\Drive\shell\Sonic" "" "Open Sonic here"
  WriteRegStr HKCU "Software\Classes\Drive\shell\Sonic" "Icon" "$appExe"
  WriteRegStr HKCU "Software\Classes\Drive\shell\Sonic\command" "" `$appExe "%V"`

  WriteRegStr HKCU "Software\Classes\Directory\Background\shell\SonicAsAdmin" "" "Open Sonic here as Administrator"
  WriteRegStr HKCU "Software\Classes\Directory\Background\shell\SonicAsAdmin" "Icon" "$appExe"
  WriteRegStr HKCU "Software\Classes\Directory\Background\shell\SonicAsAdmin\command" "" `wscript.exe "$LOCALAPPDATA\Microsoft\WindowsApps\Cache/helper.vbs" "$appExe" "%V"`

  WriteRegStr HKCU "Software\Classes\Directory\shell\SonicAsAdmin" "" "Open Sonic here as Administrator"
  WriteRegStr HKCU "Software\Classes\Directory\shell\SonicAsAdmin" "Icon" "$appExe"
  WriteRegStr HKCU "Software\Classes\Directory\shell\SonicAsAdmin\command" "" `wscript.exe "$LOCALAPPDATA\Microsoft\WindowsApps\Cache/helper.vbs" "$appExe" "%V"`

  WriteRegStr HKCU "Software\Classes\Drive\shell\SonicAsAdmin" "" "Open Sonic here as Administrator"
  WriteRegStr HKCU "Software\Classes\Drive\shell\SonicAsAdmin" "Icon" "$appExe"
  WriteRegStr HKCU "Software\Classes\Drive\shell\SonicAsAdmin\command" "" `wscript.exe "$LOCALAPPDATA\Microsoft\WindowsApps\Cache/helper.vbs" "$appExe" "%V"`
!macroend

!macro customUnInstall
  DeleteRegKey HKCU "Software\Classes\Directory\Background\shell\Sonic"
  DeleteRegKey HKCU "Software\Classes\Directory\shell\Sonic"
  DeleteRegKey HKCU "Software\Classes\Drive\shell\Sonic"
!macroend

!macro customInstallMode
  StrCpy $isForceCurrentInstall "1"
!macroend

!macro customInit
  IfFileExists $LOCALAPPDATA\Sonic\Update.exe 0 +2
  nsExec::Exec '"$LOCALAPPDATA\Sonic\Update.exe" --uninstall -s'
!macroend