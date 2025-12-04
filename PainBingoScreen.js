// --- Start of PainBingoScreen.js ---

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import API_BASE_URL from './config/api'; 

// --- STYLE DEFINITION (MOVED UP FOR CLEAN SCOPE) ---
const styles = StyleSheet.create({
  // --- Overall Layout & Colors ---
  safeArea: {
    flex: 1,
    backgroundColor: '#120a1f', // Deep dark indigo background
  },
  container: {
    // Increased horizontal padding for a slightly narrower content area, enhancing central focus
    paddingHorizontal: 30, 
    paddingTop: 10,
    paddingBottom: 120, // Space for bottom navigation
  },
  
  // --- Header ---
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#e0b0ff', 
  },
  subtitle: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 25,
    fontWeight: '400',
  },
  rewardIndicator: {
    backgroundColor: '#30263f',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ffaa00', 
  },
  rewardText: {
    color: '#ffaa00',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // --- Bingo Grid ---
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // Center the entire grid
    justifyContent: 'center', 
    marginBottom: 40,
  },
  tileBase: {
    // Calculated width for 5 columns: (100 - (4 * 1.5% margin)) / 5 = 18.8%
    width: '18.8%', 
    height: 70, // Adjusted height to allow 5 rows to be visible without excessive scrolling
    borderRadius: 15, // Increased border radius for rounded box shape
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '2%', // Spacing between rows
    padding: 4, // Reduced padding slightly due to smaller tiles
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  tileDefault: {
    backgroundColor: '#30263f', // Dark tile background
  },
  tileFreeSpace: {
    backgroundColor: '#ffaa00', // Orange for FREE SPACE
    borderWidth: 2,
    borderColor: '#fff',
  },
  tileSelected: {
    backgroundColor: '#9333ea', // Bright purple for selected tiles
    borderColor: '#e0b0ff',
    borderWidth: 2,
  },
  tileText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 10, // Adjusted font size for 5x5 grid
    fontWeight: '600',
    lineHeight: 12, // Adjusted line height for better multi-line text display
  },

  // --- Check Button ---
  checkButton: {
    backgroundColor: '#d836a4', 
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    borderLeftColor: '#9333ea', 
    borderLeftWidth: 4,
    shadowColor: '#9333ea',
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 8,
  },
  checkButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // --- Rewards Section ---
  rewardsSection: {
    marginTop: 35,
  },
  rewardsTitle: {
    color: '#ccc',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  rewardCard: {
      backgroundColor: '#30263f',
      padding: 15,
      borderRadius: 15,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 5,
  },
  rewardIconContainer: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#52465c',
    marginRight: 10,
  },
  rewardTextContent: {
      flex: 1,
  },
  rewardCardTitle: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '700',
      marginBottom: 2,
  },
  rewardCardSubtitle: {
      color: '#ccc',
      fontSize: 12,
  },
  
  // --- Bottom Navigation ---
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1c122a', // Slightly different dark background for the bar
    paddingBottom: 25, 
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#30263f',
  },
  navItem: {
    alignItems: 'center',
    padding: 5,
  },
  navText: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  navItemActive: {
    alignItems: 'center',
    padding: 5,
  },
  navTextActive: {
    color: '#e0b0ff',
    fontSize: 12,
    marginTop: 2,
    fontWeight: 'bold',
  }
});
// --- END STYLE DEFINITION ---


// 5x5 Grid Data (25 Tiles including FREE SPACE)
const BINGO_TILES = [
  'Neck stiffness', 'Dry eyes', 'Wrist pain', 'Shoulder ache', 'Tension headache',
  'Lower back pain', 'Slouching posture', 'Eye strain', 'Stiff fingers', 'Tight hamstrings',
  'Tech neck', 'Fatigue', 'FREE SPACE', 'Sore wrists', 'Back knots',
  'Tingling hands', 'Tight shoulders', 'Poor ergonomics', 'Knee discomfort', 'Leg cramps',
  'Foot numbness', 'Arm soreness', 'Screen glare', 'Sleep issues', 'Hip pain',
];

const PainBingoScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const userEmailFromParams = route.params?.userEmail;
  
  // Helper function to safely convert to number
  const safeNumber = (value, fallback = 0) => {
    if (value == null) return fallback;
    const num = Number(value);
    return isNaN(num) ? fallback : Math.max(0, num);
  };
  
  // State to manage selected tiles, pre-filled with the tiles shown as selected in the reference images
  const [selectedTiles, setSelectedTiles] = useState([
    'Slouching posture', 'Fatigue', 'Tight shoulders'
  ]);
  
  // State for streak count
  const [streakCount, setStreakCount] = useState(0);
  const [loadingStreak, setLoadingStreak] = useState(true);
  
  useEffect(() => {
    fetchUserStreak();
  }, []);
  
  const fetchUserStreak = async () => {
    const email = userEmailFromParams || 'admin';
    
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile/${email}`);
      
      if (!response.ok) {
        console.warn('Failed to fetch user profile:', response.status);
        setLoadingStreak(false);
        return;
      }
      
      const data = await response.json();
      
      if (data && data.user) {
        const streak = data.user.streakCount || 0;
        setStreakCount(safeNumber(streak, 0));
      } else {
        setStreakCount(0);
      }
    } catch (error) {
      console.error('Error fetching user streak:', error);
      setStreakCount(0);
    } finally {
      setLoadingStreak(false);
    }
  };

  const handleTileSelection = (tile) => {
    // Prevent selection of the FREE SPACE tile
    if (tile === 'FREE SPACE') return;

    setSelectedTiles(prev => {
      if (prev.includes(tile)) {
        return prev.filter(t => t !== tile); // Deselect
      } else {
        return [...prev, tile]; // Select
      }
    });
  };

  const isTileSelected = (tile) => selectedTiles.includes(tile);

  const renderBingoTile = (tile, index) => {
    const isFreeSpace = tile === 'FREE SPACE';
    const isSelected = isTileSelected(tile);

    const isLastInRow = (index + 1) % 5 === 0;

    return (
      <TouchableOpacity 
        key={index} 
        style={[
          styles.tileBase, 
          // Custom margin to create 5-column look, centered
          { marginRight: isLastInRow ? 0 : '1.5%' }, 
          isFreeSpace ? styles.tileFreeSpace : styles.tileDefault,
          isSelected && styles.tileSelected,
        ]}
        onPress={() => handleTileSelection(tile)}
        disabled={isFreeSpace}
      >
        <Text style={styles.tileText}>{tile}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* --- Top Header and Title --- */}
      <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>

          <View style={styles.rewardIndicator}>
              {loadingStreak ? (
                <ActivityIndicator color="#ffaa00" size="small" />
              ) : (
                <Text style={styles.rewardText}>🔥 {streakCount}</Text>
              )}
          </View>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Title and Subtitle */}
        <Text style={styles.title}>PAIN BINGO</Text>
        <Text style={styles.subtitle}>Select pattern & Click Check:</Text>

        {/* --- Bingo Grid --- */}
        <View style={styles.gridContainer}>
          {BINGO_TILES.map(renderBingoTile)}
        </View>

        {/* --- CHECK BINGO & START Button (NAVIGATES TO PRECHECK) --- */}
        <TouchableOpacity 
            style={styles.checkButton}
            onPress={() => navigation.navigate('PreCheck')} // 👈 Navigation restored
        >
            <Text style={styles.checkButtonText}>CHECK BINGO & START</Text>
        </TouchableOpacity>

        {/* --- Rewards Section --- */}
        <View style={styles.rewardsSection}>
             <Text style={styles.rewardsTitle}>REWARDS</Text>
             
             {/* Reward Card */}
             <View style={styles.rewardCard}>
                <View style={styles.rewardIconContainer}>
                    <Ionicons name="gift-outline" size={24} color="#e0b0ff" />
                </View>
                <View style={styles.rewardTextContent}>
                    <Text style={styles.rewardCardTitle}>Free Physio Session</Text>
                    <Text style={styles.rewardCardSubtitle}>Reach 7 Day Streak.</Text>
                </View>
                {/* Lock icon placeholder */}
                <Ionicons name="lock-closed-outline" size={20} color="#777" />
             </View>
        </View>
      </ScrollView>

      {/* --- Bottom Navigation --- */}
      <View style={styles.bottomNav}>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate('HomeScreen', { 
              userEmail: userEmailFromParams || 'admin' 
            })}
          >
            <Ionicons name="today-outline" size={24} color="#888" />
            <Text style={styles.navText}>Today</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navItemActive}>
            <Ionicons name="apps" size={24} color="#e0b0ff" />
            <Text style={styles.navTextActive}>Bingo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate('AboutYou', { 
              userEmail: userEmailFromParams || 'admin' 
            })}
          >
            <Ionicons name="person-outline" size={24} color="#888" />
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PainBingoScreen;
// --- End of PainBingoScreen.js ---