import React, { useRef, useCallback } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
} from "react-native";
import { SidePanelModalWord } from "../Pages/Details/SidePanelModalWord";

interface PropsModalDragger {
  wordSelected: string;
  isModalVisible: boolean;
  setModalVisible: (value: boolean) => void;
}

const { height } = Dimensions.get("window");

export const ModalDragger = ({
  setModalVisible,
  isModalVisible,
  wordSelected,
}: PropsModalDragger) => {
  // Animación para el modal
  const slideAnim = useRef(new Animated.Value(0)).current;

  // PanResponder para manejar el gesto de arrastre
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

  const openModal = useCallback(() => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  const closeModal = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  }, [slideAnim]);

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
        <SidePanelModalWord
          isVisible={isModalVisible}
          wordSelected={wordSelected}
        />
      </Animated.View>
    </View>
  );
};
const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    left: 0,
    right: 0,
    height: "88%",
    backgroundColor: "#333",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
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
    backgroundColor: "rgba(0, 0, 0, 0.3)",
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