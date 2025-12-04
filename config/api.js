// API Configuration
import { Platform } from 'react-native';

// API Configuration
// IMPORTANT: Update this IP address to your computer's local IP address
// Your current IP: 192.168.0.14 (detected automatically)
// To find your IP manually:
// - Windows: Open CMD and type 'ipconfig', look for IPv4 Address
// - Mac/Linux: Open Terminal and type 'ifconfig' or 'ip addr', look for inet address

const YOUR_COMPUTER_IP = '192.168.0.6'; // Your computer's IP address

let API_BASE_URL;

if (__DEV__) {
  // Development mode
  // FOR PHYSICAL DEVICE TESTING: Use your computer's IP address
  // Make sure your phone and computer are on the same WiFi network
  API_BASE_URL = `http://${YOUR_COMPUTER_IP}:5000/api`;
  
  // Alternative: Platform-specific URLs (uncomment if using emulator/simulator)
  // if (Platform.OS === 'android') {
  //   API_BASE_URL = `http://10.0.2.2:5000/api`; // For Android Emulator
  // } else {
  //   API_BASE_URL = `http://localhost:5000/api`; // For iOS Simulator
  // }
} else {
  // Production mode
  API_BASE_URL = 'https://your-production-url.com/api';
}

export default API_BASE_URL;

