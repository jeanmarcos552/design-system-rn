import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import { ActivityIndicator, StyleSheet } from "react-native";

type LoadingProps = {
  mensage?: string;
};
export const CameraLoading = ({ mensage }: LoadingProps) => {
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          flexDirection: "row",
          backgroundColor: "rgba(0, 0, 0, 0.56)",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 999,
        },
      ]}
    >
      <ActivityIndicator size="small" color="#fff" />
      <Text type="small">{mensage}</Text>
    </View>
  );
};
