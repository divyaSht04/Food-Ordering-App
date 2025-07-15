import {View, Text, Alert} from 'react-native'
import {Link, router} from "expo-router";
import CustomInput from "@/component/CustomInput";
import CustomButton from "@/component/CustomButton";
import React, {useState} from "react";

const SignIn = () => {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        email: "",
        password: "",
    })

    const submit = async () =>{
        if(!form.email || !form.password) Alert.alert("Please enter a valid email");

        setIsSubmitting(true);

        try{
            // Sign In logic

            Alert.alert("Sign In Successfully!");
            router.replace("/")
        }catch (error:any){
            Alert.alert(error.message)
        }finally {
            setIsSubmitting(false);
        }
    }

    return (
        <View className="gap-10 bg-white rounded-lg p-5 mt-5">
            <CustomInput
                placeholder="Enter Your Email"
                value={form.email}
                onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
                label={"Email"}
                keyboardType={"email-address"}
            />
            <CustomInput
                placeholder="Enter Your Password"
                value={form.password}
                onChangeText={(text) => setForm((prev) => ({ ...prev, password: text }))}
                label={"Email"}
                secureTextEntry={true}
            />
            <CustomButton
                title="Sign In"
                isLoading={isSubmitting}
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
