import { Platform } from 'react-native';

export const NETWORK_CONFIG = {
  DEV: {
    // To find your IP: Run 'ipconfig' (Windows) or 'ifconfig' (Mac/Linux) in terminal
    COMPUTER_IP: process.env.EXPO_PUBLIC_IP_ADDRESS || '192.168.1.79', // Your actual computer IP address

    ANDROID_EMULATOR_IP: process.env.EXPO_PUBLIC_ANDROID_EMULATOR_IP || '10.0.2.2',
    IOS_SIMULATOR_IP: process.env.EXPO_PUBLIC_IOS_SIMULATOR_IP || 'localhost',

    BACKEND_PORT: process.env.EXPO_PUBLIC_BACKEND_PORT || '8084', // Ensure this matches your backend port
  },

  PROD: {
    BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://your-production-api.com', // Replace with your production URL
  },
};


export const getApiBaseUrl = (): string => {
  if (__DEV__) {
    const baseIP = Platform.select({
      android: NETWORK_CONFIG.DEV.COMPUTER_IP, // Use computer IP for physical Android device
      ios: NETWORK_CONFIG.DEV.IOS_SIMULATOR_IP, // Use localhost for iOS simulator
      default: NETWORK_CONFIG.DEV.COMPUTER_IP,
    });
    console.log("Base IP:", baseIP);
    
    return `http://${baseIP}:${NETWORK_CONFIG.DEV.BACKEND_PORT}/api`;
  }
  
  // Production environment
  return `${NETWORK_CONFIG.PROD.BASE_URL}/api`;
};


export const isPhysicalDevice = (): boolean => {
  if (Platform.OS === 'android') {
    return !__DEV__ || Platform.constants.Brand !== 'google'; // Emulator usually has 'google' brand
  }
  
  if (Platform.OS === 'ios') {
    return Platform.constants.systemName !== 'iPhone OS' || !__DEV__;
  }
  
  return false;
};


export const getNetworkInfo = () => {
  const baseUrl = getApiBaseUrl();
  const isPhysical = isPhysicalDevice();
  
  return {
    platform: Platform.OS,
    baseUrl,
    isPhysicalDevice: isPhysical,
    isDevelopment: __DEV__,
    environment: process.env.EXPO_PUBLIC_ENVIRONMENT || 'development',
    debugMode: process.env.EXPO_PUBLIC_DEBUG_MODE === 'true',
    configuredIP: process.env.EXPO_PUBLIC_IP_ADDRESS,
    configuredPort: process.env.EXPO_PUBLIC_BACKEND_PORT,
  };
};

// Environment utilities
export const isDevelopment = (): boolean => {
  return process.env.EXPO_PUBLIC_ENVIRONMENT === 'development' || __DEV__;
};

export const isDebugMode = (): boolean => {
  return process.env.EXPO_PUBLIC_DEBUG_MODE === 'true' || __DEV__;
};

export const getEnvironmentInfo = () => {
  return {
    NODE_ENV: process.env.NODE_ENV,
    EXPO_PUBLIC_ENVIRONMENT: process.env.EXPO_PUBLIC_ENVIRONMENT,
    EXPO_PUBLIC_IP_ADDRESS: process.env.EXPO_PUBLIC_IP_ADDRESS,
    EXPO_PUBLIC_BACKEND_PORT: process.env.EXPO_PUBLIC_BACKEND_PORT,
    EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
    EXPO_PUBLIC_DEBUG_MODE: process.env.EXPO_PUBLIC_DEBUG_MODE,
    __DEV__: __DEV__,
  };
};
