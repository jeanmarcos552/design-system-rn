import { theme } from "@/theme";
import React from "react";
import { RefreshControl, ScrollView, ScrollViewProps } from "react-native";
import { Separator } from "./Separator";

export type RootScrollProps = ScrollViewProps & {
  isRefetching?: boolean;
  refetch?: () => void;
  gap?: number;
  listHeaderComponent?: React.ReactNode;
};

export const RootScroll: React.FC<RootScrollProps> = ({
  children,
  contentContainerStyle,
  isRefetching = false,
  refetch = () => {},
  gap = 6,
  listHeaderComponent,
  ...rest
}) => {
  return (
    <ScrollView
      contentContainerStyle={[contentContainerStyle]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          tintColor={theme.colors.primary}
          refreshing={isRefetching}
          onRefresh={refetch}
        />
      }
      {...rest}
    >
      {listHeaderComponent ?? listHeaderComponent}
      {children}
      <Separator />
    </ScrollView>
  );
};
