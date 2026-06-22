import { window } from "@/constants/sizes";
import React from "react";
import {
  ListRenderItemInfo,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import Text from "./ui/Text";
import View from "./ui/View";

type SlideProps<T> = {
  data?: T[];
  renderItem: (info: ListRenderItemInfo<T>) => React.ReactElement;
  height?: number;
  autoPlayInterval?: number;
  style?: StyleProp<ViewStyle>;
  header?: string;
};

export function Slide<T>({
  data,
  renderItem,
  height = 258,
  autoPlayInterval = 4000,
  style,
  header,
}: SlideProps<T>) {
  const progress = useSharedValue<number>(0);

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <View>
      {header && <Text type="small">{header}</Text>}
      <Carousel
        autoPlayInterval={autoPlayInterval}
        width={window.width}
        height={height}
        data={data}
        loop={data.length > 1}
        enabled={data.length > 1}
        autoPlay={data.length > 1}
        pagingEnabled
        snapEnabled
        scrollAnimationDuration={600}
        style={StyleSheet.flatten([styles.carousel, { height }, style])}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: data?.length > 1 ? 0.94 : 0.96,
          parallaxScrollingOffset: 50,
        }}
        onProgressChange={(offsetProgress, absoluteProgress) => {
          progress.value = absoluteProgress;
        }}
        renderItem={({ item, index }) => (
          <View style={{ flex: 1, paddingHorizontal: 4 }} key={index}>
            {renderItem({
              item,
              index,
              separators: {
                highlight: () => undefined,
                unhighlight: () => undefined,
                updateProps: () => undefined,
              },
            })}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  carousel: {
    width: window.width,
  },
});
