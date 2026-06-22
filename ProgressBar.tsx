import { theme } from "@/theme";
import { Canvas, RoundedRect } from "@shopify/react-native-skia";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { LayoutChangeEvent, StyleProp, View, ViewStyle } from "react-native";
import {
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
} from "react-native-reanimated";

type ProgressBarProps = {
  progress: number; // 0 a 100
  height?: number;
  backgroundColor?: string;
  progressColor?: string;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  useThemeColors?: boolean; // Se true, usa cores do tema baseadas na porcentagem
};

function getProgressColor(progress: number): string {
  if (progress <= 30) {
    return theme.colors.warning;
  }
  if (progress <= 80) {
    return theme.colors.info;
  }
  return theme.colors.success;
}

export function ProgressBar({
  progress,
  height = 6,
  backgroundColor,
  progressColor,
  borderRadius = 3,
  style,
  useThemeColors = true,
}: ProgressBarProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [ready, setReady] = useState(false);
  const animatedProgress = useSharedValue(0);

  useFocusEffect(
    useCallback(() => {
      const timeout = setTimeout(() => setReady(true), 500);
      return () => {
        clearTimeout(timeout);
        setReady(false);
      };
    }, []),
  );

  useEffect(() => {
    if (!ready) return;
    animatedProgress.value = withDelay(
      200,
      withSpring(progress, {
        damping: 20,
        stiffness: 60,
        mass: 1,
      }),
    );
  }, [animatedProgress, progress, ready]);

  const progressWidth = useDerivedValue(() => {
    return (containerWidth * animatedProgress.value) / 100;
  });

  const bgColor = backgroundColor || theme.background.gray;

  const fillColor = useMemo(() => {
    if (progressColor) return progressColor;

    if (useThemeColors) return getProgressColor(progress);

    return theme.colors.info;
  }, [progressColor, useThemeColors, progress]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  return (
    <View style={[{ height }, style]} onLayout={handleLayout}>
      {containerWidth > 0 && (
        <Canvas style={{ flex: 1 }}>
          {/* Background bar */}
          <RoundedRect
            x={0}
            y={0}
            width={containerWidth}
            height={height}
            r={borderRadius}
            color={bgColor}
          />
          {/* Progress bar */}
          <RoundedRect
            x={0}
            y={0}
            width={progressWidth}
            height={height}
            r={borderRadius}
            color={fillColor}
          />
        </Canvas>
      )}
    </View>
  );
}
