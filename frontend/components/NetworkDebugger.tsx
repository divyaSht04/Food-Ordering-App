import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { getNetworkInfo, getApiBaseUrl, getEnvironmentInfo } from '../utils/networkConfig';
import AuthService from '../services/AuthService';

interface NetworkDebugProps {
  onClose?: () => void;
}

export const NetworkDebugger: React.FC<NetworkDebugProps> = ({ onClose }) => {
  const [networkInfo, setNetworkInfo] = useState(getNetworkInfo());
  const [environmentInfo, setEnvironmentInfo] = useState(getEnvironmentInfo());
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    setNetworkInfo(getNetworkInfo());
    setEnvironmentInfo(getEnvironmentInfo());
  }, []);

  const testConnection = async () => {
    setConnectionStatus('testing');
    setErrorMessage('');

    try {
      // Test basic connectivity first
      const testUrl = `${getApiBaseUrl()}/auth/health`;
      console.log('Testing connection to:', testUrl);

      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Connection timeout after 10 seconds')), 10000)
      );

      const fetchPromise = fetch(testUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;

      if (response.ok) {
        setConnectionStatus('success');
        Alert.alert('Success', `Connection to backend successful!\nStatus: ${response.status}\nURL: ${testUrl}`);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      setConnectionStatus('error');
      const message = error instanceof Error ? error.message : 'Unknown error';
      setErrorMessage(message);
      console.error('Network test failed:', error);
      Alert.alert('Connection Error', `Failed to connect to backend:\n${message}\n\nTrying to reach: ${getApiBaseUrl()}`);
    }
  };

  const copyToClipboard = (text: string) => {
    Alert.alert('Info', `${text}`);
  };

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-4">Network Configuration Debug</Text>
        
        {/* Network Info */}
        <View className="bg-gray-100 p-4 rounded-lg mb-4">
          <Text className="text-lg font-semibold mb-2">Current Configuration:</Text>
          <Text className="mb-1">Platform: {networkInfo.platform}</Text>
          <Text className="mb-1">Environment: {networkInfo.environment}</Text>
          <Text className="mb-1">Development Mode: {networkInfo.isDevelopment ? 'Yes' : 'No'}</Text>
          <Text className="mb-1">Debug Mode: {networkInfo.debugMode ? 'Yes' : 'No'}</Text>
          <Text className="mb-1">Physical Device: {networkInfo.isPhysicalDevice ? 'Yes' : 'No'}</Text>
          <TouchableOpacity onPress={() => copyToClipboard(networkInfo.baseUrl)}>
            <Text className="mb-1 text-blue-600">API Base URL: {networkInfo.baseUrl}</Text>
          </TouchableOpacity>
        </View>

        {/* Environment Variables */}
        <View className="bg-green-50 p-4 rounded-lg mb-4">
          <Text className="text-lg font-semibold mb-2">Environment Variables:</Text>
          <Text className="mb-1">IP Address: {environmentInfo.EXPO_PUBLIC_IP_ADDRESS || 'Not set'}</Text>
          <Text className="mb-1">Backend Port: {environmentInfo.EXPO_PUBLIC_BACKEND_PORT || 'Not set'}</Text>
          <Text className="mb-1">API Base URL: {environmentInfo.EXPO_PUBLIC_API_BASE_URL || 'Not set'}</Text>
          <Text className="mb-1">Environment: {environmentInfo.EXPO_PUBLIC_ENVIRONMENT || 'Not set'}</Text>
          <Text className="mb-1">Debug Mode: {environmentInfo.EXPO_PUBLIC_DEBUG_MODE || 'Not set'}</Text>
          <Text className="mb-1">Node ENV: {environmentInfo.NODE_ENV || 'Not set'}</Text>
          <Text className="mb-1">DEV Flag: {environmentInfo.__DEV__ ? 'true' : 'false'}</Text>
        </View>

        {/* Connection Test */}
        <View className="bg-blue-50 p-4 rounded-lg mb-4">
          <Text className="text-lg font-semibold mb-2">Connection Test:</Text>
          <TouchableOpacity
            onPress={testConnection}
            disabled={connectionStatus === 'testing'}
            className={`p-3 rounded-lg ${
              connectionStatus === 'testing' 
                ? 'bg-gray-400' 
                : connectionStatus === 'success'
                ? 'bg-green-500'
                : connectionStatus === 'error'
                ? 'bg-red-500'
                : 'bg-blue-500'
            }`}
          >
            <Text className="text-white text-center font-semibold">
              {connectionStatus === 'testing' 
                ? 'Testing...' 
                : connectionStatus === 'success'
                ? 'Connection Successful!'
                : connectionStatus === 'error'
                ? 'Test Failed - Retry'
                : 'Test Connection'
              }
            </Text>
          </TouchableOpacity>
          
          {errorMessage && (
            <View className="mt-2 p-2 bg-red-100 rounded">
              <Text className="text-red-600 text-sm">{errorMessage}</Text>
            </View>
          )}
        </View>

        {/* Instructions */}
        <View className="bg-yellow-50 p-4 rounded-lg mb-4">
          <Text className="text-lg font-semibold mb-2">Setup Instructions:</Text>
          <Text className="mb-2">1. Find your computer's IP address:</Text>
          <Text className="mb-1 ml-4">• Windows: Open cmd and run 'ipconfig'</Text>
          <Text className="mb-1 ml-4">• Mac/Linux: Open terminal and run 'ifconfig'</Text>
          <Text className="mb-2 ml-4">• Look for IPv4 address (usually 192.168.x.x)</Text>
          
          <Text className="mb-2">2. Update the IP in networkConfig.ts:</Text>
          <Text className="mb-1 ml-4">• Open utils/networkConfig.ts</Text>
          <Text className="mb-2 ml-4">• Change COMPUTER_IP to your actual IP</Text>
          
          <Text className="mb-2">3. Make sure your backend allows connections:</Text>
          <Text className="mb-1 ml-4">• Spring Boot should bind to 0.0.0.0:8084</Text>
          <Text className="mb-1 ml-4">• Check firewall settings</Text>
          <Text className="mb-2 ml-4">• Ensure CORS is configured properly</Text>
        </View>

        {/* Close Button */}
        {onClose && (
          <TouchableOpacity
            onPress={onClose}
            className="bg-gray-500 p-3 rounded-lg"
          >
            <Text className="text-white text-center font-semibold">Close Debug</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};
