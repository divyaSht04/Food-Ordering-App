import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar
} from 'react-native'
import React from 'react'
import {Slot} from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function _Layout() {
    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
                <ScrollView className="bg-white h-full px-5 py-4" keyboardShouldPersistTaps="handled">
                    <Slot/>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
