import { useEffect, useState } from "react";
import { AVPlaybackStatusSuccess, ResizeMode, Video } from "expo-av";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
} from "react-native";
import { Popover } from "@ant-design/react-native";
import { icons } from "../constants";
import {
  bookmarkVideo,
  unbookmarkVideo,
  isVideoBookmarked,
} from "../lib/appwrite";
import { useGlobalContext } from "../context/GlobalProvider";

const Item = Popover.Item;

const VideoCard = ({
  id,
  title,
  creator,
  avatar,
  thumbnail,
  video
}) => {
  const [play, setPlay] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { user } = useGlobalContext();

  useEffect(() => {
    // 检查当前视频是否已被收藏
    if (user && id) {
      checkBookmarkStatus();
    }
  }, [user, id]);

  const checkBookmarkStatus = async () => {
    try {
      const result = await isVideoBookmarked(user.$id, id);
      setIsBookmarked(result);
    } catch (error) {
      console.error("Error checking bookmark status:", error);
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      Alert.alert("提示", "请先登录");
      return;
    }

    // 确保 id 存在
    if (!id) {
      console.error("Video ID is undefined");
      Alert.alert("错误", "视频ID无效");
      return;
    }

    console.log("Bookmarking video with ID:", id); // 添加日志

    try {
      if (isBookmarked) {
        await unbookmarkVideo(user.$id, id);
        setIsBookmarked(false);
      } else {
        await bookmarkVideo(user.$id, id);
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error("Bookmark operation failed:", error);
      Alert.alert("错误", "操作失败，请重试");
    }
  };

  const overlay = [
    <Item key="bookmark" value="bookmark">
      <Text className="text-cyan-50 p-2 rounded-md">
        {isBookmarked ? "取消收藏" : "收藏"}
      </Text>
    </Item>,
  ];

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      className="flex flex-col items-center px-4 mb-14"
    >
      <View className="flex flex-row gap-3 items-start">
        <View className="flex justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>

          <View className="flex justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="font-psemibold text-sm text-white"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {creator}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center">
          <TouchableOpacity onPress={handleBookmark} className="mr-4">
            <Image
              source={
                isBookmarked ? icons.bookmarkFilled : icons.bookmarkUnfilled
              }
              className="w-5 h-5"
              resizeMode="contain"
              tintColor={isBookmarked ? "#FFA001" : "#CDCDE0"}
            />
          </TouchableOpacity>

          <Popover
            overlay={overlay}
            onSelect={(v) => {
              if (v === "bookmark") {
                handleBookmark();
              }
            }}
            renderOverlayComponent={(nodes) => (
              <View className="bg-gray-800 text-white p-2">{nodes}</View>
            )}
          >
            <Image
              source={icons.menu}
              className="w-5 h-5"
              resizeMode="contain"
            />
          </Popover>
        </View>
      </View>

      {play ? (
        <>
          <Video
            source={{ uri: video }}
            className="w-full h-60 rounded-xl mt-3"
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls
            shouldPlay
            isMuted={false}
            progressUpdateIntervalMillis={1000}
            usePoster
            posterSource={{ uri: thumbnail }}
            posterStyle={{
              width: '100%',
              height: '100%',
              resizeMode: 'cover',
              borderRadius: 12,
            }}
            onLoad={() => {
              console.log('Video loaded successfully');
            }}
            onError={(error) => {
              console.log('Video loading error:', error);
            }}
            onPlaybackStatusUpdate={(status) => {
              if ((status as AVPlaybackStatusSuccess)?.didJustFinish) {
                setPlay(false);
              }
            }}
          />
        </>
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-60 rounded-xl mt-3 relative flex justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />

          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default VideoCard;
