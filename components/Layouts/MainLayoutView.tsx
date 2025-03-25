import { View, type ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";

export type MainLayoutViewProps = ViewProps & {
  children?: React.ReactNode;
};

export function MainLayoutView({
  style,
  children,
  ...otherProps
}: MainLayoutViewProps) {
  const backgroundColor = Colors.black.black900;

  return (
    <SafeAreaView
      style={[
        { backgroundColor },
        { flex: 1 },
        style,
      ]}
      edges={["top", "bottom"]}
      {...otherProps}
    >
      <View
        style={{
          width: "100%",
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}
