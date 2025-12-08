import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from "react-native";
import API_BASE_URL from "./config/api";

const PAIN_ITEMS = [
  { emoji: "🦒", label: "Stiff Neck" },
  { emoji: "👁", label: "Eye Strain" },
  { emoji: "🤕", label: "Headache" },
  { emoji: "💪", label: "Shoulder Pain" },
  { emoji: "🖐", label: "Wrist Pain" },

  { emoji: "🧘‍♂", label: "Lower Back" },
  { emoji: "😴", label: "Fatigue" },
  { emoji: "🦵", label: "Leg Cramps" },
  { emoji: "😵", label: "Dizziness" },
  { emoji: "😮‍💨", label: "Stress" },

  { emoji: "🥱", label: "Drowsiness" },
  { emoji: "🦴", label: "Joint Stiff" },
  { emoji: "⭐", label: "FREE" },
  { emoji: "🫁", label: "Shallow Breath" },
  { emoji: "😠", label: "Tension" },

  { emoji: "🧠", label: "Brain Fog" },
  { emoji: "👀", label: "Dry Eyes" },
  { emoji: "🔥", label: "Numbness" },
  { emoji: "😰", label: "Anxiety" },
  { emoji: "🔥", label: "Burning Eyes" },

  { emoji: "💤", label: "Low Energy" },
  { emoji: "🦷", label: "Jaw Tension" },
  { emoji: "❤‍🔥", label: "Racing Heart" },
  { emoji: "🧊", label: "Cold Hands" },
  { emoji: "🥵", label: "Exhausted" },
];

const FREE_INDEX = 12;

const LINES = [
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],

  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],

  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20],
];

export default function PainBingoScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const userEmail = route.params?.userEmail || '';
  const [selectedCells, setSelectedCells] = useState([FREE_INDEX]);
  const [showModal, setShowModal] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [loadingStreak, setLoadingStreak] = useState(true);

  useEffect(() => {
    fetchUserStreak();
  }, [userEmail]);

  const fetchUserStreak = async () => {
    if (!userEmail) {
      setLoadingStreak(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/profile/${userEmail}`);
      
      if (!response.ok) {
        console.warn('Failed to fetch user profile:', response.status);
        setLoadingStreak(false);
        return;
      }
      
      const data = await response.json();
      
      if (data && data.user) {
        const streak = data.user.streakCount || 0;
        setStreakCount(streak);
      }
    } catch (error) {
      console.error('Error fetching user streak:', error);
    } finally {
      setLoadingStreak(false);
    }
  };

  const checkBingo = (cells) => {
    return LINES.some((line) => line.every((i) => cells.includes(i)));
  };

  const handlePress = (index) => {
    let newArray;

    if (selectedCells.includes(index)) {
      newArray = selectedCells.filter((i) => i !== index);
    } else {
      newArray = [...selectedCells, index];
    }

    setSelectedCells(newArray);

    if (!selectedCells.includes(index)) {
      if (checkBingo([...newArray])) {
        setShowModal(true);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* HEADER */}
        <View style={styles.header1}>
          <TouchableOpacity onPress={() => navigation.navigate("HomeScreen", { userEmail: userEmail })}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <View style={styles.header}>
          <TouchableOpacity style={styles.dailyButton}>
            <Text style={styles.dailyButtonText}>✨ Daily Challenge</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Pain Bingo</Text>
          <Text style={styles.subtitle}>
            Track your discomfort & earn wellness rewards!
          </Text>
        </View>

        {/* WHITE CARD */}
        <View style={styles.cardWrapper}>
          <Text style={styles.cardTitle}>Today's Card</Text>
          <Text style={styles.cardSubtitle}>
            {selectedCells.length - 1} pains selected • 0 bingos
          </Text>

          {/* GRID */}
          <View style={styles.grid}>
            {PAIN_ITEMS.map((item, index) => {
              const isSelected = selectedCells.includes(index);
              const isFree = index === FREE_INDEX;

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handlePress(index)}
                  style={[
                    styles.cell,
                    isSelected && !isFree && styles.cellSelected,
                    isFree && styles.freeCell,
                  ]}
                >
                  <Text style={styles.emoji}>{item.emoji}</Text>
                  <Text style={styles.cellLabel}>{item.label}</Text>

                  {isSelected && !isFree && (
                    <View style={styles.checkMark}>
                      <Text style={{ color: "#fff", fontWeight: "bold" }}>
                        ✓
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* PROGRESS BAR FIXED */}
          <Text style={styles.progressText}>Progress to next Bingo</Text>

          <View style={styles.progressBarBackground}>
            <View style={styles.progressBarFill} />
          </View>

          <Text style={styles.progressCount}>2/5</Text>
        </View>

        {/* STREAK CARD */}
        <View style={styles.streakCard}>
          <Text style={styles.sectionTitle}>🔥 Current Streak</Text>
          {loadingStreak ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.streakNumber}>
              {streakCount} {streakCount === 1 ? 'day' : 'days'}
            </Text>
          )}

          <Text style={styles.sectionTitleSmall}>🏆 Total Bingos</Text>
          <Text style={styles.streakNumber}>0</Text>
        </View>

        {/* HOW TO PLAY */}
        <View style={styles.howToPlayCard}>
          <Text style={styles.sectionTitle}>How to Play</Text>

          <Text style={styles.step}>
            <Text style={styles.stepNumber}>1 </Text>
            Click on pain/discomfort you're feeling today
          </Text>

          <Text style={styles.step}>
            <Text style={styles.stepNumber}>2 </Text>
            Complete a row, column, or diagonal for BINGO!
          </Text>

          <Text style={styles.step}>
            <Text style={styles.stepNumber}>3 </Text>
            Earn wellness rewards & build your streak
          </Text>
        </View>
      </ScrollView>

      {/* MODAL */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>🎉 BINGO! 🎉</Text>
            <Text style={styles.modalSubtitle}>You completed 1 line!</Text>

            {/* Rewards */}
            <View style={styles.rewardBox}>
              <Text style={styles.rewardTitle}>Walk Time</Text>
              <Text style={styles.rewardText}>
                5-minute walk around the office
              </Text>
            </View>

            <View style={[styles.rewardBox, { backgroundColor: "#6366F1" }]}>
              <Text style={styles.rewardTitle}>Self Massage</Text>
              <Text style={styles.rewardText}>
                2-minute neck and shoulder rub
              </Text>
            </View>

            <View style={styles.tipBox}>
              <Text style={styles.tipTitle}>✨ Wellness Tip</Text>
              <Text style={styles.tipText}>
                Regular movement prevents tension buildup. Keep going!
              </Text>
            </View>

            <TouchableOpacity
              style={styles.claimButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.claimText}>Claim Rewards & Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F6FF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header1: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  header: {
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 16,
  },
  dailyButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 10,
  },
  dailyButtonText: { color: "#fff", fontWeight: "bold" },

  title: { fontSize: 32, fontWeight: "bold", color: "#111" },
  subtitle: { fontSize: 14, color: "#607D8B", marginTop: 6 },

  cardWrapper: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 25,
    padding: 20,
    elevation: 4,
  },

  cardTitle: { fontSize: 20, fontWeight: "700" },
  cardSubtitle: { color: "#64748B", marginBottom: 10 },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 30,
  },

  cell: {
    width: "18%",
    aspectRatio: 1,
    backgroundColor: "#EEF2FF",
    borderRadius: 16,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#CBD5E1",
  },
  cellSelected: {
    backgroundColor: "#3B82F6",
    borderColor: "#60A5FA",
  },
  freeCell: {
    backgroundColor: "#34D399",
    borderColor: "#10B981",
  },

  emoji: { fontSize: 24 },
  cellLabel: {
    marginTop: 6,
    fontSize: 12,
    textAlign: "center",
  },

  checkMark: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "#2563EB",
    padding: 4,
    borderRadius: 50,
  },

  progressText: { 
    marginTop: 50, 
    fontSize: 12, 
    color: "#555",
    marginBottom: 8,
  },

  progressBarBackground: {
    width: "100%",
    height: 8,
    backgroundColor: "#E0E7FF",
    borderRadius: 14,
    marginTop: 20,
    marginBottom: 20,
  },

  progressBarFill: {
    width: "40%",
    height: 8,
    backgroundColor: "#3B82F6",
    borderRadius: 10,
  },

  progressCount: {
    alignSelf: "flex-end",
    marginTop: 8,
    fontWeight: "700",
    color: "#3B82F6",
  },

  streakCard: {
    backgroundColor: "#2563EB",
    marginHorizontal: 16,
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
  },

  sectionTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  sectionTitleSmall: { color: "#fff", marginTop: 20 },

  streakNumber: { fontSize: 32, fontWeight: "bold", color: "#fff" },

  howToPlayCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 20,
    padding: 20,
    borderRadius: 20,
    elevation: 4,
  },

  step: { marginTop: 12, fontSize: 14, color: "#444" },

  stepNumber: {
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    color: "#3B82F6",
    marginRight: 6,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalCard: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
  },

  modalTitle: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    color: "#2563EB",
  },
  modalSubtitle: {
    textAlign: "center",
    marginTop: 4,
    marginBottom: 20,
    color: "#555",
    fontSize: 16,
  },

  rewardBox: {
    backgroundColor: "#34D399",
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
  },

  rewardTitle: { color: "#fff", fontWeight: "700", fontSize: 18 },
  rewardText: { color: "#fff", fontSize: 14, marginTop: 2 },

  tipBox: {
    borderWidth: 1,
    borderColor: "#3B82F6",
    padding: 14,
    borderRadius: 14,
    marginTop: 10,
  },
  tipTitle: { color: "#3B82F6", fontWeight: "700", marginBottom: 6 },
  tipText: { color: "#444", lineHeight: 18 },

  claimButton: {
    backgroundColor: "#2563EB",
    padding: 14,
    marginTop: 20,
    borderRadius: 12,
  },
  claimText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
  },
});