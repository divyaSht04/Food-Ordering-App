import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
} from 'react-native';

interface OtpInputProps {
  length: number;
  value: string;
  onChange: (otp: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  error?: boolean;
}

const { width } = Dimensions.get('window');
const inputSize = Math.min((width - 80) / 6, 50);

const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  value,
  onChange,
  disabled = false,
  autoFocus = true,
  placeholder = '○',
  error = false,
}) => {
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleTextChange = (text: string, index: number) => {
    if (disabled) return;

    const numericText = text.replace(/[^0-9]/g, '');
    
    if (numericText.length > 1) {
      const otpArray = value.split('');
      const pastedDigits = numericText.slice(0, length - index);
      
      for (let i = 0; i < pastedDigits.length && index + i < length; i++) {
        otpArray[index + i] = pastedDigits[i];
      }
      
      const newOtp = otpArray.join('');
      onChange(newOtp);
      
      const nextIndex = Math.min(index + pastedDigits.length, length - 1);
      if (inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex].focus();
      }
    } else {
      const otpArray = value.split('');
      otpArray[index] = numericText;
      const newOtp = otpArray.join('');
      onChange(newOtp);

      if (numericText && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (disabled) return;

    if (key === 'Backspace') {
      if (!value[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const handleBlur = () => {
    setFocusedIndex(-1);
  };

  const renderInput = (index: number) => {
    const isFocused = focusedIndex === index;
    const hasValue = !!value[index];

    return (
      <TextInput
        key={index}
        ref={(ref) => {
          if (ref) {
            inputRefs.current[index] = ref;
          }
        }}
        style={[
          styles.input,
          {
            width: inputSize,
            height: inputSize,
            borderColor: error
              ? '#EF4444'
              : isFocused
              ? '#3B82F6'
              : hasValue
              ? '#10B981'
              : '#D1D5DB',
            backgroundColor: disabled ? '#F9FAFB' : '#FFFFFF',
          },
        ]}
        value={value[index] || ''}
        onChangeText={(text) => handleTextChange(text, index)}
        onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
        onFocus={() => handleFocus(index)}
        onBlur={handleBlur}
        keyboardType="numeric"
        maxLength={length}
        textAlign="center"
        editable={!disabled}
        placeholder={hasValue ? undefined : placeholder}
        placeholderTextColor="#9CA3AF"
        selectTextOnFocus
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        {Array.from({ length }, (_, index) => renderInput(index))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  input: {
    borderWidth: 2,
    borderRadius: 12,
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
});

export default OtpInput;
