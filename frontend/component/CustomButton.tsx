import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native'
import React from 'react'
import cn from "clsx";

const CustomButton = ({
    onPress,
    title = "Click Me",
    style,
    className,
    textStyle,
    textClassName,
    leftIcon,
    isLoading = false,
    disabled = false
}: CustomButtonProps) => {
    return (
        <TouchableOpacity 
            className={cn(
                "custom-button bg-blue-600 rounded-xl p-4 flex-row items-center justify-center",
                disabled && "opacity-50",
                className || style
            )} 
            onPress={onPress}
            disabled={disabled || isLoading}
            activeOpacity={0.8}
        >
            {leftIcon && !isLoading && (
                <View className="mr-2">
                    {leftIcon}
                </View>
            )}
            <View className="flex-row items-center justify-center">
                {isLoading ? (
                    <ActivityIndicator size="small" color="white" />
                ) : (
                    <Text className={cn(
                        "text-white font-semibold text-base",
                        textClassName || textStyle
                    )}>
                        {title}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    )
}

export default CustomButton
