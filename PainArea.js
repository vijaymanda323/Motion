import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  PanResponder,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';

// Custom Slider Component with smooth drag handling
const CustomSlider = ({ value, onValueChange, minimumValue = 0, maximumValue = 10, trackColor, activeTrackColor, thumbColor }) => {
  const [sliderLayout, setSliderLayout] = useState({ width: 200, x: 0 });
  const [currentValue, setCurrentValue] = useState(value);
  const sliderRef = useRef(null);
  
  const percentage = ((currentValue - minimumValue) / (maximumValue - minimumValue)) * 100;

  const calculateValue = (locationX) => {
    const newValue = Math.max(
      minimumValue,
      Math.min(maximumValue, (locationX / sliderLayout.width) * (maximumValue - minimumValue) + minimumValue)
    );
    return newValue;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        if (sliderLayout.width > 0) {
          const { locationX } = evt.nativeEvent;
          const newValue = calculateValue(locationX);
          setCurrentValue(newValue);
          onValueChange(newValue);
        }
      },
      onPanResponderMove: (evt) => {
        if (sliderLayout.width > 0) {
          const { locationX } = evt.nativeEvent;
          const newValue = calculateValue(locationX);
          setCurrentValue(newValue);
          onValueChange(newValue);
        }
      },
      onPanResponderRelease: () => {
        // Value already updated in onPanResponderMove
      },
    })
  ).current;

  React.useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  return (
    <View 
      ref={sliderRef}
      style={styles.customSliderContainer}
      onLayout={(evt) => {
        const { width, x } = evt.nativeEvent.layout;
        setSliderLayout({ width, x });
      }}
      {...panResponder.panHandlers}
    >
      <View style={styles.sliderTouchArea}>
        <View style={[styles.sliderTrack, { backgroundColor: trackColor }]}>
          <View
            style={[
              styles.sliderActiveTrack,
              { width: `${percentage}%`, backgroundColor: activeTrackColor },
            ]}
          />
          <View
            style={[
              styles.sliderThumb,
              { left: `${percentage}%`, backgroundColor: thumbColor },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

export default function PainAreaScreen({ navigation }) {
  const route = useRoute();
  const userName = route.params?.userName;
  const userEmail = route.params?.userEmail;
  
  const [selectedCount, setSelectedCount] = useState(0);
  const [painLevel, setPainLevel] = useState(3);
  const [comfortLevel, setComfortLevel] = useState(7);
  const [isAnteriorView] = useState(true);
  const [showHighPainModal, setShowHighPainModal] = useState(false);
  const [hasShownModal, setHasShownModal] = useState(false);

  // Show modal when pain level reaches 8 or higher
  useEffect(() => {
    const roundedPainLevel = Math.round(painLevel);
    if (roundedPainLevel >= 8 && !hasShownModal) {
      setShowHighPainModal(true);
      setHasShownModal(true);
    } else if (roundedPainLevel < 8) {
      // Reset the flag when pain level goes below 8
      setHasShownModal(false);
    }
  }, [painLevel, hasShownModal]);

  const handleSubmit = () => {
    // Save pain area data
    console.log('Pain areas submitted:', {
      selectedCount,
      painLevel,
      comfortLevel,
      view: isAnteriorView ? 'Anterior' : 'Posterior'
    });
    
    // Navigate to HomeScreen
    navigation.navigate('HomeScreen', {
      userName: userName || 'User',
      userEmail: userEmail || 'admin'
    });
  };

  const handleFindPhysio = () => {
    setShowHighPainModal(false);
    // TODO: Navigate to physio finder screen or open physio search
    console.log('Find & Consult Physio pressed');
    // You can add navigation here when you have a physio finder screen
    // navigation.navigate('PhysioFinder');
  };

  const handleTryExercise = () => {
    setShowHighPainModal(false);
    // TODO: Navigate to gentle relief exercise screen
    console.log('Try Gentle Relief Exercise pressed');
    // You can add navigation here when you have an exercise screen
    // navigation.navigate('GentleReliefExercise');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header Section - Fixed at top in SafeAreaView */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <View style={styles.titleRow}>
            <Text style={styles.headerTitle}>Tap Pain Areas</Text>
            <Ionicons name="person-outline" size={20} color="#333" style={styles.personIcon} />
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.todayButton}>
            <Ionicons name="calendar-outline" size={18} color="#0A84FF" />
            <Text style={styles.todayButtonText}>Today</Text>
          </TouchableOpacity>
          <Text style={styles.selectedCount}>{selectedCount} Selected</Text>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >

        {/* Body Diagram Section */}
        <View style={styles.bodySection}>
          <View style={styles.viewLabelContainer}>
            <Text style={styles.viewLabel}>
              {isAnteriorView ? 'ANTERIOR VIEW' : 'POSTERIOR VIEW'}
            </Text>
          </View>

          {/* 3D Model Placeholder - User will add their 3D model code here */}
          <View style={styles.modelContainer}>
            {/* TODO: Add 3D model component here */}
            <View style={styles.modelPlaceholder}>
              <Ionicons name="body-outline" size={120} color="#e0e0e0" />
              <Text style={styles.placeholderText}>3D Model Placeholder</Text>
              <Text style={styles.placeholderSubtext}>Add your 3D model code here</Text>
            </View>
          </View>

          <Text style={styles.instructionText}>Tap body parts to select</Text>
        </View>

        {/* Pain and Comfort Level Section */}
        <View style={styles.levelsCard}>
          {/* Pain Level */}
          <View style={styles.levelRow}>
            <View style={styles.levelLabelContainer}>
              <Ionicons name="warning" size={18} color="#FF9500" />
              <Text style={styles.levelLabel}>Pain Level</Text>
            </View>
            <View style={styles.sliderContainer}>
              <CustomSlider
                value={painLevel}
                onValueChange={setPainLevel}
                minimumValue={0}
                maximumValue={10}
                trackColor="#e0e0e0"
                activeTrackColor="#FF9500"
                thumbColor="#FF9500"
              />
            </View>
            <Text style={[styles.levelValue, { color: '#FF9500' }]}>{Math.round(painLevel)}</Text>
          </View>

          {/* Comfort Level */}
          <View style={styles.levelRow}>
            <View style={styles.levelLabelContainer}>
              <Ionicons name="flash" size={18} color="#34C759" />
              <Text style={styles.levelLabel}>Comfort</Text>
            </View>
            <View style={styles.sliderContainer}>
              <CustomSlider
                value={comfortLevel}
                onValueChange={setComfortLevel}
                minimumValue={0}
                maximumValue={10}
                trackColor="#e0e0e0"
                activeTrackColor="#34C759"
                thumbColor="#34C759"
              />
            </View>
            <Text style={styles.levelValue}>{Math.round(comfortLevel)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer Submit Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Submit & Continue</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.arrowIcon} />
        </TouchableOpacity>
      </View>

      {/* High Pain Level Modal */}
      <Modal
        visible={showHighPainModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowHighPainModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Close Button */}
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowHighPainModal(false)}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>

            {/* Stethoscope Icon */}
            <View style={styles.modalIconContainer}>
              <View style={styles.modalIconCircle}>
                <Ionicons name="medical-outline" size={32} color="#FF3B30" />
              </View>
            </View>

            {/* Title */}
            <Text style={styles.modalTitle}>
              Pain Level High ({Math.round(painLevel)}/10)
            </Text>

            {/* Message */}
            <Text style={styles.modalMessage}>
              You are reporting significant discomfort. We recommend professional consultation.
            </Text>

            {/* Action Buttons */}
            <TouchableOpacity 
              style={styles.modalRedButton}
              onPress={handleFindPhysio}
            >
              <Text style={styles.modalRedButtonText}>Find & Consult Physio</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalGreenButton}
              onPress={handleTryExercise}
            >
              <Text style={styles.modalGreenButtonText}>Try Gentle Relief Exercise</Text>
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
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 100, // Space for footer button
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 5,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  personIcon: {
    marginLeft: 4,
  },
  headerRight: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  todayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  todayButtonText: {
    fontSize: 14,
    color: '#0A84FF',
    fontWeight: '500',
  },
  selectedCount: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  bodySection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  viewLabelContainer: {
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  viewLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    letterSpacing: 1,
  },
  modelContainer: {
    width: '100%',
    height: 400,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  modelPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
    fontWeight: '500',
  },
  placeholderSubtext: {
    fontSize: 12,
    color: '#bbb',
    marginTop: 5,
  },
  instructionText: {
    fontSize: 12,
    color: '#999',
    marginTop: 15,
    fontStyle: 'italic',
  },
  levelsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  levelLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: 100,
  },
  levelLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  sliderContainer: {
    flex: 1,
    marginHorizontal: 15,
    height: 40,
    justifyContent: 'center',
  },
  customSliderContainer: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    paddingVertical: 5,
  },
  sliderTouchArea: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  sliderTrack: {
    height: 4,
    borderRadius: 2,
    position: 'relative',
    width: '100%',
  },
  sliderActiveTrack: {
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: 'absolute',
    top: -8,
    marginLeft: -10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  levelValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34C759',
    minWidth: 30,
    textAlign: 'right',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 25,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  submitButton: {
    backgroundColor: '#0A84FF',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  arrowIcon: {
    marginLeft: 4,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
    zIndex: 1,
  },
  modalIconContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  modalIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFE5F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalRedButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalRedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalGreenButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#34C759',
  },
  modalGreenButtonText: {
    color: '#34C759',
    fontSize: 16,
    fontWeight: '600',
  },
});

