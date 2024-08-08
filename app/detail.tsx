import React from "react";
import { View, Text, Button } from "react-native";
import { router, useNavigation, Link } from "expo-router";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "@/types";

type DetailsScreenRouteProp = RouteProp<RootStackParamList, "detail">;

export default function DetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute<DetailsScreenRouteProp>();
  const { itemId } = route.params;

  return (
    <View>
      <Text>Details Screen</Text>
      <Text>Item ID: {itemId}</Text>

      <Button title="Go sign-in" onPress={() => navigation.goBack()} />
    </View>
  );
}
