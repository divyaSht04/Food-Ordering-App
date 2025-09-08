interface CustomInputProps {
    placeholder?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    label: string;
    secureTextEntry?: boolean;
    keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    autoComplete?: "email" | "password" | "name" | "username" | "off";
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    error?: boolean;
    errorMessage?: string;
    className?: string;
}

interface CustomButtonProps {
    onPress?: () => void;
    title?: string;
    style?: string;
    className?: string;
    textClassName?: string;
    leftIcon?: React.ReactNode;
    textStyle?: string;
    isLoading?: boolean;
    disabled?: boolean;
}

interface TabBarIconProps {
    focused: boolean;
    icon: ImageSourcePropType;
    title: string;
};

