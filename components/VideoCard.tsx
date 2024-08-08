import { useState } from "react";
import { AVPlaybackStatusSuccess, ResizeMode, Video } from "expo-av";
import { View, Text, TouchableOpacity, Image, Platform } from "react-native";

import { Popover } from "@ant-design/react-native";
import { icons } from "../constants";

const Item = Popover.Item;

const VideoCard = ({ title, creator, avatar, thumbnail, video }) => {
  const [play, setPlay] = useState(false);

  const overlay = [1, 2, 3].map((i, index) => (
    <Item key={index} value={`option ${i}`}>
      <Text className="flex items-center space-x-2 cursor-pointer active:bg-gray-300 text-cyan-50 p-2 rounded-md">
        option {i}
      </Text>
    </Item>
  ));

  return (
    <View className="flex flex-col items-center px-4 mb-14">
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
        <View className="pt-2">
          <Popover
            overlay={overlay}
            onSelect={(v) => {
              console.log("点击了选项", v);
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
            // 这里教程中的视频资源没法播放（vimeo的视频可能是控制了权限）
            // 我们换成其他的
            source={{ uri: video }}
            className="w-full h-60 rounded-xl mt-3"
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls
            shouldPlay
            onPlaybackStatusUpdate={(status) => {
              console.log("onPlaybackStatusUpdate status", status);
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
    </View>
  );
};

export default VideoCard;
