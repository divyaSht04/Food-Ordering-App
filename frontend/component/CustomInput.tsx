import {View, Text, TextInput} from 'react-native'
import React, {useState} from 'react'
import cn from "clsx";

const CustomInput = ({
    placeholder = "Enter text",
    value,
    onChangeText,
    label,
    secureTextEntry = false,
    keyboardType = "default",
    autoCapitalize = "none",
    autoComplete,
    leftIcon,
    rightIcon,
    error = false,
    errorMessage,
    className,
}: CustomInputProps) => {

    const [isFocused, setIsFocused] = useState(false);

    return (
        <View className="w-full mb-4">
            {label && (
                <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
            )}
            <View className={cn(
                'flex-row items-center border rounded-xl px-4 py-3 min-h-[48px]',
                isFocused ? 'border-blue-500 bg-blue-50' : error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50',
                className
            )}>
                {leftIcon && (
                    <View className="mr-4 items-center justify-center">
                        {leftIcon}
                    </View>
                )}
                <TextInput
                    autoCapitalize={autoCapitalize}
                    autoCorrect={false}
                    autoComplete={autoComplete}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    placeholderTextColor="#9CA3AF"
                    className="flex-1 text-gray-900 text-base py-0"
                    style={{ lineHeight: 20 }}
                />
                {rightIcon && (
                    <View className="ml-4 items-center justify-center">
                        {rightIcon}
                    </View>
                )}
            </View>
            {error && errorMessage && (
                <Text className="text-red-500 text-sm mt-1">{errorMessage}</Text>
            )}
        </View>
    )
}

export default CustomInput
