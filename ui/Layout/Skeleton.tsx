import { Colors } from "@/constants/theme";
import { ColorsType } from "@/theme";
import React from "react";
import { StyleSheet } from "react-native";
import { Flow } from "react-native-animated-spinkit";
import View from "../View";

type SkeletonProps = {
  size?: number;
  color?: ColorsType;
};

export const Skeleton = ({ size = 22, color = "primary" }: SkeletonProps) => {
  return (
    <View style={styles.container}>
      <Flow size={size} color={Colors[color]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
  },
});
