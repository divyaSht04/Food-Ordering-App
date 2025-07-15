import {View, Text, Button, Alert, SafeAreaView} from 'react-native'
import {Link, router} from "expo-router";
import React, {useState} from "react";
import CustomInput from "@/component/CustomInput";
import CustomButton from "@/component/CustomButton";

const SignUp = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    })

    const submit = async () =>{
        if(!form.email || !form.password) Alert.alert("Please enter a valid email");

        setIsSubmitting(true);

        try{
            // Sign Up logic

            Alert.alert("Sign Up Successfully!");
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
                placeholder="Enter Your Full Name"
                value={form.password}
                onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
                label={"Name"}
            />
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
                title="Sign Up"
                isLoading={isSubmitting}
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
