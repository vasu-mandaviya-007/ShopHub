Write-Host "Starting Development Environment in Windows Terminal (Tabs)..." -ForegroundColor Green

# Yahan humne Activate.ps1 ke baad \; ka use kiya hai.
# Isse Windows Terminal confuse nahi hoga aur command properly PowerShell ko bhej dega.

$wtArgs = '-w 0 ' +
    'new-tab --title "Admin" -d ".\admin" powershell -NoExit -Command "npm run dev" ; ' +
    'new-tab --title "Backend Server" -d ".\backend" powershell -NoExit -Command "npm start" ; ' +
    'new-tab --title "Frontend" -d ".\frontend" powershell -NoExit -Command "npm run dev" ; ';

# Start-Process se directly Windows Terminal ko call karenge
Start-Process wt.exe -ArgumentList $wtArgs

Write-Host "Launched Windows Terminal with 4 tabs successfully!" -ForegroundColor Green 