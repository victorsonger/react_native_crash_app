import { View, Text, TouchableOpacity } from "react-native";
import React, { FC } from "react";

interface MyProps {
  title: string;
  textStyles?: any;
  handlePress?: any;
  containerStyles?: string;
  isLoading?: boolean;
}

const CustomButton: FC<MyProps> = ({
  title,
  textStyles = "",
  handlePress,
  containerStyles = "",
  isLoading = false,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`bg-secondary rounded-xl min-h-[62px] justify-center items-center ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      activeOpacity={0.7}
      disabled={isLoading}
    >
      <Text className={`text-primary font-psemibold text-lg ${textStyles}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
