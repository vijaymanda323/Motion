// --- Start of HomeScreen.js ---

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import API_BASE_URL from "./config/api";

export default function HomeScreen({ navigation }) {
  const route = useRoute();
  const userNameFromParams = route.params?.userName;
  const userEmailFromParams = route.params?.userEmail;
  
  // Helper function to safely convert to string
  const safeString = (value, fallback = '') => {
    if (value == null) return fallback;
    const str = String(value).trim();
    return str || fallback;
  };
  
  // Helper function to safely convert to number
  const safeNumber = (value, fallback = 0) => {
    if (value == null) return fallback;
    const num = Number(value);
    return isNaN(num) ? fallback : Math.max(0, num);
  };
  
  const [userName, setUserName] = useState(() => safeString(userNameFromParams, 'User'));
  const [userEmail, setUserEmail] = useState(() => safeString(userEmailFromParams, 'admin'));
  const [streakCount, setStreakCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    // If we have email from params, use it; otherwise try to get from stored user data
    const email = safeString(userEmailFromParams, 'admin'); // Fallback to 'admin' for now
    setUserEmail(email);
    
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile/${email}`);
      
      if (!response.ok) {
        console.warn('Failed to fetch user profile:', response.status);
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      
      if (data && data.user) {
        const firstName = data.user.firstName || data.user.name || userNameFromParams || 'User';
        const streak = data.user.streakCount || 0;
        const userEmailValue = data.user.email || email;
        
        // Ensure all values are strings/numbers, never undefined or null
        setUserName(safeString(firstName, 'User'));
        setStreakCount(safeNumber(streak, 0));
        setUserEmail(safeString(userEmailValue, safeString(email, 'admin')));
      } else {
        // If no user data, keep defaults
        setUserName(safeString(userNameFromParams, 'User'));
        setStreakCount(0);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Keep default values if fetch fails
      setUserName(safeString(userNameFromParams, 'User'));
      setStreakCount(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* TOP HEADER */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>

          {/* 🎯 Profile Icon: Navigate to AboutYou */}
          <TouchableOpacity onPress={() => navigation.navigate("AboutYou", { userEmail: userEmail })}>
            <Ionicons name="person-circle-outline" size={30} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.headerTitle}>Hi, {safeString(userName, 'User')}</Text>
        <Text style={styles.headerSubtitle}>Let's fix that posture.</Text>

        {/* Status & Streak */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>STATUS</Text>
            <View style={styles.statValueRow}>
              <Ionicons name="checkmark-circle" size={18} color="#fff" />
              <Text style={styles.statValue}> Active</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>STREAK</Text>
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.statValue}>
                🔥 {safeNumber(streakCount, 0)} {safeNumber(streakCount, 0) === 1 ? 'Day' : 'Days'}
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Pain Bingo - clickable card */}
        <TouchableOpacity onPress={() => navigation.navigate("PainBingo", { userEmail: userEmail })}>
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Ionicons name="apps-outline" size={22} color="#777" />
              <View style={styles.badgePink}>
                <Text style={styles.badgeText}>GAMIFIED</Text>
              </View>
            </View>

            <Text style={styles.cardTitle}>Pain Bingo</Text>
            <Text style={styles.cardText}>
              Turn your symptoms into a game. Complete patterns to unlock specific relief.
            </Text>
          </View>
        </TouchableOpacity>

        {/* Quick Relief - MADE CLICKABLE AND ADDED NAVIGATION */}
        <TouchableOpacity onPress={() => navigation.navigate("QuickRelief")}>
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Ionicons name="list-outline" size={22} color="#777" />
              <View style={styles.badgeGreen}>
                <Text style={styles.badgeText}>TRADITIONAL</Text>
              </View>
            </View>

            <Text style={styles.cardTitle}>Quick Relief</Text>
            <Text style={styles.cardText}>
              Direct access to standard physio routines. No frills, just results.
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* --- Bottom Navigation --- */}
      <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItemActive}>
            {/* Active Icon for Today */}
            <Ionicons name="today" size={24} color="#1e5cff" /> 
            <Text style={styles.navTextActive}>Today</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("PainBingo", { userEmail: userEmail })}>
            <Ionicons name="apps-outline" size={24} color="#888" />
            <Text style={styles.navText}>Bingo</Text>
          </TouchableOpacity>
          
          {/* 🎯 Profile Tab: Navigate to AboutYou */}
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("AboutYou", { userEmail: userEmail })}>
            <Ionicons name="person-outline" size={24} color="#888" />
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#eef2ff" 
  },
  scrollContent: {
    paddingTop: 40, 
    paddingBottom: 120, // Add padding for bottom navigation
  },
  header: {
    backgroundColor: "#1e5cff",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 60,
    borderBottomLeftRadius: 120,
    borderBottomRightRadius: 120,
  },
  headerRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center" 
  },
  headerTitle: { 
    fontSize: 30, 
    fontWeight: "bold", 
    color: "#fff", 
    marginTop: 15 
  },
  headerSubtitle: { 
    color: "#dbe4ff", 
    fontSize: 16, 
    marginBottom: 20 
  },
  statsRow: { 
    flexDirection: "row", 
    justifyContent: "space-between" 
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingVertical: 18,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 12,
  },
  statLabel: { 
    color: "#dce6ff", 
    fontSize: 13, 
    marginBottom: 5 
  },
  statValueRow: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  statValue: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "bold" 
  },

  /* cards */
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 22,
    marginHorizontal: 20,
    marginVertical: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeaderRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center" 
  },
  badgePink: { 
    backgroundColor: "#ff6b6b", 
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    borderRadius: 10 
  },
  badgeGreen: { 
    backgroundColor: "#8ad18a", 
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    borderRadius: 10 
  },
  badgeText: { 
    color: "#fff", 
    fontSize: 12, 
    fontWeight: "bold" 
  },
  cardTitle: { 
    fontSize: 22, 
    fontWeight: "bold", 
    marginTop: 10, 
    color: "#333" 
  },
  cardText: { 
    fontSize: 15, 
    color: "#666", 
    marginTop: 5 
  },

  // --- Bottom Navigation Styles ---
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff', // White background for light theme
    paddingBottom: 25, // For touch area/safe area spacing
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eef2ff', // Light separator
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
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
    color: '#1e5cff', // Primary blue color for active tab
    fontSize: 12,
    marginTop: 2,
    fontWeight: 'bold',
  }
});

// --- End of HomeScreen.js ---