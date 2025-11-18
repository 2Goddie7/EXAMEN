import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-600 active:bg-primary-700';
      case 'secondary':
        return 'bg-secondary-500 active:bg-secondary-600';
      case 'outline':
        return 'bg-transparent border-2 border-primary-600 active:bg-primary-50';
      case 'danger':
        return 'bg-red-600 active:bg-red-700';
      default:
        return 'bg-primary-600 active:bg-primary-700';
    }
  };

  const getTextStyles = () => {
    if (variant === 'outline') {
      return 'text-primary-600 font-semibold';
    }
    return 'text-white font-semibold';
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return 'px-3 py-2';
      case 'medium':
        return 'px-4 py-3';
      case 'large':
        return 'px-6 py-4';
      default:
        return 'px-4 py-3';
    }
  };

  const getTextSizeStyles = () => {
    switch (size) {
      case 'small':
        return 'text-sm';
      case 'medium':
        return 'text-base';
      case 'large':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`
        rounded-xl flex-row items-center justify-center
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'opacity-50' : ''}
      `}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#0057e6' : 'white'} />
      ) : (
        <>
          {icon && <View className="mr-2">{icon}</View>}
          <Text className={`${getTextStyles()} ${getTextSizeStyles()}`}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};