import { View, Text, FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useCallback, useState, useEffect } from "react";
import { getUserBookmarks } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";
import VideoCard from "@/components/VideoCard";
import EmptyState from "@/components/EmptyState";
import { router, usePathname } from "expo-router";
import useAppwrite from "@/lib/useAppwrite";
import { IVideoItem } from "@/types/response";

const Bookmark = () => {
  const { user } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);
  
  // 使用 useAppwrite 替代直接调用 API
  const { data: bookmarkedVideos, refetch } = useAppwrite<IVideoItem>(
    () => user ? getUserBookmarks(user.$id) : Promise.resolve([])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const pathname = usePathname();
  useEffect(() => {
    console.log("pathname---", pathname);
    if (pathname === "/bookmark") {
      onRefresh();
    }
  }, [pathname]);


  return (
    <SafeAreaView className="px-4 bg-primary h-full">
      <Text className="text-2xl text-white font-psemibold mb-6">我的收藏</Text>

      {!user ? (
        <EmptyState title="请先登录" subtitle="登录后可查看收藏的视频" />
      ) : (
        <FlatList
          data={bookmarkedVideos}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <VideoCard
              id={item.$id}
              title={item.title}
              thumbnail={item.thumbnail}
              video={item.video}
              creator={item.users?.username}
              avatar={item.users?.avatar}
            />
          )}
          ListEmptyComponent={() => (
            <EmptyState title="暂无收藏" subtitle="你还没有收藏任何视频" />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default Bookmark;
