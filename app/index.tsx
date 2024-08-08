import { Text, Button, View, Image, ScrollView } from "react-native";
import { Redirect, router } from "expo-router";
import { RootStackParamList } from "@/types";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import CustomButton from "@/components/CustomButton";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { useGlobalContext } from "@/context/GlobalProvider";
import Loader from "@/components/Loader";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "home"
>;

export default function Index() {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/home" />;

  // const navigation = useNavigation<HomeScreenNavigationProp>();
  return (
    // 直接使用className会收到ts的报错
    // 因为RN组件默认不支持className
    // 所以我们要在项目根目录建一个global.d.ts来写入
    <SafeAreaView className="h-full bg-primary">
      <Loader isLoading={loading} />

      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="w-full flex justify-center items-center min-h-[85vh] px-4">
          <Image
            source={images.logo}
            className="w-[130px] h-[84px]"
            resizeMode="contain"
          />
          <Image
            source={images.cards}
            className="max-w-[380px] w-full h-[300px]"
            resizeMode="contain"
          />

          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              发现无限可能 就在
              <Text className="text-secondary-200">Aora</Text>
            </Text>

            <Image
              source={images.path}
              className="w-[136px] h=[15px] absolute -bottom-6 -right-8"
              resizeMode="contain"
            ></Image>
          </View>
          <Text className="text-sm font-pregular text-gray-100 mt-7 text-clip">
            创意与创新相遇，与 Aoras 一起踏上无限探索之旅
          </Text>

          <CustomButton
            title="使用邮件注册"
            handlePress={() => {
              console.log("点击按钮");
              router.push("/sign-in");
            }}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>

      {/* 由于我们的页面背景是dark，为了防止用户看不到顶部状态栏信息，我们这里加一个组件，文字是浅色 */}
      {/* 注意 backgroundColor这个属性只有安卓有用
      ios上是强限制和背景色一样（保持沉浸） */}
      <StatusBar style="light" backgroundColor="#161622" />
    </SafeAreaView>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#fff",
//   },
//   link: {
//     color: "blue",
//   },
// });
