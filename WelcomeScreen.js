import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
} from 'react-native';

export default function WelcomeScreen({ navigation }) {
  const handleGetStarted = () => {
    navigation.navigate('Login');
  };

  const handleLearnMore = () => {
    // Placeholder action for Learn More
    navigation.navigate('Login');
  };

  return (
    <ImageBackground
      source={require('./assets/images/logo1.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.welcomeText}>Welcome to</Text>
            <Text style={styles.brandLine}>MOTION</Text>
            <Text style={styles.brandLine}>PHYSIO</Text>
          </View>

          <View style={styles.heroPlaceholder}>
            {/* You can add overlay illustration or leave transparent */}
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleGetStarted}>
              <Text style={styles.primaryButtonText}>Get Started</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleGetStarted}>
              <Text style={styles.linkText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLearnMore}>
              <Text style={styles.linkText}>Learn More</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#021A3A',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 16,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 22,
    color: '#BFD4FF',
    marginBottom: 12,
  },
  brandLine: {
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#FFFFFF',
  },
  heroPlaceholder: {
    flex: 1,
  },
  buttons: {
    alignItems: 'center',
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#0A84FF',
    borderRadius: 999,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 24,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  linkText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
  },
});


