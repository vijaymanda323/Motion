import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import Slider from "@react-native-community/slider";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
} from "react-native";

// ============================================================================
// BINGO CARD DATA
// ============================================================================

// 25 pain/discomfort items for the 5x5 Bingo card
const PAIN_ITEMS = [
  { emoji: "🦒", label: "Neck Stiffness" },
  { emoji: "👁", label: "Dry Eyes" },
  { emoji: "🤕", label: "Wrist Pain" },
  { emoji: "💪", label: "Shoulder Ache" },
  { emoji: "🖐", label: "Tension Headache" },
  { emoji: "🧘‍♂", label: "Lower Back Pain" },
  { emoji: "😴", label: "Slouching Posture" },
  { emoji: "🦵", label: "Eye Strain" },
  { emoji: "😵", label: "Stiff Fingers" },
  { emoji: "😮‍💨", label: "Tight Hamstrings" },
  { emoji: "🥱", label: "Tech Neck" },
  { emoji: "🦴", label: "Fatigue" },
  { emoji: "⭐", label: "Limited Rotation" },
  { emoji: "🫁", label: "Sore Wrists" },
  { emoji: "😠", label: "Back Knots" },
  { emoji: "🧠", label: "Brain Fog" },
  { emoji: "👀", label: "Dry Eyes (Severe)" },
  { emoji: "🔥", label: "Numbness" },
  { emoji: "😰", label: "Anxiety" },
  { emoji: "🔥", label: "Burning Eyes" },
  { emoji: "💤", label: "Low Energy" },
  { emoji: "🦷", label: "Jaw Tension" },
  { emoji: "❤‍🔥", label: "Racing Heart" },
  { emoji: "🧊", label: "Cold Hands" },
  { emoji: "🥵", label: "Exhaustion" },
];

// BINGO header letters
const BINGO_LETTERS = ["B", "I", "N", "G", "O"];

// ============================================================================
// BINGO LINE DEFINITIONS (12 total: 5 rows, 5 columns, 2 diagonals)
// ============================================================================

const BINGO_LINES = {
  // Rows (0-4)
  row0: [0, 1, 2, 3, 4],      // Top row
  row1: [5, 6, 7, 8, 9],      // Second row
  row2: [10, 11, 12, 13, 14], // Middle row
  row3: [15, 16, 17, 18, 19], // Fourth row
  row4: [20, 21, 22, 23, 24], // Bottom row
  
  // Columns (5-9)
  col0: [0, 5, 10, 15, 20],   // B column
  col1: [1, 6, 11, 16, 21],   // I column
  col2: [2, 7, 12, 17, 22],   // N column
  col3: [3, 8, 13, 18, 23],   // G column
  col4: [4, 9, 14, 19, 24],   // O column
  
  // Diagonals (10-11)
  diag1: [0, 6, 12, 18, 24],  // Top-left to bottom-right
  diag2: [4, 8, 12, 16, 20],  // Top-right to bottom-left
};

// Convert to array format for easier iteration
const BINGO_LINES_ARRAY = Object.values(BINGO_LINES);
const BINGO_LINE_KEYS = Object.keys(BINGO_LINES);

// ============================================================================
// EXERCISE ROUTINES (mapped to each Bingo line)
// ============================================================================

const EXERCISE_ROUTINES = {
  row0: {
    title: "Neck, Shoulders & Upper Body 🦒💪",
    exercises: [
      "🦒 Neck rolls (10 each direction)",
      "💪 Shoulder shrugs (15 reps)",
      "✋ Wrist circles (20 each direction)",
      "🖐 Head tilt stretches (hold 30s each)",
    ],
    duration: "5-7 minutes",
  },
  row1: {
    title: "Posture & Spine Alignment 🧍",
    exercises: [
      "🧘‍♂ Cat-cow stretch (10 reps)",
      "📐 Posture reset (hold 1 minute)",
      "🔄 Spinal twists (10 each side)",
      "🧍 Wall angels (15 reps)",
    ],
    duration: "6-8 minutes",
  },
  row2: {
    title: "Eyes & Mid-Back Relief 👀",
    exercises: [
      "👀 20-20-20 rule (look 20ft away for 20s)",
      "🔄 Thoracic rotation (10 each side)",
      "👁️ Eye palming (2 minutes)",
      "🦵 Seated back extension (10 reps)",
    ],
    duration: "5-6 minutes",
  },
  row3: {
    title: "Arms, Legs & Circulation 🦵",
    exercises: [
      "✋ Forearm stretch (30s each arm)",
      "🦵 Quad stretch (30s each leg)",
      "🦴 Calf raises (15 reps)",
      "💪 Arm circles (20 each direction)",
    ],
    duration: "6-7 minutes",
  },
  row4: {
    title: "Hips, Energy & Full Body 🦿",
    exercises: [
      "🦿 Hamstring stretch (30s each leg)",
      "🧍 Hip flexor stretch (30s each side)",
      "💤 Deep breathing (2 minutes)",
      "🦵 Leg swings (10 each leg)",
    ],
    duration: "7-8 minutes",
  },
  col0: {
    title: "Upper Body Flow 🌊",
    exercises: [
      "🦒 Neck mobility sequence",
      "🧘‍♂ Upper back release",
      "🥱 Shoulder blade squeezes",
      "🧠 Mindful breathing",
    ],
    duration: "6-8 minutes",
  },
  col1: {
    title: "Eye & Vision Care 👁️",
    exercises: [
      "👁️ Eye exercises (focus shifts)",
      "🦵 Blinking routine (20 reps)",
      "⭐ Distance gazing (2 minutes)",
      "😰 Eye massage (gentle, 1 minute)",
    ],
    duration: "5-6 minutes",
  },
  col2: {
    title: "Wrist & Hand Health ✋",
    exercises: [
      "🤕 Wrist flexor stretch",
      "😵 Finger extensions",
      "⭐ Wrist circles & waves",
      "🔥 Hand shake release",
    ],
    duration: "4-5 minutes",
  },
  col3: {
    title: "Shoulder & Back Relief 💪",
    exercises: [
      "💪 Shoulder rolls (forward & back)",
      "😮‍💨 Doorway chest stretch",
      "😠 Upper back release",
      "❤‍🔥 Shoulder blade mobility",
    ],
    duration: "6-7 minutes",
  },
  col4: {
    title: "Head & Neck Tension Release 🖐",
    exercises: [
      "🖐 Scalp massage (2 minutes)",
      "😮‍💨 Jaw release exercises",
      "🔥 Neck side stretches",
      "💤 Relaxation breathing",
    ],
    duration: "5-6 minutes",
  },
  diag1: {
    title: "Full Body Energizer ⚡",
    exercises: [
      "🦒 Full neck sequence",
      "🦵 Standing leg swings",
      "⭐ Core activation",
      "💤 Energy boost breathing",
    ],
    duration: "7-9 minutes",
  },
  diag2: {
    title: "Complete Recovery Flow 🧘",
    exercises: [
      "🖐 Head to toe stretch",
      "🦵 Full body mobility",
      "⭐ Balance & coordination",
      "💤 Restorative breathing",
    ],
    duration: "8-10 minutes",
  },
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function PainBingoScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const userEmail = route.params?.userEmail || "";

  // Game state
  const [selectedCells, setSelectedCells] = useState([]);
  const [completedLines, setCompletedLines] = useState(new Set()); // Track completed Bingo lines
  const [winningLine, setWinningLine] = useState(null); // Currently winning line for highlighting
  
  // Modal states
  const [activeRoutine, setActiveRoutine] = useState(null);
  const [showPreCheck, setShowPreCheck] = useState(false);
  const [showExercise, setShowExercise] = useState(false);
  const [showPostCheck, setShowPostCheck] = useState(false);
  
  // Pain tracking
  const [prePain, setPrePain] = useState(5);
  const [postPain, setPostPain] = useState(5);
  
  // Gamification
  const [totalXP, setTotalXP] = useState(0);
  const [bingoCount, setBingoCount] = useState(0);

  // ============================================================================
  // BINGO DETECTION LOGIC
  // ============================================================================
  
  /**
   * Checks if a Bingo line is complete (all 5 cells selected)
   * Returns the line key if complete, null otherwise
   */
  const checkBingoLine = (cells, lineIndices, lineKey) => {
    const isComplete = lineIndices.every((idx) => cells.includes(idx));
    return isComplete ? lineKey : null;
  };

  /**
   * Detects all completed Bingo lines from current selection
   * Returns array of line keys that are newly completed
   */
  const detectBingoWins = (cells) => {
    const newWins = [];
    
    BINGO_LINE_KEYS.forEach((lineKey) => {
      // Skip if this line was already completed
      if (completedLines.has(lineKey)) {
        return;
      }
      
      const lineIndices = BINGO_LINES[lineKey];
      if (checkBingoLine(cells, lineIndices, lineKey)) {
        newWins.push(lineKey);
      }
    });
    
    return newWins;
  };

  /**
   * Checks if a cell is part of a winning line (for visual highlighting)
   */
  const isCellInWinningLine = (cellIndex) => {
    if (!winningLine) return false;
    return BINGO_LINES[winningLine].includes(cellIndex);
  };

  // ============================================================================
  // CELL INTERACTION HANDLER
  // ============================================================================
  
  const handleCellPress = (index) => {
    // Toggle cell selection
    const updated = selectedCells.includes(index)
      ? selectedCells.filter((i) => i !== index)
      : [...selectedCells, index];

    setSelectedCells(updated);

    // Only check for Bingo when adding a cell (not removing)
    if (!selectedCells.includes(index)) {
      const newWins = detectBingoWins(updated);
      
      if (newWins.length > 0) {
        // Prevent multiple simultaneous Bingo modals
        // Process the first win only
        const firstWin = newWins[0];
        
        // Mark this line as completed
        setCompletedLines((prev) => new Set([...prev, firstWin]));
        
        // Set winning line for visual highlighting
        setWinningLine(firstWin);
        
        // Trigger Bingo flow
        setActiveRoutine(firstWin);
        setShowPreCheck(true);
        
        // Increment Bingo count
        setBingoCount((prev) => prev + 1);
      }
    } else {
      // If removing a cell, clear winning line highlight if it's no longer valid
      if (winningLine) {
        const lineIndices = BINGO_LINES[winningLine];
        const stillWinning = lineIndices.every((idx) => updated.includes(idx));
        if (!stillWinning) {
          setWinningLine(null);
        }
      }
    }
  };

  // ============================================================================
  // BINGO WIN FLOW HANDLERS
  // ============================================================================
  
  const handlePreCheckComplete = () => {
    setShowPreCheck(false);
    setShowExercise(true);
  };

  const handleExerciseComplete = () => {
    setShowExercise(false);
    setShowPostCheck(true);
  };

  const handlePostCheckComplete = () => {
    // Calculate XP: +20 for Bingo + 10 per pain reduction point
    const painReduction = Math.max(0, prePain - postPain); // Never negative
    const xpEarned = 20 + (painReduction * 10);
    
    setTotalXP((prev) => prev + xpEarned);
    
    // Reset pain scales for next Bingo
    setPrePain(5);
    setPostPain(5);
    
    // Clear winning line highlight
    setWinningLine(null);
    
    setShowPostCheck(false);
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================
  
  const renderBingoHeader = () => (
    <View style={styles.bingoHeader}>
      {BINGO_LETTERS.map((letter, index) => (
        <View key={index} style={styles.bingoHeaderCell}>
          <Text style={styles.bingoHeaderText}>{letter}</Text>
        </View>
      ))}
    </View>
  );

  const renderBingoCard = () => (
    <View style={styles.bingoCard}>
      {renderBingoHeader()}
      <View style={styles.bingoGrid}>
        {PAIN_ITEMS.map((item, index) => {
          const isSelected = selectedCells.includes(index);
          const isWinning = isCellInWinningLine(index);
          
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleCellPress(index)}
              style={[
                styles.bingoCell,
                isSelected && styles.bingoCellSelected,
                isWinning && styles.bingoCellWinning,
              ]}
            >
              <Text style={styles.bingoCellEmoji}>{item.emoji}</Text>
              <Text style={[
                styles.bingoCellLabel,
                isSelected && styles.bingoCellLabelSelected,
              ]}>
                {item.label}
              </Text>
              {isSelected && (
                <View style={styles.checkmark}>
                  <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1E293B" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>🎲 Pain Bingo</Text>
            <Text style={styles.headerSubtitle}>Mark your discomforts & win rewards!</Text>
          </View>
        </View>

        {/* Gamification Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>🎯 {totalXP}</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>🟡 {bingoCount}</Text>
            <Text style={styles.statLabel}>Bingo Wins</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>📊 {completedLines.size}/12</Text>
            <Text style={styles.statLabel}>Lines Complete</Text>
          </View>
        </View>

        {/* Bingo Card */}
        {renderBingoCard()}

        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>How to Play</Text>
          <Text style={styles.instructionsText}>
            • Tap cells to mark discomforts you're experiencing{'\n'}
            • Complete a row, column, or diagonal to get BINGO! 🎉{'\n'}
            • Each Bingo unlocks a personalized exercise routine{'\n'}
            • Track your progress and earn XP rewards
          </Text>
        </View>
      </ScrollView>

      {/* ========================================================================
          BINGO WIN MODALS
          ======================================================================== */}

      {/* Pre-Check Modal: BINGO CHECK-IN */}
      <Modal visible={showPreCheck} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🎉 BINGO CHECK-IN</Text>
              <Text style={styles.modalSubtitle}>
                Before we celebrate your Bingo, let's check how you feel.
              </Text>
            </View>
            
            <View style={styles.painScaleContainer}>
              <Text style={styles.painScaleLabel}>Current Discomfort Level</Text>
              <Text style={styles.painScaleValue}>{prePain}/10</Text>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={10}
                step={1}
                value={prePain}
                onValueChange={setPrePain}
                minimumTrackTintColor="#3B82F6"
                maximumTrackTintColor="#E5E7EB"
                thumbTintColor="#3B82F6"
              />
              <View style={styles.painScaleLabels}>
                <Text style={styles.painScaleLabelSmall}>Mild (1)</Text>
                <Text style={styles.painScaleLabelSmall}>Severe (10)</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handlePreCheckComplete}
            >
              <Text style={styles.modalButtonText}>Start Exercise Round →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Exercise Modal: BINGO REWARD ROUND */}
      <Modal visible={showExercise} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalScrollContent}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>🎁 BINGO REWARD ROUND</Text>
                <Text style={styles.routineTitle}>
                  {EXERCISE_ROUTINES[activeRoutine]?.title}
                </Text>
                <Text style={styles.routineDuration}>
                  ⏱️ {EXERCISE_ROUTINES[activeRoutine]?.duration}
                </Text>
              </View>

              {/* Exercises List */}
              <View style={styles.exercisesContainer}>
                <Text style={styles.exercisesTitle}>Your Exercises:</Text>
                {EXERCISE_ROUTINES[activeRoutine]?.exercises.map((exercise, index) => (
                  <View key={index} style={styles.exerciseItem}>
                    <Text style={styles.exerciseText}>{exercise}</Text>
                  </View>
                ))}
              </View>

              {/* Precautions */}
              <View style={styles.precautionsContainer}>
                <Text style={styles.precautionsTitle}>⚠️ Important Precautions:</Text>
                <Text style={styles.precautionsText}>
                  • Stretch slowly — avoid jerky or bouncing movements{'\n'}
                  • Don't stretch through pain; a mild pull is enough{'\n'}
                  • Keep breathing — never hold your breath{'\n'}
                  • Maintain good posture and balance{'\n'}
                  • Warm up with light movements before deeper stretches{'\n'}
                  • Stop immediately if you feel sharp pain
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSuccess]}
                onPress={handleExerciseComplete}
              >
                <Text style={styles.modalButtonText}>I'm Done! ✅</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Post-Check Modal: BINGO COMPLETE */}
      <Modal visible={showPostCheck} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🏆 BINGO COMPLETE 🎉</Text>
              <Text style={styles.modalSubtitle}>
                Great job completing your exercise routine!
              </Text>
            </View>

            <View style={styles.painScaleContainer}>
              <Text style={styles.painScaleLabel}>How do you feel now?</Text>
              <Text style={styles.painScaleValue}>{postPain}/10</Text>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={10}
                step={1}
                value={postPain}
                onValueChange={setPostPain}
                minimumTrackTintColor="#22C55E"
                maximumTrackTintColor="#E5E7EB"
                thumbTintColor="#22C55E"
              />
              <View style={styles.painScaleLabels}>
                <Text style={styles.painScaleLabelSmall}>Mild (1)</Text>
                <Text style={styles.painScaleLabelSmall}>Severe (10)</Text>
              </View>
            </View>

            {/* Results */}
            <View style={styles.resultsContainer}>
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Improvement:</Text>
                <Text style={styles.resultValue}>
                  {Math.max(0, prePain - postPain)} points
                </Text>
              </View>
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>XP Earned:</Text>
                <Text style={styles.resultValue}>
                  +{20 + (Math.max(0, prePain - postPain) * 10)} 🎯
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handlePostCheckComplete}
            >
              <Text style={styles.modalButtonText}>Claim XP & Continue Playing</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F6FF",
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E293B",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: "#64748B",
    textAlign: "center",
  },
  bingoCard: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: "#3B82F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bingoHeader: {
    flexDirection: "row",
    marginBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#3B82F6",
    paddingBottom: 8,
  },
  bingoHeaderCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bingoHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3B82F6",
  },
  bingoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  bingoCell: {
    width: "18%",
    aspectRatio: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#E2E8F0",
    position: "relative",
  },
  bingoCellSelected: {
    backgroundColor: "#DBEAFE",
    borderColor: "#3B82F6",
    borderWidth: 2,
  },
  bingoCellWinning: {
    backgroundColor: "#FEF3C7",
    borderColor: "#F59E0B",
    borderWidth: 3,
    shadowColor: "#F59E0B",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  bingoCellEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  bingoCellLabel: {
    fontSize: 9,
    textAlign: "center",
    color: "#64748B",
    fontWeight: "500",
    paddingHorizontal: 2,
  },
  bingoCellLabelSelected: {
    color: "#1E40AF",
    fontWeight: "600",
  },
  checkmark: {
    position: "absolute",
    top: 4,
    right: 4,
  },
  instructionsCard: {
    backgroundColor: "#fff",
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 12,
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 10,
  },
  modalCard: {
    backgroundColor: "#fff",
    width: "100%",
    maxWidth: 400,
    maxHeight: "90%",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 18,
  },
  routineTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3B82F6",
    textAlign: "center",
    marginTop: 8,
  },
  routineDuration: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
    marginTop: 2,
  },
  painScaleContainer: {
    marginVertical: 20,
  },
  painScaleLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 12,
  },
  painScaleValue: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#3B82F6",
    textAlign: "center",
    marginBottom: 16,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  painScaleLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  painScaleLabelSmall: {
    fontSize: 12,
    color: "#64748B",
  },
  exercisesContainer: {
    marginVertical: 12,
  },
  exercisesTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 8,
  },
  exerciseItem: {
    backgroundColor: "#ECFDF5",
    padding: 10,
    borderRadius: 10,
    marginBottom: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#22C55E",
  },
  exerciseText: {
    fontSize: 13,
    color: "#065F46",
    fontWeight: "500",
  },
  precautionsContainer: {
    backgroundColor: "#FEF3C7",
    padding: 12,
    borderRadius: 10,
    marginVertical: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#F59E0B",
  },
  precautionsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#92400E",
    marginBottom: 6,
  },
  precautionsText: {
    fontSize: 12,
    color: "#78350F",
    lineHeight: 18,
  },
  resultsContainer: {
    backgroundColor: "#F0F9FF",
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
  },
  resultItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 16,
    color: "#64748B",
    fontWeight: "500",
  },
  resultValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3B82F6",
  },
  modalButton: {
    backgroundColor: "#3B82F6",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  modalButtonSuccess: {
    backgroundColor: "#22C55E",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
