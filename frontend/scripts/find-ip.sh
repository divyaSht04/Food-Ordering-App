#!/bin/bash

# Script to find your computer's IP address for mobile development

echo "=== Finding Your Computer's IP Address ==="
echo ""

# Check if running on Windows (WSL or Git Bash)
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ -n "$WSL_DISTRO_NAME" ]]; then
    echo "Windows detected. Finding IP address..."
    
    # Try ipconfig first (Windows)
    if command -v ipconfig.exe &> /dev/null; then
        echo "Using ipconfig.exe:"
        ipconfig.exe | grep -A 5 "Wireless LAN adapter Wi-Fi:" | grep "IPv4 Address" | head -1
        ipconfig.exe | grep -A 5 "Ethernet adapter:" | grep "IPv4 Address" | head -1
    fi
    
    # Also try hostname -I if available
    if command -v hostname &> /dev/null; then
        echo ""
        echo "Alternative method:"
        echo "IP: $(hostname -I | awk '{print $1}')"
    fi

# Check if running on macOS
elif [[ "$OSTYPE" == "darwin"* ]]; then
    echo "macOS detected. Finding IP address..."
    
    # Get IP from ifconfig
    echo "Wi-Fi IP:"
    ifconfig en0 | grep "inet " | awk '{print $2}'
    
    echo ""
    echo "Ethernet IP:"
    ifconfig en1 | grep "inet " | awk '{print $2}' 2>/dev/null || echo "No ethernet connection"

# Check if running on Linux
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "Linux detected. Finding IP address..."
    
    # Try multiple methods
    if command -v hostname &> /dev/null; then
        echo "Using hostname:"
        hostname -I | awk '{print $1}'
    fi
    
    echo ""
    echo "Using ip command:"
    ip route get 1 | awk '{print $7}' | head -1
    
    echo ""
    echo "Using ifconfig (if available):"
    ifconfig | grep -A 1 "wlan0\|eth0\|enp" | grep "inet " | awk '{print $2}' | head -2

else
    echo "Unknown OS. Please check manually:"
    echo "- Windows: Run 'ipconfig' in command prompt"
    echo "- macOS/Linux: Run 'ifconfig' in terminal"
fi

echo ""
echo "=== Instructions ==="
echo "1. Look for an IP address starting with 192.168.x.x or 10.x.x.x"
echo "2. Copy this IP address"
echo "3. Open frontend/utils/networkConfig.ts"
echo "4. Replace the COMPUTER_IP value with your actual IP"
echo "5. Example: COMPUTER_IP: '192.168.1.100',"
echo ""
echo "Note: Make sure your phone and computer are on the same WiFi network!"
