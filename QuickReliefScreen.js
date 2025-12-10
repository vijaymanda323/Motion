import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Video, ResizeMode } from "expo-av";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// RELIEF_ROUTINES - Universal for all users
// All users see the same routines and videos (not user-specific)
// Videos are stored in Cloudinary and accessible to everyone
const RELIEF_ROUTINES = [
  { 
    id: 1, 
    name: "Cat Cow", 
    target: "Spine", 
    duration: "45s",
    videoUrl: "https://res.cloudinary.com/dldeaeegm/video/upload/v1765388578/motion-videos/motion-videos/693507cc482f85d091f81451/1765388570447_cat-cow-pose.mp4"
  },
  { id: 2, name: "Giraffe Stretch", target: "Neck", duration: "30s" },
  { 
    id: 3, 
    name: "Wrist Flexor", 
    target: "Arms", 
    duration: "30s",
    videoUrl: "https://res.cloudinary.com/dldeaeegm/video/upload/v1765389188/wrist_bi6f8r.mp4"
  },
  { id: 4, name: "Seated Twist", target: "Back", duration: "45s",videoUrl: "https://res.cloudinary.com/dldeaeegm/video/upload/v1765389452/Seated_twist_mekmhi.mp4" },
  { id: 5, name: "Hamstring Reach", target: "Legs", duration: "60s",videoUrl:"https://res.cloudinary.com/dldeaeegm/video/upload/v1765389309/hamstring_zfrwmq.mp4" },
  { id: 6, name: "Shoulder Rolls", target: "Shoulders", duration: "30s",videoUrl:"https://res.cloudinary.com/dldeaeegm/video/upload/v1765389394/shoulder_b8tsme.mp4" },
  { id: 7, name: "Chin Tucks", target: "Neck", duration: "30s" ,videoUrl:"https://res.cloudinary.com/dldeaeegm/video/upload/v1765389270/chin_pgnkmr.mp4"},
  { id: 8, name: "Calf Raises", target: "Legs", duration: "45s",videoUrl:"https://res.cloudinary.com/dldeaeegm/video/upload/v1765390654/door_by6ffs.mp4" },
  { id: 9, name: "Doorway Stretch", target: "Chest", duration: "30s",videoUrl:"https://res.cloudinary.com/dldeaeegm/video/upload/v1765390562/Girafee_xyowf1.mp4" },
  { id: 10, name: "Deep Squat", target: "Legs", duration: "45s",videoUrl:"https://res.cloudinary.com/dldeaeegm/video/upload/v1765389353/deep_squat_ncccb4.mp4"},
];

const QuickReliefScreen = () => {
  const navigation = useNavigation();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const handleRoutinePress = (item) => {
    if (item.videoUrl) {
      setSelectedVideo({
        url: item.videoUrl,
        title: item.name
      });
      setShowVideoModal(true);
    }
  };

  const renderRoutineItem = (item) => (
    <TouchableOpacity 
      key={item.id} 
      style={styles.card} 
      activeOpacity={0.7}
      onPress={() => handleRoutinePress(item)}
      disabled={!item.videoUrl}
    >
      {/* Number Badge */}
      <View style={styles.numberBadge}>
        <Text style={styles.numberText}>{item.id}</Text>
      </View>

      {/* Text Section */}
      <View style={styles.textBox}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.sub}>{item.target} • {item.duration}</Text>
        {!item.videoUrl && (
          <Text style={styles.comingSoonText}>Video coming soon</Text>
        )}
      </View>

      {/* Play Icon */}
      <Ionicons 
        name={item.videoUrl ? "play-circle" : "play-outline"} 
        size={22} 
        color={item.videoUrl ? "#00d4a6" : "#8e9aab"} 
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="#1a1a1a" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* Titles */}
        <Text style={styles.title}>Quick Relief</Text>
        <Text style={styles.subtitle}>Verified physio routines.</Text>

        {/* List */}
        <View style={styles.list}>{RELIEF_ROUTINES.map(renderRoutineItem)}</View>
      </ScrollView>

      {/* Video Player Modal */}
      <Modal
        visible={showVideoModal}
        animationType="slide"
        onRequestClose={() => {
          setShowVideoModal(false);
          setSelectedVideo(null);
        }}
      >
        <View style={styles.videoModalContainer}>
          <View style={styles.videoHeader}>
            <TouchableOpacity
              onPress={() => {
                setShowVideoModal(false);
                setSelectedVideo(null);
              }}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
            {selectedVideo && (
              <Text style={styles.videoTitle} numberOfLines={1}>
                {selectedVideo.title || "Video"}
              </Text>
            )}
          </View>
          
          {selectedVideo && (
            <Video
              source={{
                uri: selectedVideo.url,
              }}
              style={styles.videoPlayer}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay
              isLooping={false}
            />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7f9fc",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },

  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1a1a1a",
    marginTop: 15,
  },

  subtitle: {
    marginTop: 4,
    fontSize: 15,
    color: "#7c8696",
    marginBottom: 25,
  },

  list: {
    marginTop: 5,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 18,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },

  numberBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(0,255,200,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },

  numberText: {
    color: "#00d4a6",
    fontWeight: "700",
    fontSize: 16,
  },

  textBox: {
    flex: 1,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
  },

  sub: {
    marginTop: 2,
    fontSize: 13,
    color: "#8e9aab",
  },
  comingSoonText: {
    marginTop: 4,
    fontSize: 11,
    color: "#8e9aab",
    fontStyle: "italic",
  },
  videoModalContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  videoHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  videoTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  videoPlayer: {
    flex: 1,
    width: SCREEN_WIDTH,
    backgroundColor: "#000",
  },
});

export default QuickReliefScreen;
