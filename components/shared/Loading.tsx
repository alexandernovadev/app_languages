import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, Text } from "react-native";

interface LoadingProps {
  text?: string;
  timeout?: number;
}

export const Loading = ({
  text = "Loading",
  timeout = 300,
}: LoadingProps) => {
  const [dots, setDots] = useState("");
  const dotsPatterns = ["", ".", "..", "..."];

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => {
        // Cycle through dotsPatterns array
        const currentIndex = dotsPatterns.indexOf(prevDots);
        const nextIndex = (currentIndex + 1) % dotsPatterns.length;
        return dotsPatterns[nextIndex];
      });
    }, timeout);

    return () => clearInterval(interval); 
  }, [dots]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" color="#1bcd2a" />
      <Text style={{ fontSize: 24, color: "#2eb12e", marginTop: 20 }}>
        {text} {dots}
      </Text>
    </View>
  );
};
