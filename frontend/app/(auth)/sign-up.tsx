import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
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

const SignUp = () => {
  const {
    currentStep,
    isLoading,
    registerForm,
    pendingEmail,
    updateRegisterField,
    handleInitiateRegistration,
    validateRegisterForm,
  } = useAuthFlow();

  useEffect(() => {
    if (currentStep === AuthFlowState.OTP_VERIFICATION && pendingEmail) {
      router.push({
        pathname: '/otp-verification',
        params: { email: pendingEmail }
      });
    }
  }, [currentStep, pendingEmail]);

  const handleSignUpSubmit = async () => {
    if (!validateRegisterForm()) return;
    await handleInitiateRegistration();
  };

  const goToSignIn = () => {
    router.push('/sign-in');
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
        <View className="bg-green-100 rounded-full p-3 mb-3">
          <Ionicons name="person-add" size={28} color="#16A34A" />
        </View>
        <Text className="text-2xl font-bold text-gray-900 mb-1">
          Create Account
        </Text>
        <Text className="text-sm text-gray-600 text-center">
          Join our community and start your food delivery experience
        </Text>
      </View>

      {/* Form Fields */}
      <View>
        <CustomInput
          placeholder="Enter your full name"
          value={registerForm.fullName}
          onChangeText={(text) => updateRegisterField('fullName', text)}
          label="Full Name"
          autoCapitalize="words"
          leftIcon={
            <Ionicons name="person-outline" size={18} color="#6B7280" />
          }
        />
        
        <CustomInput
          placeholder="Enter your email address"
          value={registerForm.email}
          onChangeText={(text) => updateRegisterField('email', text)}
          label="Email Address"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          leftIcon={
            <Ionicons name="mail-outline" size={18} color="#6B7280" />
          }
        />
        
        <CustomInput
          placeholder="Enter your phone number"
          value={registerForm.phoneNumber}
          onChangeText={(text) => updateRegisterField('phoneNumber', text)}
          label="Phone Number"
          keyboardType="phone-pad"
          leftIcon={
            <Ionicons name="call-outline" size={18} color="#6B7280" />
          }
        />
        
        <CustomInput
          placeholder="Create a secure password"
          value={registerForm.password}
          onChangeText={(text) => updateRegisterField('password', text)}
          label="Password"
          secureTextEntry={true}
          autoComplete="password"
          leftIcon={
            <Ionicons name="lock-closed-outline" size={18} color="#6B7280" />
          }
        />

        {/* Sign Up Button */}
        <View className="mt-4">
          {isLoading ? (
            <View className="bg-green-600 rounded-xl p-4 items-center justify-center">
              <LoadingSpinner color="#FFFFFF" size="small" />
            </View>
          ) : (
            <CustomButton
              title="Create Account"
              onPress={handleSignUpSubmit}
              style="bg-green-600 rounded-xl p-4"
            />
          )}
        </View>

        {/* Divider */}
        <View className="flex-row items-center my-4">
          <View className="flex-1 h-px bg-gray-200" />
          <Text className="text-gray-500 text-xs font-medium px-3">
            Already have an account?
          </Text>
          <View className="flex-1 h-px bg-gray-200" />
        </View>

        {/* Sign In Link */}
        <TouchableOpacity
          onPress={goToSignIn}
          className="bg-blue-50 rounded-xl p-3 border border-blue-200"
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="log-in-outline" size={18} color="#2563EB" />
            <Text className="text-blue-600 font-semibold text-sm ml-2">
              Sign In Instead
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View className="items-center mt-4">
        <Text className="text-gray-500 text-xs text-center leading-4">
          By creating an account, you agree to our{' '}
          <Text className="text-blue-600 font-medium">Terms of Service</Text>
          {' '}and{' '}
          <Text className="text-blue-600 font-medium">Privacy Policy</Text>
        </Text>
      </View>
    </View>
  );
};

export default SignUp;
