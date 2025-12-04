import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; 

// --- Dummy Data for Quick Relief Routines ---
const RELIEF_ROUTINES = [
  { id: 1, name: 'Cat Cow', target: 'Spine', duration: '45s' },
  { id: 2, name: 'Giraffe Stretch', target: 'Neck', duration: '30s' },
  { id: 3, name: 'Wrist Flexor', target: 'Arms', duration: '30s' },
  { id: 4, name: 'Seated Twist', target: 'Back', duration: '45s' },
  { id: 5, name: 'Hamstring Reach', target: 'Legs', duration: '60s' },
  { id: 6, name: 'Shoulder Rolls', target: 'Shoulders', duration: '30s' },
  { id: 7, name: 'Chin Tucks', target: 'Neck', duration: '30s' },
  { id: 8, name: 'Calf Raises', target: 'Legs', duration: '45s' },
  { id: 9, name: 'Doorway Stretch', target: 'Chest', duration: '30s' },
  { id: 10, name: 'Deep Squat', target: 'Legs', duration: '45s' },
];

const QuickReliefScreen = () => {
  const navigation = useNavigation();

  // Component for rendering a single routine card
  const renderRoutineItem = (item) => (
    <TouchableOpacity key={item.id} style={styles.routineCard} activeOpacity={0.7}>
      <View style={styles.stepContainer}>
        <Text style={styles.stepNumber}>{item.id}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.routineName}>{item.name}</Text>
        <Text style={styles.routineDetails}>{item.target} • {item.duration}</Text>
      </View>
      {/* Icon to signify this routine can be played/started */}
      <Ionicons name="play-outline" size={24} color="#a8ffc3" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* --- Top Header (Back button) --- */}
      <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* --- Title and Subtitle --- */}
        <Text style={styles.screenTitle}>Quick Relief</Text>
        <Text style={styles.screenSubtitle}>Verified physio routines.</Text>

        {/* --- Routines List --- */}
        <View style={styles.listContainer}>
          {RELIEF_ROUTINES.map(renderRoutineItem)}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // --- Overall Layout & Colors ---
  safeArea: {
    flex: 1,
    backgroundColor: '#120a1f', // Deep dark indigo background
  },
  container: {
    paddingHorizontal: 30, 
    paddingTop: 10,
    paddingBottom: 40,
  },
  
  // --- Header & Title ---
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 10,
  },
  screenTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#e0b0ff', 
    marginTop: 10,
  },
  screenSubtitle: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 25,
    fontWeight: '400',
  },

  // --- Routine List Styling ---
  listContainer: {
    marginTop: 10,
  },
  routineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c122a', // Slightly lighter dark background for the card
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    borderLeftWidth: 5,
    borderLeftColor: '#a8ffc3', // Light green accent line on the left
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  stepContainer: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: 'rgba(168, 255, 195, 0.2)', // Light green translucent background
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  stepNumber: {
    color: '#a8ffc3', // Bright green number
    fontWeight: 'bold',
    fontSize: 14,
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  routineName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  routineDetails: {
    color: '#ccc',
    fontSize: 12,
  },
});

export default QuickReliefScreen;