import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '@/component/CustomButton';
import LoadingSpinner from '@/component/LoadingSpinner';
import OtpInput from '@/component/OtpInput';
import { useAuthFlow } from '@/hooks/useAuthFlow';
import { AuthFlowState } from '@/types/otp';

const OtpVerification = () => {
  const { email } = useLocalSearchParams<{ email: string }>();
  const {
    currentStep,
    isLoading,
    otpCode,
    pendingEmail,
    remainingAttempts,
    setOtpCode,
    handleVerifyOtp,
    handleResendOtp,
  } = useAuthFlow();

  useEffect(() => {
    if (currentStep === AuthFlowState.SUCCESS) {
      router.replace('/');
    }
  }, [currentStep]);

  const handleOtpSubmit = async () => {
    await handleVerifyOtp();
  };

  const goToSignUp = () => {
    router.back();
  };

  return (
    <View className="flex-1">
      {/* Header */}
      <View className="flex-row items-center mb-6">
        <TouchableOpacity
          onPress={goToSignUp}
          className="mr-3 p-2 rounded-full bg-gray-100"
        >
          <Ionicons name="arrow-back" size={18} color="#374151" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-xl font-bold text-gray-900">
            Verify Your Email
          </Text>
        </View>
      </View>

      {/* Instructions */}
      <View className="items-center mb-6">
        <View className="bg-blue-100 rounded-full p-3 mb-3">
          <Ionicons name="mail" size={28} color="#3B82F6" />
        </View>
        <Text className="text-lg font-semibold text-gray-900 mb-2 text-center">
          Enter Verification Code
        </Text>
        <Text className="text-sm text-gray-600 text-center leading-5">
          We've sent a 6-digit verification code to{' '}
          <Text className="font-semibold text-blue-600">
            {email || pendingEmail}
          </Text>
          . Please enter the code to complete your registration.
        </Text>
      </View>

      {/* OTP Input */}
      <View className="mb-4">
        <OtpInput
          value={otpCode}
          onChange={setOtpCode}
          length={6}
        />
      </View>

      {/* Remaining Attempts */}
      {remainingAttempts !== null && remainingAttempts < 3 && (
        <View className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <View className="flex-row items-center justify-center">
            <Ionicons name="warning-outline" size={16} color="#D97706" />
            <Text className="text-yellow-800 text-sm font-medium ml-2">
              {remainingAttempts} attempts remaining
            </Text>
          </View>
        </View>
      )}

      {/* Verify Button */}
      <View className="mb-4">
        {isLoading ? (
          <View className="bg-blue-600 rounded-xl p-4 items-center justify-center">
            <LoadingSpinner color="#FFFFFF" size="small" />
          </View>
        ) : (
          <CustomButton
            title="Verify Code"
            onPress={handleOtpSubmit}
            style="bg-blue-600 rounded-xl p-4"
            disabled={otpCode.length !== 6}
          />
        )}
      </View>

      {/* Resend Code */}
      <View className="flex-row items-center justify-center mb-4">
        <Text className="text-gray-600 text-sm">
          Didn't receive the code?{' '}
        </Text>
        <TouchableOpacity
          onPress={handleResendOtp}
          disabled={isLoading}
          className="ml-1"
        >
          <Text className="text-blue-600 text-sm font-semibold">
            Resend Code
          </Text>
        </TouchableOpacity>
      </View>

      {/* Help Text */}
      <View className="p-3 bg-gray-50 rounded-lg">
        <View className="flex-row items-start">
          <Ionicons name="information-circle-outline" size={16} color="#6B7280" />
          <Text className="text-gray-600 text-xs ml-2 flex-1 leading-4">
            If you don't receive the code, please check your spam folder or try resending.
          </Text>
        </View>
      </View>
    </View>
  );
};

export default OtpVerification;
