import React, { useEffect } from "react";
import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import DetailsScreen from "@/app/detail";
import GlobalProvider from "@/context/GlobalProvider";

const StackScreenOption = {
  headerShown: false,
};

const linking = {
  prifixes: [],
  config: {
    screens: {
      home: "home",
      detail: "detail/:itemId",
    },
  },
};

// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
    // 加载ant字体：https://rn.mobile.ant.design/docs/react/introduce-cn
    antoutline: require("@ant-design/icons-react-native/fonts/antoutline.ttf"),
    antfill: require("@ant-design/icons-react-native/fonts/antfill.ttf"),
  });

  useEffect(() => {
    if (error) {
      throw error;
    }
    if (fontsLoaded) {
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) return error;

  return (
    <GlobalProvider>
      <Stack>
        <Stack.Screen name="index" options={StackScreenOption} />
        <Stack.Screen name="(auth)" options={StackScreenOption} />
        <Stack.Screen name="(tabs)" options={StackScreenOption} />
        {/* <Stack.Screen name="/search/[query]" options={StackScreenOption} /> */}
      </Stack>
    </GlobalProvider>
  );
}
