import { View, Text, Alert } from 'react-native';
import { Link, router } from "expo-router";
import CustomInput from "@/component/CustomInput";
import CustomButton from "@/component/CustomButton";
import React from "react";
import { useAuthForms } from "@/hooks/useAuthForms";

const SignIn = () => {
    const {
        loginForm,
        updateLoginField,
        handleLogin,
        isLoginLoading,
    } = useAuthForms();

    const submit = async () => {
        const success = await handleLogin();
        if (success) {
            Alert.alert("Success", "Signed in successfully!");
            router.replace("/");
        }
    };

    return (
        <View className="gap-10 bg-white rounded-lg p-5 mt-5">
            <CustomInput
                placeholder="Enter Your Email"
                value={loginForm.email}
                onChangeText={(text) => updateLoginField('email', text)}
                label={"Email"}
                keyboardType={"email-address"}
            />
            <CustomInput
                placeholder="Enter Your Password"
                value={loginForm.password}
                onChangeText={(text) => updateLoginField('password', text)}
                label={"Password"}
                secureTextEntry={true}
            />
            <CustomButton
                title="Sign In"
                isLoading={isLoginLoading}
                onPress={submit}
            />
            <View className="flex justify-center mt-5 flex-wrap gap-2">
                <Text className="base-regular text-gray-100 ">
                    Dont have an Account?
                </Text>
                <Link href={"/sign-up"} className="base-bold text-primary">
                    Sign Up
                </Link>
            </View>
        </View>
    )
}
export default SignIn
