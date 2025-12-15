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
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import API_BASE_URL from './config/api';

export default function LoginScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const prefillEmail = route.params?.emailPrefill || '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (prefillEmail) {
      setEmail(prefillEmail);
    }
  }, [prefillEmail]);

  const handleLogin = async () => {
    // Validate inputs
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!normalizedEmail || !trimmedPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      console.log('Login attempt for:', normalizedEmail);
      console.log('API URL:', `${API_BASE_URL}/users/login`);
      console.log('Platform:', Platform.OS);

      // First, test if backend is reachable (optional - don't block login if it fails)
      try {
        const testUrl = API_BASE_URL.replace('/api', '');
        console.log('Testing backend connection at:', testUrl);
        
        // Use AbortController for timeout (fetch doesn't support timeout option)
        // Increased timeout to 8 seconds for slower networks
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        
        const testResponse = await fetch(testUrl, {
          method: 'GET',
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
          },
        });
        
        clearTimeout(timeoutId);
        if (testResponse.ok) {
          console.log('Backend connection test: ✅ Success');
        } else {
          console.warn('Backend connection test: ⚠️ Server responded with status', testResponse.status);
        }
      } catch (testError) {
        // Don't block login attempt - just log the warning
        if (testError.name === 'AbortError') {
          console.warn('Backend connection test failed: Request timeout (8s)');
          console.warn('⚠️ Connection test timed out, but continuing with login attempt...');
        } else {
          console.warn('Backend connection test failed:', testError.message);
          console.warn('⚠️ Connection test failed, but continuing with login attempt...');
        }
        // Continue anyway - the actual login will show the real error
      }

      // Create AbortController for login request timeout
      // Increased timeout to 20 seconds for slower networks or initial connection
      const loginController = new AbortController();
      const loginTimeoutId = setTimeout(() => loginController.abort(), 20000); // 20 second timeout
      
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password: trimmedPassword,
        }),
        signal: loginController.signal,
      });
      
      clearTimeout(loginTimeoutId);

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      // Parse response
      const responseText = await response.text();
      let data;
      
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          throw new Error('Invalid response from server');
        }
      } else {
        data = { message: 'No response from server' };
      }

      console.log('Response data:', data);

      // Check if login was successful
      if (response.ok && response.status === 200 && data.token) {
        console.log('Login successful!');
        
        // Check if user has completed profile (has firstName)
        if (data.user?.firstName) {
          // Profile exists, go to HomeScreen
          navigation.navigate('HomeScreen', {
            userName: data.user.firstName || data.user.name || 'User',
            userEmail: normalizedEmail,
          });
        } else {
          // No profile yet, go to ProfileSetup
          navigation.navigate('ProfileSetup', {
            user: {
              email: normalizedEmail,
              name: data.user?.name || data.user?.firstName || 'User',
            },
          });
        }
      } else {
        // Login failed
        const errorMessage = data.message || data.error || 'Invalid email or password';
        console.error('Login failed:', errorMessage);
        Alert.alert('Login Failed', errorMessage);
      }
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error message:', error.message);
      console.error('Error name:', error.name);
      
      let errorMessage = 'An error occurred. Please try again.';
      let errorTitle = 'Error';

      if (error.name === 'AbortError') {
        errorTitle = 'Request Timeout';
        errorMessage = 'The request took too long to complete (20s timeout).\n\n';
        errorMessage += 'Possible causes:\n';
        errorMessage += '1. Backend server is not running\n';
        errorMessage += '   → Start it: cd backend && npm start\n';
        errorMessage += `2. Incorrect API URL: ${API_BASE_URL}\n`;
        errorMessage += '   → Check your IP address in config/api.js\n';
        errorMessage += '3. Device and computer are on different networks\n';
        errorMessage += '   → Ensure both are on the same WiFi\n';
        errorMessage += '4. Firewall blocking port 5000\n';
        errorMessage += '   → Allow port 5000 in Windows Firewall\n';
        errorMessage += '5. Slow network connection\n';
        errorMessage += '   → Try again or check your internet connection';
      } else if (error.message.includes('Network request failed') ||
          error.message.includes('Failed to fetch') ||
          error.message.includes('NetworkError')) {
        errorTitle = 'Connection Error';
        errorMessage = 'Cannot connect to backend server.\n\n';
        errorMessage += 'Please check:\n';
        errorMessage += '1. Backend server is running (cd backend && npm start)\n';
        errorMessage += `2. API URL: ${API_BASE_URL}\n`;
        errorMessage += '3. For Android Emulator: Backend must be on localhost:5000\n';
        errorMessage += '4. For iOS Simulator: Backend must be on localhost:5000\n';
        errorMessage += '5. For Physical Device: Use your computer IP (check api.js)';
      } else if (error.message) {
        errorMessage = error.message;
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
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>Motion Physio</Text>
            <Text style={styles.tagline}>Welcome back</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
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
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter your password"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!isPasswordVisible}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  disabled={loading}
                >
                  <Text style={styles.eyeText}>
                    {isPasswordVisible ? '👁️' : '👁️‍🗨️'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.forgotButton} disabled={loading}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.signupButton}
              onPress={() => navigation.navigate('SignUp')}
              disabled={loading}
            >
              <Text style={styles.signupText}>
                Don't have an account? <Text style={styles.signupLink}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    fontSize: 36,
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
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#333',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: '#fff',
  },
  eyeButton: {
    padding: 16,
  },
  eyeText: {
    fontSize: 20,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    fontSize: 14,
    color: '#999',
  },
  loginButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#666',
  },
  signupButton: {
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
    color: '#999',
  },
  signupLink: {
    color: '#fff',
    fontWeight: '600',
  },
});
