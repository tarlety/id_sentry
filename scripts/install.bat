@echo on

set BATCHDIR=%~dp0

mkdir "%APPDATA%\ElectronIDSentry\"
copy "%BATCHDIR%\id-sentry-config.json" "%APPDATA%\ElectronIDSentry\"
copy "%BATCHDIR%\ElectronIDSentry.1.0.0.exe" "%USERPROFILE%\Desktop\"
