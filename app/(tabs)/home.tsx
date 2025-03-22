import {
  View,
  Text,
  Image,
  FlatList,
  RefreshControl,
  Alert,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "@/components/SearchInput";
import VideoCard from "@/components/VideoCard";
import { images } from "@/constants";
import { IVideoItem } from "@/types/response";
import Trending from "@/components/Trending";
import EmptyState from "@/components/EmptyState";
import { getAllPosts, getLatestPosts } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import { usePathname } from "expo-router";

const posts: IVideoItem[] = [
  // {
  //   ["$id"]: 1,
  // },
  // {
  //   ["$id"]: 2,
  // },
  // {
  //   ["$id"]: 3,
  // },
];
export default function Home() {
  const { data: posts, refetch } = useAppwrite<IVideoItem>(getAllPosts);
  const { data: latestPosts } = useAppwrite<IVideoItem>(getLatestPosts);
  const [refreshing, setRefreshing] = useState(false);

  // 简化刷新逻辑
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  // 使用 useEffect 替代 useFocusEffect （但是这样就没法在每次从其他tab切换回home时，执行对应的事件了，就无法在create tab上传完新视频后回到home直接刷新了）
  // useEffect(() => {
  //   onRefresh();
  // }, []);

  // 下面是替代方案，通过监听路由变化，当路径为/home时，执行刷新逻辑
  const pathname = usePathname();
  useEffect(() => {
    console.log('pathname---', pathname);
    if (pathname === '/home') {
      onRefresh();
    }
  }, [pathname]);
  return (
    <SafeAreaView className="bg-primary">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }: { item: IVideoItem }) => (
          <VideoCard
            key={item.$id}
            id={item.$id}
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            creator={item.users?.username}
            avatar={item.users?.avatar}
          />
        )}
        ListHeaderComponent={() => (
          <View className="flex my-6 px-4 space-y-6">
            <View className="flex justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome Back
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  JSMastery
                </Text>
              </View>

              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>

            <SearchInput />

            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-lg font-pregular text-gray-100 mb-3">
                Latest Videos
              </Text>

              <Trending posts={latestPosts ?? []} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos created yet"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
}
