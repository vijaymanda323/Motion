

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import API_BASE_URL from './config/api';

// 🌟 CORRECTED COMPONENT: Now displays both label and value
const ProfileRow = ({ label, value, editable, editValue, onEditChange, placeholder }) => {
    // Ensure value is always a string (never undefined/null)
    const safeValue = value != null ? String(value) : '';
    const safeLabel = label != null ? String(label) : '';
    
    return (
        <View style={styles.row}>
            {/* Added Label Text */}
            <Text style={styles.labelText}>{safeLabel}</Text> 
            {editable ? (
                <TextInput
                    style={styles.editInput}
                    value={editValue}
                    onChangeText={onEditChange}
                    placeholder={placeholder || safeValue}
                    placeholderTextColor="#999"
                />
            ) : (
                <Text style={styles.valueText}>{safeValue}</Text>
            )}
        </View>
    );
};

export default function AboutYouScreen({ navigation }) {
    const route = useRoute();
    const userEmailFromParams = route.params?.userEmail;
    
    const [profileData, setProfileData] = useState({
        height: '',
        weight: '',
        birthday: '',
        sex: '',
        displayName: '',
        location: 'Choose country',
        bio: 'Share your fitness goals',
        accountCreated: '',
        id: '',
        birthDate: '', // Store raw date for editing
        heightValue: '', // Store numeric value
        weightValue: '', // Store numeric value
    });
    const [loading, setLoading] = useState(true);
    const [editingProfile, setEditingProfile] = useState(false);
    const [editingSocial, setEditingSocial] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editForm, setEditForm] = useState({
        height: '',
        weight: '',
        birthDate: '',
        sex: '',
        displayName: '',
        location: '',
        bio: '',
    });

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        // Get email from params (required)
        const email = userEmailFromParams;
        
        if (!email) {
            console.warn('No email provided to AboutYouScreen');
            setLoading(false);
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/users/profile/${email}`);
            const data = await response.json();
            
            if (response.ok && data.user) {
                const user = data.user;
                
                // Format birth date
                let birthdayFormatted = '';
                if (user.birthDate) {
                    const birthDate = new Date(user.birthDate);
                    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                                   'July', 'August', 'September', 'October', 'November', 'December'];
                    birthdayFormatted = `${months[birthDate.getMonth()]} ${birthDate.getDate()}, ${birthDate.getFullYear()}`;
                }
                
                // Format account created date
                let accountCreatedFormatted = '';
                if (user.createdAt) {
                    const createdDate = new Date(user.createdAt);
                    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                                   'July', 'August', 'September', 'October', 'November', 'December'];
                    accountCreatedFormatted = `${months[createdDate.getMonth()]} ${createdDate.getDate()}, ${createdDate.getFullYear()}`;
                }
                
                setProfileData({
                    height: user.height ? `${user.height} cm` : '',
                    weight: user.weight ? `${user.weight} kg` : '',
                    birthday: birthdayFormatted,
                    sex: user.gender || '',
                    displayName: user.firstName || user.name || '',
                    location: 'Choose country',
                    bio: 'Share your fitness goals',
                    accountCreated: accountCreatedFormatted,
                    id: user.id || user._id?.toString().substring(0, 6).toUpperCase() || '',
                    birthDate: user.birthDate || '',
                    heightValue: user.height || '',
                    weightValue: user.weight || '',
                });
                
                // Initialize edit form
                setEditForm({
                    height: user.height ? String(user.height) : '',
                    weight: user.weight ? String(user.weight) : '',
                    birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
                    sex: user.gender || '',
                    displayName: user.firstName || user.name || '',
                    location: 'Choose country',
                    bio: 'Share your fitness goals',
                });
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditProfile = () => {
        setEditingProfile(true);
    };

    const handleEditSocial = () => {
        setEditingSocial(true);
    };

    const handleCancelEdit = () => {
        setEditingProfile(false);
        setEditingSocial(false);
        // Reset form to original values
        setEditForm({
            height: profileData.heightValue ? String(profileData.heightValue) : '',
            weight: profileData.weightValue ? String(profileData.weightValue) : '',
            birthDate: profileData.birthDate ? new Date(profileData.birthDate).toISOString().split('T')[0] : '',
            sex: profileData.sex || '',
            displayName: profileData.displayName || '',
            location: profileData.location || 'Choose country',
            bio: profileData.bio || 'Share your fitness goals',
        });
    };

    const handleSaveProfile = async () => {
        if (!userEmailFromParams) {
            Alert.alert('Error', 'User email not found');
            return;
        }

        setSaving(true);
        try {
            const profileDataToSave = {
                email: userEmailFromParams.trim().toLowerCase(),
                firstName: editForm.displayName.trim(),
                height: parseFloat(editForm.height) || 0,
                weight: parseFloat(editForm.weight) || 0,
                sex: editForm.sex,
                birthDate: editForm.birthDate || undefined,
            };

            const response = await fetch(`${API_BASE_URL}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profileDataToSave),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update profile');
            }

            // Refresh profile data
            await fetchUserProfile();
            setEditingProfile(false);
            Alert.alert('Success', 'Profile updated successfully');
        } catch (error) {
            console.error('Error saving profile:', error);
            Alert.alert('Error', error.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveSocial = async () => {
        // For now, social profile fields (location, bio) might not be in backend
        // We'll save displayName which is firstName in backend
        if (!userEmailFromParams) {
            Alert.alert('Error', 'User email not found');
            return;
        }

        setSaving(true);
        try {
            const profileDataToSave = {
                email: userEmailFromParams.trim().toLowerCase(),
                firstName: editForm.displayName.trim(),
            };

            const response = await fetch(`${API_BASE_URL}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profileDataToSave),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update profile');
            }

            // Update local state for display
            setProfileData(prev => ({
                ...prev,
                displayName: editForm.displayName,
                location: editForm.location,
                bio: editForm.bio,
            }));

            setEditingSocial(false);
            Alert.alert('Success', 'Social profile updated successfully');
        } catch (error) {
            console.error('Error saving social profile:', error);
            Alert.alert('Error', error.message || 'Failed to update social profile');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: () => {
                        // Navigate to Login screen and reset navigation stack
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        });
                    },
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>About you</Text>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0A84FF" />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Profile Information Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Profile information</Text>
                    {!editingProfile ? (
                        <TouchableOpacity onPress={handleEditProfile}>
                            <Text style={styles.editButton}>Edit</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.editActions}>
                            <TouchableOpacity onPress={handleCancelEdit} disabled={saving}>
                                <Text style={styles.cancelButton}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSaveProfile} disabled={saving}>
                                {saving ? (
                                    <ActivityIndicator size="small" color="#0A84FF" />
                                ) : (
                                    <Text style={styles.saveButton}>Save</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                <Text style={styles.description}>
                    The profile information you share is used to calculate some metrics and personalize your experience
                </Text>

                <View style={styles.card}>
                    {/* Height */}
                    <ProfileRow 
                        label="Height" 
                        value={profileData.height} 
                        editable={editingProfile}
                        editValue={editForm.height}
                        onEditChange={(text) => setEditForm(prev => ({ ...prev, height: text }))}
                        placeholder="Enter height in cm"
                    />
                    <View style={styles.divider} />
                    
                    {/* Weight */}
                    <ProfileRow 
                        label="Weight" 
                        value={profileData.weight} 
                        editable={editingProfile}
                        editValue={editForm.weight}
                        onEditChange={(text) => setEditForm(prev => ({ ...prev, weight: text }))}
                        placeholder="Enter weight in kg"
                    />
                    <View style={styles.divider} />

                    {/* Birthday */}
                    <ProfileRow 
                        label="Birthday" 
                        value={profileData.birthday} 
                        editable={editingProfile}
                        editValue={editForm.birthDate}
                        onEditChange={(text) => setEditForm(prev => ({ ...prev, birthDate: text }))}
                        placeholder="YYYY-MM-DD"
                    />
                    <View style={styles.divider} />
                    
                    {/* Sex */}
                    <ProfileRow 
                        label="Sex" 
                        value={profileData.sex} 
                        editable={editingProfile}
                        editValue={editForm.sex}
                        onEditChange={(text) => setEditForm(prev => ({ ...prev, sex: text }))}
                        placeholder="Male, Female, Other"
                    />
                </View>

                {/* Social Profile Section */}
                <View style={[styles.sectionHeader, { marginTop: 20 }]}>
                    <Text style={styles.sectionTitle}>Social profile</Text>
                    {!editingSocial ? (
                        <TouchableOpacity onPress={handleEditSocial}>
                            <Text style={styles.editButton}>Edit</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.editActions}>
                            <TouchableOpacity onPress={handleCancelEdit} disabled={saving}>
                                <Text style={styles.cancelButton}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSaveSocial} disabled={saving}>
                                {saving ? (
                                    <ActivityIndicator size="small" color="#0A84FF" />
                                ) : (
                                    <Text style={styles.saveButton}>Save</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
                
                {/* Added Description for Social Profile */}
                <Text style={styles.description}>
                   Your profile lets you share movement progress and streaks with friends for motivation and accountability, while controlling your privacy settings.
                </Text>

                <View style={styles.card}>
                    {/* Display Name */}
                    <ProfileRow 
                        label="Display name" 
                        value={profileData.displayName} 
                        editable={editingSocial}
                        editValue={editForm.displayName}
                        onEditChange={(text) => setEditForm(prev => ({ ...prev, displayName: text }))}
                        placeholder="Enter display name"
                    />
                    <View style={styles.divider} />
                    
                    {/* Location */}
                    <ProfileRow 
                        label="Location" 
                        value={profileData.location} 
                        editable={editingSocial}
                        editValue={editForm.location}
                        onEditChange={(text) => setEditForm(prev => ({ ...prev, location: text }))}
                        placeholder="Enter location"
                    />
                    <View style={styles.divider} />

                    {/* Your bio */}
                    <View style={styles.row}>
                        <Text style={styles.labelText}>Your bio</Text>
                        {editingSocial ? (
                            <TextInput
                                style={[styles.editInput, styles.bioInput]}
                                value={editForm.bio}
                                onChangeText={(text) => setEditForm(prev => ({ ...prev, bio: text }))}
                                placeholder="Share your fitness goals"
                                placeholderTextColor="#999"
                                multiline
                                numberOfLines={3}
                            />
                        ) : (
                            <Text style={styles.valueText}>{profileData.bio}</Text>
                        )}
                    </View>
                    <View style={styles.divider} />
                    
                    <TouchableOpacity style={styles.privacyButton}>
                        <Text style={styles.privacyButtonText}>Community & Sharing privacy</Text>
                    </TouchableOpacity>
                </View>

                {/* Account Section */}
                <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Your account</Text>
                
                <View style={styles.card}>
                    {/* Account created - Label passed correctly */}
                    <ProfileRow label="Account created" value={profileData.accountCreated} />
                    <View style={styles.divider} />
                    
                    {/* ID - Label passed correctly */}
                    <ProfileRow label="ID" value={profileData.id} />
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Feather name="log-out" size={20} color="#ff4444" />
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
                
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 15,
        color: '#333',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 50,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    editButton: {
        color: '#0A84FF',
        fontSize: 16,
        fontWeight: '600',
    },
    editActions: {
        flexDirection: 'row',
        gap: 15,
        alignItems: 'center',
    },
    cancelButton: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
    },
    saveButton: {
        color: '#0A84FF',
        fontSize: 16,
        fontWeight: '600',
    },
    editInput: {
        fontSize: 16,
        color: '#333',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        marginTop: 5,
        backgroundColor: '#f9f9f9',
    },
    bioInput: {
        minHeight: 60,
        textAlignVertical: 'top',
    },
    // 🌟 Adjusted description style for better flow in the Social Profile section
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 15,
        lineHeight: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#eee',
        marginBottom: 10,
    },
    row: {
        // 🌟 Adjusted vertical padding for two lines of text
        paddingVertical: 10, 
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    labelText: {
        fontSize: 12,
        color: '#999',
        // 🌟 Add margin bottom to separate label from value
        marginBottom: 2, 
    },
    valueText: {
        fontSize: 16,
        color: '#333',
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginLeft: 20,
    },
    privacyButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: '#e6f0ff',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginTop: 15,
        marginBottom: 10,
        marginLeft: 20,
    },
    privacyButtonText: {
        color: '#0A84FF',
        fontWeight: '600',
        fontSize: 14,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ff4444',
        marginTop: 20,
        marginBottom: 20,
    },
    logoutButtonText: {
        color: '#ff4444',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10,
    },
});

