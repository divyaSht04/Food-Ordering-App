import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { getNetworkInfo, getApiBaseUrl } from '../utils/networkConfig';
import AuthService from '../services/AuthService';

interface NetworkDebugProps {
  onClose?: () => void;
}

export const NetworkDebugger: React.FC<NetworkDebugProps> = ({ onClose }) => {
  const [networkInfo, setNetworkInfo] = useState(getNetworkInfo());
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    setNetworkInfo(getNetworkInfo());
  }, []);

  const testConnection = async () => {
    setConnectionStatus('testing');
    setErrorMessage('');

    try {
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Connection timeout')), 5000)
      );

      // Try to make a simple request to test connectivity
      const fetchPromise = fetch(`${getApiBaseUrl()}/auth/test`, {
        method: 'GET',
      });

      const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;

      if (response.ok) {
        setConnectionStatus('success');
        Alert.alert('Success', 'Connection to backend successful!');
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      setConnectionStatus('error');
      const message = error instanceof Error ? error.message : 'Unknown error';
      setErrorMessage(message);
      Alert.alert('Connection Error', message);
    }
  };

  const copyToClipboard = (text: string) => {
    // You can implement clipboard functionality here if needed
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
          <Text className="mb-1">Environment: {networkInfo.isDevelopment ? 'Development' : 'Production'}</Text>
          <Text className="mb-1">Physical Device: {networkInfo.isPhysicalDevice ? 'Yes' : 'No'}</Text>
          <TouchableOpacity onPress={() => copyToClipboard(networkInfo.baseUrl)}>
            <Text className="mb-1 text-blue-600">API Base URL: {networkInfo.baseUrl}</Text>
          </TouchableOpacity>
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
