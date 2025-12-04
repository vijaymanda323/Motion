import API_BASE_URL from '../config/api';
import { Platform } from 'react-native';

/**
 * Test if the backend server is reachable
 * @returns {Promise<{success: boolean, message: string, details?: any}>}
 */
export const testServerConnection = async () => {
  try {
    const baseUrl = API_BASE_URL.replace('/api', '');
    console.log('Testing connection to:', baseUrl);
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(baseUrl, {
      method: 'GET',
      signal: controller.signal,
    });
    
    clearTimeout(timeout);
    
    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        message: 'Server is reachable',
        details: data
      };
    } else {
      return {
        success: false,
        message: `Server responded with status: ${response.status}`
      };
    }
  } catch (error) {
    console.error('Connection test error:', error);
    return {
      success: false,
      message: error.message || 'Cannot connect to server',
      details: {
        name: error.name,
        message: error.message,
        API_URL: API_BASE_URL,
        Platform: Platform.OS
      }
    };
  }
};

/**
 * Get connection troubleshooting info
 */
export const getConnectionInfo = () => {
  return {
    API_BASE_URL,
    Platform: Platform.OS,
    TestURL: API_BASE_URL.replace('/api', ''),
    RegisterURL: `${API_BASE_URL}/users/register`,
  };
};

