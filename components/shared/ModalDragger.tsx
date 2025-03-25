import React, { useRef, useCallback, useEffect } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useWordStore } from "@/store/useWordStore";
import { triggerVibration } from "@/utils/vibrationHaptic";

interface PropsModalDragger {
  children?: React.ReactNode;
  isModalVisible: boolean;
  setModalVisible: (value: boolean) => void;
}

const { height } = Dimensions.get("window");

export const ModalDragger = ({
  setModalVisible,
  isModalVisible,
  children,
}: PropsModalDragger) => {
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (isModalVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      triggerVibration("rapidFire");
    }

    return () => {
      triggerVibration("rapidFire");
    };
  }, [isModalVisible]);

  // PanResponder to handle the drag
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        const newValue = Math.max(0, gestureState.dy);
        slideAnim.setValue(newValue);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 150) {
          closeModal();
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const closeModal = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  }, [slideAnim]);

  if (!isModalVisible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.overlayBackground} />
      </TouchableWithoutFeedback>
      <Animated.View
        style={[
          styles.modal,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View
          {...panResponder.panHandlers}
          style={{ width: "100%", paddingVertical: 4 }}
        >
          <View style={styles.modalHandle} />
        </View>
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    left: 0,
    right: 0,
    height: "92%",
    backgroundColor: Colors.black.black800,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    bottom: 0,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
  },
  overlayBackground: {
    flex: 1,
    backgroundColor: Colors.translucentBlack.black90,
  },
  modalHandle: {
    width: 60,
    height: 5,
    backgroundColor: "gray",
    alignSelf: "center",
    borderRadius: 3,
    marginVertical: 10,
  },
});
