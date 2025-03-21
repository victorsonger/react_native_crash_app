import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";

import { images } from "@/constants";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { signIn, getCurrentUser } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";

export default function SignIn() {
  const { setUser, setIsLogged } = useGlobalContext();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setSubmitting] = useState(false);
  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }

    setSubmitting(true);

    try {
      await signIn(form.email, form.password);
      const result = await getCurrentUser();
      setUser(result);
      setIsLogged(true);

      Alert.alert("Success", "User signed in successfully");
      router.replace("/home");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[75vh] px-4 my-6">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[35px]"
          />

          <Text className="text-2xl text-white mt-10 font-psemibold">
            登录Aora
          </Text>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => {
              setForm({
                ...form,
                email: e,
              });
            }}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => {
              setForm({
                ...form,
                password: e,
              });
            }}
            otherStyles="mt-7"
          />

          <CustomButton
            title="登录"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              没有账号？
            </Text>
            <Link
              href={"/sign-up"}
              className="text-lg font-psemibold text-secondary-100"
            >
              注册
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
