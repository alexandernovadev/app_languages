import { Colors } from "@/constants/Colors";
import React, { useEffect, useRef, useState } from "react";
import { View, Animated, Easing, StyleSheet, LayoutChangeEvent } from "react-native";

const LoadingBar = () => {
  const progress = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    );
    animation.start();
    return () => animation.stop();
  }, [progress]);

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-containerWidth, containerWidth],
  });

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <Animated.View style={[styles.bar, { transform: [{ translateX }] }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "86%",
    height: 5,
    backgroundColor: Colors.gray.gray400,
    borderRadius: 4,
    overflow: "hidden",
    alignSelf: "center",
    marginTop: 4,
  },
  bar: {
    width: "100%",
    height: "100%",
    backgroundColor: Colors.green.green600,
  },
});

export default LoadingBar;
