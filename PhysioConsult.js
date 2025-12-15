import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Image} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function PhysioConsult() {
    const navigation = useNavigation();
    const route = useRoute();
    const { userName, userEmail, painLevel, comfortLevel, selectedCount } = route.params || {};

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Physio Consult</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Find & Consult Physio</Text>
                {painLevel !== undefined && (
                    <View style={styles.infoCard}>
                        <Text style={styles.infoText}>Pain Level: {painLevel}/10</Text>
                        {comfortLevel !== undefined && (
                            <Text style={styles.infoText}>Comfort Level: {comfortLevel}/10</Text>
                        )}
                        {selectedCount !== undefined && (
                            <Text style={styles.infoText}>Selected Areas: {selectedCount}</Text>
                        )}
                    </View>
                )}
                <Text style={styles.subtitle}>Available Physios Near you</Text>
                
                {/* Physio Card 1 */}
                <View style={styles.physioCard}>
                    <View style={styles.profileImageContainer}>
                        <View style={styles.profileImagePlaceholder}>
                        <Image source={require('./assets/images/Hamza.png')} 
                            style={styles.profileImage} />
                        </View>
                    </View>
                    <View style={styles.rightContent}>
                        <View style={styles.physioInfo}>
                            <Text style={styles.physioName}>Dr. Hamza Tariq</Text>
                            <Text style={styles.physioSpecialization}>Senior Surgeon</Text>
                            <View style={styles.availabilityRow}>
                                <Ionicons name="time-outline" size={14} color="#666" />
                                <Text style={styles.availabilityText}>10:30 AM-3:30 PM</Text>
                            </View>
                            <Text style={styles.feeText}>Fee: Rs.1200</Text>
                        </View>
                        <View style={styles.ratingAndAction}>
                            <View style={styles.ratingContainer}>
                                <Ionicons name="star" size={16} color="#FFD700" />
                                <Text style={styles.ratingText}>4.9</Text>
                            </View>
                            <TouchableOpacity style={styles.actionButton}>
                                <Ionicons name="arrow-forward" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Physio Card 2 */}
                <View style={styles.physioCard}>
                    <View style={styles.profileImageContainer}>
                        <View style={styles.profileImagePlaceholder}>
                            <Image source={require('./assets/images/PhysioDoctor.png')} 
                            style={styles.profileImage} />
            
                        </View>
                    </View>
                    <View style={styles.rightContent}>
                        <View style={styles.physioInfo}>
                            <Text style={styles.physioName}>Dr. Alice</Text>
                            <Text style={styles.physioSpecialization}>Senior Surgeon</Text>
                            <View style={styles.availabilityRow}>
                                <Ionicons name="time-outline" size={14} color="#666" />
                                <Text style={styles.availabilityText}>10:30 AM-3:30 PM</Text>
                            </View>
                            <Text style={styles.feeText}>Fee: Rs.1200</Text>
                        </View>
                        <View style={styles.ratingAndAction}>
                            <View style={styles.ratingContainer}>
                                <Ionicons name="star" size={16} color="#FFD700" />
                                <Text style={styles.ratingText}>5.0</Text>
                            </View>
                            <TouchableOpacity style={styles.actionButton}>
                                <Ionicons name="arrow-forward" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Physio Card 3 - Using your data */}
                <View style={styles.physioCard}>
                    <View style={styles.profileImageContainer}>
                        <View style={styles.profileImagePlaceholder}>
                        <Image source={require('./assets/images/phsyioVijay.jpg')} 
                            style={styles.profileImage} />
                        </View>
                    </View>
                    <View style={styles.rightContent}>
                        <View style={styles.physioInfo}>
                            <Text style={styles.physioName}>Dr. Vijay</Text>
                            <Text style={styles.physioSpecialization}>Orthopedic Surgeon</Text>
                            <View style={styles.availabilityRow}>
                                <Ionicons name="time-outline" size={14} color="#666" />
                                <Text style={styles.availabilityText}>9:00 AM-5:00 PM</Text>
                            </View>
                            <Text style={styles.feeText}>Fee: Rs.1500</Text>
                        </View>
                        <View style={styles.ratingAndAction}>
                            <View style={styles.ratingContainer}>
                                <Ionicons name="star" size={16} color="#FFD700" />
                                <Text style={styles.ratingText}>4.8</Text>
                            </View>
                            <TouchableOpacity style={styles.actionButton}>
                                <Ionicons name="arrow-forward" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
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
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        flex: 1,
        textAlign: 'center',
    },
    headerRight: {
        width: 40,
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 20,
        color: '#666',
        marginTop: 20,
    },
    infoCard: {
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        marginTop: 20,
    },
    infoText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,

    },
    physioCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        marginTop: 20,
    },
    profileImageContainer: {
        marginRight: 16,
    },
    rightContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    physioInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    physioName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    physioSpecialization: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    availabilityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    availabilityText: {
        fontSize: 13,
        color: '#666',
        marginLeft: 4,
    },
    feeText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    ratingAndAction: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingLeft: 12,
        minHeight: 70,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    ratingText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        marginLeft: 4,
    },
    actionButton: {
        width: 44,
        height: 44,
        borderRadius: 8,
        backgroundColor: '#1a1a1a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 35,
    },
});