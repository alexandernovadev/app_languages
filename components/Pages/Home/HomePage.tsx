import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ImageBackground,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";

import { useLectureStore } from "@/store/useLectureStore";
import { getTitle } from "@/utils/getTitleFromMD";
import { MainLayoutView } from "@/components/Layouts/MainLayoutView";
import { RootStackParamList } from "@/app/_layout";
import { Colors } from "@/constants/Colors";
import { triggerVibration } from "@/utils/vibrationHaptic";

export const HomePage = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { lectures, loading, fetchLectures, page, total } = useLectureStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchLectures();
  }, [fetchLectures]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchLectures(1).finally(() => setRefreshing(false));
  }, [fetchLectures]);

  const handleLoadMore = () => {
    if (lectures.length < total) fetchLectures(page + 1);
  };

  return (
    <MainLayoutView style={styles.container}>
      <View style={styles.searchFilterContainer}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color={Colors.white.white300}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search"
            placeholderTextColor={Colors.white.white500}
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons
            name="options-outline"
            size={24}
            color={Colors.white.white300}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={lectures}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.cardList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || loading}
            onRefresh={onRefresh}
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              triggerVibration("light");
              navigation.navigate("Details", { id: item._id });
            }}
          >
            <ImageBackground
              source={{ uri: item.img }}
              style={styles.imageContainer}
              resizeMode="cover"
            >
              <Text style={styles.languageIcon}>
                {item.language == "en" ? "🇺🇸" : "🇺🇸"}
              </Text>
            </ImageBackground>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{getTitle(item.content)}</Text>
              <View style={styles.infoContainer}>
                <View style={styles.iconContainer}>
                  <Ionicons
                    name="time-outline"
                    size={16}
                    color={Colors.white.white300}
                  />
                  <Text style={styles.infoText}>{item.time} min</Text>
                </View>
                <Text style={styles.levelBadge}>{item.level}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          lectures.length < total ? (
            <TouchableOpacity
              onPress={handleLoadMore}
              disabled={loading}
              style={styles.loadMoreButton}
            >
              <Text style={styles.loadMoreButtonText}>
                {loading ? "Loading..." : "Load more"}
              </Text>
            </TouchableOpacity>
          ) : null
        }
      />
    </MainLayoutView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black.black900,
    paddingTop: 8,
  },
  searchFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.black.black400,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: Colors.white.white300,
  },
  filterButton: {
    backgroundColor: Colors.black.black400,
    borderRadius: 8,
    padding: 8,
    marginLeft: 8,
  },
  loadMoreButton: {
    marginVertical: 16,
    backgroundColor: Colors.green.green700,
    padding: 8,
    borderRadius: 8,
  },
  loadMoreButtonText: {
    color: Colors.white.white400,
    textAlign: "center",
  },
  cardList: {
    paddingBottom: 16,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: Colors.black.black500,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    width: "48%",
  },
  imageContainer: {
    height: 120,
    backgroundColor: Colors.black.black400,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingLeft: 8,
  },
  languageIcon: {
    fontSize: 24,
  },
  cardContent: {
    padding: 8,
  },
  cardTitle: {
    color: Colors.white.white300,
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    color: Colors.white.white300,
    fontSize: 12,
    marginLeft: 4,
  },
  levelBadge: {
    color: Colors.blue.blue600,
    fontSize: 12,
    fontWeight: "600",
  },
});
