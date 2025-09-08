import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CustomInput from '@/component/CustomInput';
import CustomButton from '@/component/CustomButton';
import LoadingSpinner from '@/component/LoadingSpinner';
import { useAuthFlow } from '@/hooks/useAuthFlow';
import { AuthFlowState } from '@/types/otp';
import { images } from '@/constants';

const SignIn = () => {
  const {
    currentStep,
    isLoading,
    loginForm,
    updateLoginField,
    handleLogin,
    validateLoginForm,
  } = useAuthFlow();

  useEffect(() => {
    if (currentStep === AuthFlowState.SUCCESS) {
      router.replace('/');
    }
  }, [currentStep]);

  const handleSubmit = async () => {
    if (!validateLoginForm()) return;
    
    const success = await handleLogin();
    if (success) {
      router.replace('/');
    }
  };

  const goToSignUp = () => {
    router.push('/otp-verification');
  };

  return (
    <View className="flex-1">
      {/* Header Image */}
      <View className="w-full relative mb-6" style={{height: Dimensions.get("screen").height / 4}}>
        <ImageBackground source={images.loginGraphic} className="size-full rounded-b-lg"
                         resizeMode={"cover"}/>
        <Image source={images.logo} className="self-center w-28 h-28 absolute -bottom-3 z-16"/>
      </View>

      {/* Header */}
      <View className="items-center mb-6">
        <View className="bg-blue-100 rounded-full p-3 mb-3">
          <Ionicons name="log-in" size={28} color="#3B82F6" />
        </View>
        <Text className="text-2xl font-bold text-gray-900 mb-1">
          Welcome Back
        </Text>
        <Text className="text-sm text-gray-600 text-center">
          Sign in to continue your food journey
        </Text>
      </View>

      {/* Sign In Form */}
      <View>
        <CustomInput
          placeholder="Enter your email address"
          value={loginForm.email}
          onChangeText={(text) => updateLoginField('email', text)}
          label="Email Address"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          leftIcon={
            <Ionicons name="mail-outline" size={18} color="#6B7280" />
          }
        />
        
        <CustomInput
          placeholder="Enter your password"
          value={loginForm.password}
          onChangeText={(text) => updateLoginField('password', text)}
          label="Password"
          secureTextEntry={true}
          autoComplete="password"
          leftIcon={
            <Ionicons name="lock-closed-outline" size={18} color="#6B7280" />
          }
        />

        {/* Forgot Password */}
        <TouchableOpacity className="self-end mb-4">
          <Text className="text-blue-600 text-sm font-medium">
            Forgot Password?
          </Text>
        </TouchableOpacity>

        {/* Sign In Button */}
        <View className="mb-4">
          {isLoading ? (
            <View className="bg-blue-600 rounded-xl p-4 items-center justify-center">
              <LoadingSpinner color="#FFFFFF" size="small" />
            </View>
          ) : (
            <CustomButton
              title="Sign In"
              onPress={handleSubmit}
              style="bg-blue-600 rounded-xl p-4"
            />
          )}
        </View>

        {/* Divider */}
        <View className="flex-row items-center my-4">
          <View className="flex-1 h-px bg-gray-200" />
          <Text className="text-gray-500 text-xs font-medium px-3">
            Don't have an account?
          </Text>
          <View className="flex-1 h-px bg-gray-200" />
        </View>

        {/* Sign Up Link */}
        <TouchableOpacity
          onPress={goToSignUp}
          className="bg-green-50 rounded-xl p-3 border border-green-200"
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="person-add-outline" size={18} color="#16A34A" />
            <Text className="text-green-600 font-semibold text-sm ml-2">
              Create New Account
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View className="items-center mt-4">
        <Text className="text-gray-500 text-xs text-center leading-4">
          By signing in, you agree to our{' '}
          <Text className="text-blue-600 font-medium">Terms of Service</Text>
          {' '}and{' '}
          <Text className="text-blue-600 font-medium">Privacy Policy</Text>
        </Text>
      </View>
    </View>
  );
};

export default SignIn;
