import { Colors } from "@/constants/theme";
import React from "react";
import { StyleSheet } from "react-native";
import { Flow } from "react-native-animated-spinkit";
import View from "../View";

export function CardLoading() {
  return (
    <View style={styles.loadingContainer}>
      <Flow size={22} color={Colors.white} />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 0.3,
  },
});
