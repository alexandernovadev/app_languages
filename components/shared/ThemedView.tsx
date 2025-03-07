import { View, type ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ScrollView } from "react-native";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  children?: React.ReactNode;
};

export function ThemedView({
  style,
  lightColor,
  children,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );
  // Aui el bg negro
    console.log("backgroundColor ",backgroundColor);

  return (
    <SafeAreaView
      style={[
        { backgroundColor },
        { flex: 1 },
        { paddingLeft: 16, paddingRight: 16 },
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
