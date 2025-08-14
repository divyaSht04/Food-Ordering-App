import { View, Text, Alert } from 'react-native';
import { Link, router } from "expo-router";
import React from "react";
import CustomInput from "@/component/CustomInput";
import CustomButton from "@/component/CustomButton";
import { useAuthForms } from "@/hooks/useAuthForms";

const SignUp = () => {
    const {
        registerForm,
        updateRegisterField,
        handleRegister,
        isRegisterLoading,
    } = useAuthForms();

    const submit = async () => {
        const success = await handleRegister();
        if (success) {
            Alert.alert("Success", "Account created successfully!");
            router.replace("/");
        }
    };

    return (
        <View className="gap-10 bg-white rounded-lg p-5 mt-5">
            <CustomInput
                placeholder="Enter Your Full Name"
                value={registerForm.fullName}
                onChangeText={(text) => updateRegisterField('fullName', text)}
                label={"Full Name"}
            />
            <CustomInput
                placeholder="Enter Your Email"
                value={registerForm.email}
                onChangeText={(text) => updateRegisterField('email', text)}
                label={"Email"}
                keyboardType={"email-address"}
            />
            <CustomInput
                placeholder="Enter Your Phone Number"
                value={registerForm.phoneNumber}
                onChangeText={(text) => updateRegisterField('phoneNumber', text)}
                label={"Phone Number"}
                keyboardType={"phone-pad"}
            />
            <CustomInput
                placeholder="Enter Your Password"
                value={registerForm.password}
                onChangeText={(text) => updateRegisterField('password', text)}
                label={"Password"}
                secureTextEntry={true}
            />
            <CustomButton
                title="Sign Up"
                isLoading={isRegisterLoading}
                onPress={submit}
            />

            <View className="flex justify-center mt-5 flex-wrap gap-2">
                <Text className="base-regular text-gray-100 ">
                    Already Have an Account?
                </Text>
                <Link href={"/sign-in"} className="base-bold text-primary">
                    Sign In
                </Link>
            </View>
        </View>
    )
}
export default SignUp
