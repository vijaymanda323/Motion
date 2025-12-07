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
    Modal,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRoute } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import API_BASE_URL from './config/api';

export default function ProfileSetup({ navigation }) {
    const route = useRoute();
    const user = route.params?.user;
    const userEmail = user?.email || '';

    const [firstName, setFirstName] = useState('');
    const [surname, setSurname] = useState('');
    const [sex, setSex] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [loading, setLoading] = useState(false);

    // Heart Surgery States
    const [heartSurgery, setHeartSurgery] = useState(null);
    const [heartSurgeryComment, setHeartSurgeryComment] = useState('');
    const [withinSixMonths, setWithinSixMonths] = useState(null);

    // Fractures States
    const [fractures, setFractures] = useState(null);
    const [fracturesComment, setFracturesComment] = useState('');
    const [withinSixMonthsFracture, setWithinSixMonthsFracture] = useState(null);

    const [showSexModal, setShowSexModal] = useState(false);

    // Date Picker states
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateObject, setDateObject] = useState(new Date());

    const sexOptions = ['Male', 'Female', 'Other'];

    const calculateBMI = () => {
        try {
            if (height && weight) {
                const heightInMeters = parseFloat(height) / 100;
                const weightInKg = parseFloat(weight);
                if (heightInMeters > 0 && weightInKg > 0) {
                    const bmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
                    return String(bmi || '--');
                }
            }
        } catch (error) {
            console.error('Error calculating BMI:', error);
        }
        return '--';
    };

    const showDatepicker = () => {
        setShowDatePicker(true);
    };

    const onDateChange = (event, selectedDate) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }

        if (event.type === 'set' && selectedDate) {
            const currentDate = selectedDate;
            setDateObject(currentDate);

            const day = String(currentDate.getDate()).padStart(2, '0');
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const year = currentDate.getFullYear();
            setBirthDate(`${day}-${month}-${year}`);
        }
    };

    // 🎯 MODIFIED: Save profile data to backend and navigate
    const handleSubmit = async () => {
        if (!firstName || !surname || !sex || !birthDate || !height || !weight) {
            Alert.alert('Error', 'Please fill in all required personal and metric fields');
            return;
        }

        // Validation for Heart Surgery
        if (heartSurgery === true && withinSixMonths === null) {
            Alert.alert('Error', 'Please answer the follow-up question about heart surgery (within last 6 months).');
            return;
        }

        // Validation for Fractures
        if (fractures === true && withinSixMonthsFracture === null) {
            Alert.alert('Error', 'Please answer the follow-up question about fractures (still recovering).');
            return;
        }

        if (heartSurgery === null || fractures === null) {
            Alert.alert('Error', 'Please answer all medical history questions');
            return;
        }

        if (!userEmail) {
            Alert.alert('Error', 'User email not found. Please login again.');
            return;
        }

        setLoading(true);

        try {
            // Prepare profile data
            const profileData = {
                email: userEmail.trim().toLowerCase(),
                firstName: firstName.trim(),
                surname: surname.trim(),
                sex: sex,
                birthDate: birthDate,
                height: parseFloat(height) || 0,
                weight: parseFloat(weight) || 0,
                heartSurgery: heartSurgery,
                withinSixMonths: withinSixMonths,
                heartSurgeryComment: heartSurgeryComment.trim() || '',
                fractures: fractures,
                withinSixMonthsFracture: withinSixMonthsFracture,
                fracturesComment: fracturesComment.trim() || '',
            };

            console.log('Saving profile data:', profileData);

            // Save to backend
            const response = await fetch(`${API_BASE_URL}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profileData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = 'Failed to save profile';
                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    errorMessage = errorText || `Server error: ${response.status}`;
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log('Profile saved successfully:', data);

            // Navigate to HomeScreen with user data
            navigation.navigate('HomeScreen', {
                userName: firstName,
                userEmail: userEmail,
            });

        } catch (error) {
            console.error('Error saving profile:', error);
            Alert.alert('Error', error.message || 'Failed to save profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    // 🎯 END MODIFIED

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.logo}>MOTION+</Text>
                        <Text style={styles.subtitle}>PHYSIO & WELLNESS</Text>
                    </View>

                    {/* Profile Setup Title */}
                    <View style={styles.titleContainer}>
                        <View style={styles.titleBar} />
                        <Text style={styles.title}>Profile Setup</Text>
                    </View>

                    {/* Personal Details - Two-Column Layouts */}
                    <View style={styles.section}>
                        {/* First Name and Surname Row */}
                        <View style={styles.row}>
                            <View style={styles.inputGroupHalf}>
                                <Text style={styles.label}>First Name</Text>
                                <TextInput
                                    style={styles.input}
                                    value={firstName}
                                    onChangeText={setFirstName}
                                />
                            </View>
                            <View style={styles.inputGroupHalf}>
                                <Text style={styles.label}>Surname</Text>
                                <TextInput
                                    style={styles.input}
                                    value={surname}
                                    onChangeText={setSurname}
                                />
                            </View>
                        </View>

                        {/* Sex and Birth Date Row */}
                        <View style={styles.row}>
                            <View style={styles.inputGroupHalf}>
                                <Text style={styles.label}>Sex</Text>
                                <TouchableOpacity
                                    style={styles.dropdown}
                                    onPress={() => setShowSexModal(true)}
                                >
                                    <Text style={[styles.dropdownText, !sex && styles.placeholderText]}>
                                        {sex ? String(sex) : 'Select'}
                                    </Text>
                                    <Text style={styles.dropdownArrow}>▼</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.inputGroupHalf}>
                                <Text style={styles.label}>Birth Date</Text>
                                <View style={styles.dateInputContainer}>
                                    <TextInput
                                        style={styles.dateInput}
                                        placeholder="dd-mm-yyyy"
                                        value={birthDate}
                                        editable={false}
                                    />
                                    <TouchableOpacity onPress={showDatepicker}>
                                        <Feather name="calendar" size={20} color="#555" style={styles.calendarIcon} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* DATE PICKER COMPONENT */}
                    {showDatePicker && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={dateObject}
                            mode={'date'}
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={onDateChange}
                            maximumDate={new Date()}
                        />
                    )}

                    {/* Metrics Card */}
                    <View style={styles.metricsCard}>
                        <View style={styles.metricsRow}>
                            <View style={styles.metricInput}>
                                <Text style={styles.metricLabel}>H (cm)</Text>
                                <TextInput
                                    style={styles.metricInputField}
                                    placeholder="0"
                                    value={height}
                                    onChangeText={setHeight}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={styles.metricInput}>
                                <Text style={styles.metricLabel}>W (kg)</Text>
                                <TextInput
                                    style={styles.metricInputField}
                                    placeholder="0"
                                    value={weight}
                                    onChangeText={setWeight}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={styles.bmiDisplay}>
                                <Text style={styles.bmiValueSmall}>--</Text>
                                <Text style={styles.bmiValueSmall}>{String(calculateBMI())}</Text>
                            </View>
                        </View>
                        <View style={styles.metricsFooter}>
                            <View style={styles.metricsLabelContainer}>
                                <Text style={styles.metricsText}>METRICS</Text>
                            </View>
                            <View style={styles.metricsLabelContainer}>
                                <Text style={styles.metricsText}>BMI SCORE</Text>
                            </View>
                        </View>
                    </View>

                    {/* Medical History */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>MEDICAL HISTORY</Text>

                        {/* Heart Surgery Question */}
                        <View style={styles.medicalQuestion}>
                            <View style={styles.medicalQuestionRow}>
                                <Text style={styles.questionText}>Heart Surgery?</Text>
                                <View style={styles.toggleContainer}>
                                    <TouchableOpacity
                                        style={[
                                            styles.toggleButton,
                                            heartSurgery === true && styles.toggleButtonActive,
                                        ]}
                                        onPress={() => {
                                            setHeartSurgery(true);
                                            setHeartSurgeryComment('');
                                        }}
                                    >
                                        <Text
                                            style={[
                                                styles.toggleText,
                                                heartSurgery === true && styles.toggleTextActive,
                                            ]}
                                        >
                                            Yes
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            styles.toggleButton,
                                            heartSurgery === false && styles.toggleButtonActive,
                                        ]}
                                        onPress={() => {
                                            setHeartSurgery(false);
                                            setWithinSixMonths(null);
                                            setHeartSurgeryComment('');
                                        }}
                                    >
                                        <Text
                                            style={[
                                                styles.toggleText,
                                                heartSurgery === false && styles.toggleTextActive,
                                            ]}
                                        >
                                            No
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* NESTED QUESTION BOX (If Heart Surgery is Yes) */}
                            {heartSurgery === true && (
                                <View style={styles.nestedQuestionContainer}>
                                    <Text style={styles.nestedQuestionText}>Within last 6 months?</Text>
                                    <View style={styles.nestedToggleContainer}>
                                        <TouchableOpacity
                                            style={[
                                                styles.nestedToggleButton,
                                                withinSixMonths === true && styles.nestedToggleButtonActive,
                                            ]}
                                            onPress={() => setWithinSixMonths(true)}
                                        >
                                            <Text
                                                style={[
                                                    styles.nestedToggleText,
                                                    withinSixMonths === true && styles.nestedToggleTextActive,
                                                ]}
                                            >
                                                Yes
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[
                                                styles.nestedToggleButton,
                                                withinSixMonths === false && styles.nestedToggleButtonActive,
                                            ]}
                                            onPress={() => setWithinSixMonths(false)}
                                        >
                                            <Text
                                                style={[
                                                    styles.nestedToggleText,
                                                    withinSixMonths === false && styles.nestedToggleTextActive,
                                                ]}
                                            >
                                                No
                                            </Text>
                                        </TouchableOpacity>
                                    </View>

                                    {/* Description input shown only if nested question is answered */}
                                    {withinSixMonths !== null && (
                                        <TextInput
                                            style={[styles.input, styles.commentInput, styles.descriptionInputBox]}
                                            placeholder={"Please describe details..."}
                                            value={heartSurgeryComment}
                                            onChangeText={setHeartSurgeryComment}
                                            multiline={true}
                                            numberOfLines={3}
                                        />
                                    )}
                                </View>
                            )}
                        </View>

                        {/* Fractures Question */}
                        <View style={styles.medicalQuestion}>
                            <View style={styles.medicalQuestionRow}>
                                <Text style={styles.questionText}>Fractures?</Text>
                                <View style={styles.toggleContainer}>
                                    <TouchableOpacity
                                        style={[
                                            styles.toggleButton,
                                            fractures === true && styles.toggleButtonActive,
                                        ]}
                                        onPress={() => {
                                            setFractures(true);
                                            setFracturesComment('');
                                        }}
                                    >
                                        <Text
                                            style={[
                                                styles.toggleText,
                                                fractures === true && styles.toggleTextActive,
                                            ]}
                                        >
                                            Yes
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            styles.toggleButton,
                                            fractures === false && styles.toggleButtonActive,
                                        ]}
                                        onPress={() => {
                                            setFractures(false);
                                            setWithinSixMonthsFracture(null);
                                            setFracturesComment('');
                                        }}
                                    >
                                        <Text
                                            style={[
                                                styles.toggleText,
                                                fractures === false && styles.toggleTextActive,
                                            ]}
                                        >
                                            No
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* NESTED QUESTION BOX (If Fractures is Yes) */}
                            {fractures === true && (
                                <View style={styles.nestedQuestionContainer}>
                                    <Text style={styles.nestedQuestionText}>Still recovering or within last 6 months?</Text>
                                    <View style={styles.nestedToggleContainer}>
                                        <TouchableOpacity
                                            style={[
                                                styles.nestedToggleButton,
                                                withinSixMonthsFracture === true && styles.nestedToggleButtonActive,
                                            ]}
                                            onPress={() => setWithinSixMonthsFracture(true)}
                                        >
                                            <Text
                                                style={[
                                                    styles.nestedToggleText,
                                                    withinSixMonthsFracture === true && styles.nestedToggleTextActive,
                                                ]}
                                            >
                                                Yes
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[
                                                styles.nestedToggleButton,
                                                withinSixMonthsFracture === false && styles.nestedToggleButtonActive,
                                            ]}
                                            onPress={() => setWithinSixMonthsFracture(false)}
                                        >
                                            <Text
                                                style={[
                                                    styles.nestedToggleText,
                                                    withinSixMonthsFracture === false && styles.nestedToggleTextActive,
                                                ]}
                                            >
                                                No
                                            </Text>
                                        </TouchableOpacity>
                                    </View>

                                    {/* Description input shown only if nested question is answered */}
                                    {withinSixMonthsFracture !== null && (
                                        <TextInput
                                            style={[styles.input, styles.commentInput, styles.descriptionInputBox]}
                                            placeholder={"Please describe details of the fracture(s)..."}
                                            value={fracturesComment}
                                            onChangeText={setFracturesComment}
                                            multiline={true}
                                            numberOfLines={3}
                                        />
                                    )}
                                </View>
                            )}
                            {/* Comment box shown only if Fractures is No */}
                            {fractures === false && (
                                <TextInput
                                    style={[styles.input, styles.commentInput]}
                                    placeholder={"Comment (optional)"}
                                    value={fracturesComment}
                                    onChangeText={setFracturesComment}
                                    multiline={true}
                                    numberOfLines={2}
                                />
                            )}
                        </View>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity 
                        style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.submitButtonText}>Submit & Start</Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>

                {/* Sex Selection Modal (Unchanged) */}
                <Modal
                    visible={showSexModal}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setShowSexModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Select Sex</Text>
                            <FlatList
                                data={sexOptions}
                                keyExtractor={(item) => item}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.modalOption}
                                        onPress={() => {
                                            setSex(item);
                                            setShowSexModal(false);
                                        }}
                                    >
                                        <Text style={styles.modalOptionText}>{item}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                            <TouchableOpacity
                                style={styles.modalCloseButton}
                                onPress={() => setShowSexModal(false)}
                            >
                                <Text style={styles.modalCloseText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },

    // Header Styles (centered)
    header: {
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 30,
    },
    logo: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#0A84FF',
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 12,
        color: '#0A84FF',
        marginTop: 4,
        letterSpacing: 0.5,
        textAlign: 'center',
    },

    // Profile Setup Title Bar
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    titleBar: {
        width: 4,
        height: 24,
        backgroundColor: '#0A84FF',
        marginRight: 10,
        borderRadius: 2,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },

    section: {
        marginBottom: 20,
    },

    // 🌟 Layout Styles
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    inputGroupHalf: {
        flex: 1,
        marginRight: 10,
    },

    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#555',
        marginBottom: 8,
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },

    // Dropdown/Sex Input
    dropdown: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownText: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    placeholderText: {
        color: '#aaa',
    },
    dropdownArrow: {
        fontSize: 12,
        color: '#999',
    },

    // Date Input
    dateInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 15,
        backgroundColor: '#f9f9f9',
    },
    dateInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    calendarIcon: {
        paddingLeft: 10,
    },

    // Metrics Card
    metricsCard: {
        backgroundColor: '#E6F3FF',
        borderRadius: 15,
        padding: 20,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    metricsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    metricInput: {
        flex: 2,
        marginRight: 10,
    },
    bmiDisplay: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    metricLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0A84FF',
        marginBottom: 5,
    },
    metricInputField: {
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#C0DFFF',
    },
    bmiValueSmall: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0A84FF',
        height: 50,
        lineHeight: 50,
        textAlign: 'center',
    },
    metricsFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#C0DFFF',
    },
    metricsLabelContainer: {
        flex: 1.5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    metricsText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0A84FF',
        marginRight: 5,
    },

    // Medical History
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    medicalQuestion: {
        marginBottom: 20,
    },
    medicalQuestionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    questionText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
        flex: 1,
    },
    toggleContainer: {
        flexDirection: 'row',
        width: 120,
    },
    toggleButton: {
        flex: 1,
        height: 38,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 3,
        backgroundColor: '#f0f0f0',
        borderColor: '#ddd',
        borderWidth: 1,
    },
    toggleButtonActive: {
        backgroundColor: '#0A84FF',
        borderColor: '#0A84FF',
    },
    toggleText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#555',
    },
    toggleTextActive: {
        color: '#fff',
    },
    commentInput: {
        marginTop: 10,
        height: 80,
        textAlignVertical: 'top',
        paddingTop: 12,
    },

    // NESTED QUESTION STYLES
    nestedQuestionContainer: {
        marginTop: 5,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#0A84FF',
    },
    nestedQuestionText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#555',
        marginBottom: 10,
    },
    nestedToggleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    nestedToggleButton: {
        flex: 1,
        height: 38,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
        backgroundColor: '#f0f0f0',
        borderColor: '#ddd',
        borderWidth: 1,
    },
    nestedToggleButtonActive: {
        backgroundColor: '#D9E8FF',
        borderColor: '#0A84FF',
    },
    nestedToggleText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0A84FF',
    },
    nestedToggleTextActive: {
        color: '#0A84FF',
    },
    descriptionInputBox: {
        height: 100,
        borderColor: '#ccc',
    },

    // Submit Button
    submitButton: {
        backgroundColor: '#1E2A3A',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '50%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: '#333',
    },
    modalOption: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalOptionText: {
        fontSize: 16,
        color: '#333',
    },
    modalCloseButton: {
        marginTop: 20,
        paddingVertical: 12,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalCloseText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0A84FF',
    },
});