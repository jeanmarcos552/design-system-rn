import { theme } from "@/theme";
import { HeaderBackButton } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View } from "react-native";
import Flex from "../Flex";
import Text from "../Text";

type HeaderProps = {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string | React.ReactNode;
  callback?: () => void;
};
export function Header({ title, subtitle, children, callback }: HeaderProps) {
  const navigation = useNavigation();

  if (children) {
    return (
      <View style={styles.titulo}>
        <View style={styles.header}>
          <HeaderBackButton
            onPress={() => {
              if (callback) {
                callback();
              } else {
                navigation.goBack();
              }
            }}
            tintColor={theme.colors.white}
          />
          <Flex flex={1}>
            {title && <Text type="titulo">{title}</Text>}
            {subtitle &&
              (typeof subtitle === "string" ? (
                <Text type="small" color="gray">
                  {subtitle}
                </Text>
              ) : (
                subtitle
              ))}
          </Flex>
        </View>
        {children && children}
      </View>
    );
  }

  return (
    <View style={styles.header}>
      <HeaderBackButton
        onPress={() => {
          if (callback) {
            callback();
          } else {
            navigation.goBack();
          }
        }}
        tintColor={theme.colors.white}
      />
      <Flex flex={1}>
        {title && <Text type="titulo">{title}</Text>}
        {subtitle &&
          (typeof subtitle === "string" ? (
            <Text type="small" color="gray">
              {subtitle}
            </Text>
          ) : (
            subtitle
          ))}
      </Flex>
    </View>
  );
}

const styles = StyleSheet.create({
  titulo: {
    marginBottom: 18,
    gap: 18,
  },
  botoes: {
    justifyContent: "center",
    gap: 18,
    flexDirection: "row",
  },
  header: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 12,
  },
});
