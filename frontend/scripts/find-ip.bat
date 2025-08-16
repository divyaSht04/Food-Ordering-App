@echo off
echo =================================
echo  Finding Your Computer's IP Address
echo =================================
echo.

echo Your computer's IP addresses:
echo.

ipconfig | findstr /C:"IPv4 Address"

echo.
echo =================================
echo  Instructions:
echo =================================
echo 1. Look for an IP address starting with 192.168.x.x or 10.x.x.x
echo 2. This is usually your Wi-Fi adapter IP address
echo 3. Copy this IP address
echo 4. Open frontend\utils\networkConfig.ts
echo 5. Replace the COMPUTER_IP value with your actual IP
echo 6. Example: COMPUTER_IP: '192.168.1.100',
echo.
echo Note: Make sure your phone and computer are on the same WiFi network!
echo.
pause
