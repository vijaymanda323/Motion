import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import API_BASE_URL from './config/api';
import { testServerConnection, getConnectionInfo } from './utils/connectionTest';

export default function SignUpScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      console.log('=== SIGNUP ATTEMPT ===');
      console.log('Full Name:', fullName);
      console.log('Email:', email);
      console.log('Connection Info:', getConnectionInfo());
      
      // Test server connection first (with better error handling)
      console.log('Testing server connection...');
      let connectionTest;
      try {
        connectionTest = await testServerConnection();
        console.log('Connection test result:', connectionTest);
        
        if (!connectionTest.success) {
          throw new Error(`Cannot connect to server:\n${connectionTest.message}\n\nPlease check:\n1. Backend server is running\n2. Correct IP: 192.168.0.6\n3. Same WiFi network\n4. Firewall allows port 5000\n5. App was rebuilt after app.json changes`);
        }
        
        console.log('✅ Server connection successful, proceeding with signup...');
      } catch (testError) {
        console.error('Connection test failed:', testError);
        // Continue anyway - the actual signup request will show the real error
        console.warn('⚠️ Connection test failed, but continuing with signup attempt...');
      }
      
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const requestBody = {
        name: fullName,
        email: email.trim().toLowerCase(),
        password: password,
      };
      
      console.log('Request body:', JSON.stringify(requestBody, null, 2));
      
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      }).catch((fetchError) => {
        clearTimeout(timeoutId);
        console.error('=== FETCH ERROR ===');
        console.error('Error name:', fetchError.name);
        console.error('Error message:', fetchError.message);
        console.error('Error stack:', fetchError.stack);
        
        if (fetchError.name === 'AbortError' || fetchError.name === 'TimeoutError') {
          throw new Error('Request timeout. Please check your connection and try again.');
        }
        
        // More specific error messages
        if (fetchError.message.includes('Network request failed') || 
            fetchError.message.includes('Failed to fetch') ||
            fetchError.message.includes('NetworkError')) {
          throw new Error(`Cannot connect to server at ${API_BASE_URL}. Please check:\n1. Backend server is running\n2. Correct IP address in config/api.js\n3. Same WiFi network`);
        }
        
        throw fetchError;
      });
      
      clearTimeout(timeoutId);

      console.log('=== RESPONSE RECEIVED ===');
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      // Check if response has content before parsing JSON
      let data;
      try {
        const responseText = await response.text();
        console.log('Response text:', responseText);
        
        if (responseText) {
          try {
            data = JSON.parse(responseText);
            console.log('Parsed response data:', data);
          } catch (parseError) {
            console.error('JSON parse error:', parseError);
            data = { message: responseText || 'Unknown error occurred' };
          }
        } else {
          data = { message: 'Empty response from server' };
        }
      } catch (textError) {
        console.error('Error reading response:', textError);
        data = { message: 'Error reading server response' };
      }

      if (response.ok) {
        console.log('=== SUCCESS ===');
        console.log('Account created successfully:', data);
        console.log('User ID:', data.user?.id);
        console.log('User email:', data.user?.email);
        
        Alert.alert(
          'Success', 
          'Account created successfully!\n\nYou can now login with your credentials.', 
          [
            {
              text: 'OK',
              onPress: () => {
                // Clear form
                setFullName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                // Navigate to login
                navigation.navigate('Login', { emailPrefill: email });
              },
            },
          ]
        );
      } else {
        console.error('=== SIGNUP FAILED ===');
        console.error('Status:', response.status);
        console.error('Error data:', data);
        
        // Show specific error messages
        let errorMessage = data.message || 'Failed to create account';
        
        if (response.status === 400) {
          errorMessage = data.message || 'Invalid information provided. Please check your details.';
        } else if (response.status === 503) {
          errorMessage = 'Database connection error. Please check MongoDB Atlas settings and IP whitelist.';
        } else if (response.status === 500) {
          errorMessage = data.message || 'Server error. Please try again later.';
        } else if (response.status === 409) {
          errorMessage = 'This email is already registered. Please use a different email or login instead.';
        }
        
        Alert.alert('Signup Failed', errorMessage);
      }
    } catch (error) {
      console.error('Signup error:', error);
      console.error('Error details:', {
        message: error?.message || 'Unknown error',
        name: error?.name || 'Unknown',
        API_URL: `${API_BASE_URL}/users/register`,
        Platform: Platform.OS
      });
      
      let errorMessage = '';
      let errorTitle = 'Connection Error';
      
      const errorMsg = error?.message || error?.toString() || 'Unknown error';
      
      if (errorMsg.includes('Cannot connect to server') || 
          errorMsg.includes('Network request failed') || 
          errorMsg.includes('Failed to fetch') ||
          errorMsg.includes('Network error')) {
        errorMessage = `Cannot connect to server at:\n${API_BASE_URL}\n\nPlease check:\n\n`;
        errorMessage += '1. Backend server is running:\n   cd motionphysio/backend\n   npm start\n\n';
        errorMessage += `2. Your computer IP: 192.168.0.6\n   (Update config/api.js if different)\n\n`;
        errorMessage += '3. Phone and computer on same WiFi\n\n';
        errorMessage += '4. Firewall allows port 5000\n\n';
        errorMessage += '5. Try: http://192.168.0.6:5000 in browser';
      } else if (errorMsg.includes('Request timeout') || errorMsg.includes('timeout')) {
        errorTitle = 'Timeout Error';
        errorMessage = 'Request took too long. Please check:\n\n1. Backend server is running\n2. Network connection is stable\n3. Try again';
      } else if (errorMsg.includes('JSON')) {
        errorTitle = 'Server Error';
        errorMessage = 'Invalid response from server. Please check if the backend is running correctly.';
      } else {
        errorMessage = errorMsg || 'An unexpected error occurred. Please try again.';
      }
      
      Alert.alert(errorTitle, errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.logo}>Motion Physio</Text>
            <Text style={styles.tagline}>Create your account</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#999"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Create a password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Re-enter your password"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity 
              style={[styles.signUpButton, loading && styles.signUpButtonDisabled]} 
              onPress={handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.signUpButtonText}>Sign Up</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backToLogin}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.backToLoginText}>Already have an account? Log In</Text>
            </TouchableOpacity>

            {/* Connection Test Button (for debugging) */}
            {__DEV__ && (
              <TouchableOpacity
                style={styles.testButton}
                onPress={async () => {
                  setLoading(true);
                  const test = await testServerConnection();
                  Alert.alert(
                    test.success ? 'Connection OK' : 'Connection Failed',
                    test.message + '\n\n' + JSON.stringify(getConnectionInfo(), null, 2)
                  );
                  setLoading(false);
                }}
              >
                <Text style={styles.testButtonText}>Test Server Connection</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    color: '#999',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#333',
  },
  signUpButton: {
    backgroundColor: '#0A84FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  signUpButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  signUpButtonDisabled: {
    opacity: 0.6,
  },
  backToLogin: {
    alignItems: 'center',
  },
  backToLoginText: {
    fontSize: 14,
    color: '#999',
  },
  testButton: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#555',
  },
  testButtonText: {
    fontSize: 12,
    color: '#999',
  },
});


