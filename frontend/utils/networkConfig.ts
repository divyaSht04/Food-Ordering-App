import { Platform } from 'react-native';

export const NETWORK_CONFIG = {
  DEV: {
    // To find your IP: Run 'ipconfig' (Windows) or 'ifconfig' (Mac/Linux) in terminal
    COMPUTER_IP: process.env.IP_ADDRESS, // Your actual computer IP address

    ANDROID_EMULATOR_IP: '10.0.2.2',
    IOS_SIMULATOR_IP: 'localhost',

    BACKEND_PORT: '8084',
  },

  PROD: {
    BASE_URL: 'https://your-production-api.com', // Replace with your production URL
  },
};


export const getApiBaseUrl = (): string => {
  if (__DEV__) {
    const baseIP = Platform.select({
      android: NETWORK_CONFIG.DEV.COMPUTER_IP, // Use computer IP for physical Android device
      ios: NETWORK_CONFIG.DEV.IOS_SIMULATOR_IP, // Use localhost for iOS simulator
      default: NETWORK_CONFIG.DEV.COMPUTER_IP,
    });
    
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
  };
};
