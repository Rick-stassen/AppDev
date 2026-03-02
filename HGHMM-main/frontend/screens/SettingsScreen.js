import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Switch, TextInput, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OfflineStorage } from '../utils/offlineStorage';
import Name from './Introscreens/Name';
import ApiService from '../services/api';

const BackArrow = ({ color = "#fff", size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth="2">
        <Path d="M15 18l-6-6 6-6" />
    </Svg>
);

const SettingsScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [isEditing, setIsEditing] = useState(false);
    const [userName, setUserName] = useState(route.params?.userName || '');
    const [userId, setUserId] = useState(null);
    const [newName, setNewName] = useState('');
    const [pushNotifications, setPushNotifications] = useState(false);
    const [wistJeDat, setWistJeDat] = useState(false); // Default to false
    const [sounds, setSounds] = useState(false);
    const [isOffline, setIsOffline] = useState(false);

    // Load userId on mount
    useEffect(() => {
        const initializeUserId = async () => {
            try {
                // Try route params first
                if (route.params?.userId) {
                    setUserId(Number(route.params.userId));
                    return;
                }
                
                // Fall back to AsyncStorage
                const storedId = await AsyncStorage.getItem('userId');
                if (storedId) {
                    setUserId(Number(storedId));
                } else {
                    // No user ID found anywhere, redirect to welcome
                    await AsyncStorage.clear();
                    await OfflineStorage.clearPendingData();
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'WelkomSlide' }]
                    });
                }
            } catch (error) {
                console.error('Error initializing userId:', error);
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'WelkomSlide' }]
                });
            }
        };
        
        initializeUserId();
    }, []);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                // If we don't have userId from route params, try to get it from storage
                if (!userId) {
                    return; // Skip if no userId
                }

                const settings = await ApiService.getUserSettings(Number(userId));
                setPushNotifications(settings.push_notifications);
                setWistJeDat(settings.wist_je_dat);
                setSounds(settings.sounds);
            } catch (error) {
                console.error('Error loading settings:', error);
                setIsOffline(true);
                // Load settings from local storage as fallback
                const localSettings = await AsyncStorage.getItem('userSettings');
                if (localSettings) {
                    const settings = JSON.parse(localSettings);
                    setPushNotifications(settings.push_notifications);
                    setWistJeDat(settings.wist_je_dat);
                    setSounds(settings.sounds);
                }
            }
        };

        if (userId) {
            loadSettings();
        }
    }, [userId]);

    const handleSaveName = async () => {
        if (!newName.trim()) {
            Alert.alert('Error', 'Vul alstublieft een naam in');
            return;
        }

        try {
            if (!userId) {
                throw new Error('No user ID found');
            }

            // Update name in backend
            await ApiService.updateUser(userId, { name: newName.trim() });

            // Update local storage
            await AsyncStorage.setItem('userName', newName);
            await AsyncStorage.setItem('userId', userId.toString());  // Ensure userId is stored
            setUserName(newName);
            setIsEditing(false);
            setNewName('');

            // Reset navigation stack with the new name
            navigation.reset({
                index: 0,
                routes: [
                    {
                        name: 'HomeScreen',
                        params: { 
                            userName: newName,
                            userId: userId,
                            role: route.params?.role 
                        }
                    }
                ],
            });

            Alert.alert('Succes', 'Je naam is aangepast');
        } catch (error) {
            console.error('Error saving name:', error);
            Alert.alert(
                'Fout',
                'Er ging iets mis bij het opslaan van je naam. Probeer het later opnieuw.',
                [{ text: 'OK' }]
            );
        }
    };

    const handleWistJeDatToggle = async (value) => {
        try {
            setWistJeDat(value);
            const settings = {
                user_id: userId,  // Add user_id to settings
                push_notifications: pushNotifications,
                wist_je_dat: value,
                sounds: sounds
            };

            // Save to local storage first
            await AsyncStorage.setItem('userSettings', JSON.stringify(settings));

            if (userId) {
                await ApiService.updateUserSettings(Number(userId), settings);
            }
        } catch (error) {
            console.error('Error saving wistJeDat:', error);
            setIsOffline(true);
        }
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Account verwijderen',
            'Weet je zeker dat je je account wilt verwijderen? Dit kan niet ongedaan worden gemaakt.',
            [
                {
                    text: 'Annuleren',
                    style: 'cancel'
                },
                {
                    text: 'Verwijderen',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // Try to delete from server if we have a userId
                            if (userId) {
                                try {
                                    await ApiService.deleteUser(userId);
                                } catch (error) {
                                    console.error('Server delete failed:', error);
                                    // Continue with local deletion even if server delete fails
                                }
                            }

                            // Always clear local data
                            await AsyncStorage.clear();
                            await OfflineStorage.clearPendingData();

                            // Navigate back to welcome screen
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'WelkomSlide' }]
                            });
                        } catch (error) {
                            console.error('Error during account deletion:', error);
                            // Try one more time to clear local data
                            try {
                                await AsyncStorage.clear();
                                await OfflineStorage.clearPendingData();
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'WelkomSlide' }]
                                });
                            } catch (finalError) {
                                console.error('Failed to clear data:', finalError);
                                Alert.alert(
                                    'Fout',
                                    'Er ging iets mis bij het verwijderen van je lokale gegevens. Herstart de app en probeer het opnieuw.',
                                    [{ text: 'OK' }]
                                );
                            }
                        }
                    }
                }
            ]
        );
    };

    const renderNameSection = () => (
        <View>
            {isEditing ? (
                <View className="mb-8">
                    <TextInput
                        className="bg-white/10 text-white text-lg rounded-xl p-4 mb-4 border border-white/20"
                        placeholder="Vul je nieuwe naam in"
                        placeholderTextColor="#9CA3AF"
                        value={newName}
                        onChangeText={setNewName}
                    />
                    <View className="flex-row justify-between">
                        <TouchableOpacity 
                            onPress={() => {
                                setIsEditing(false);
                                setNewName('');
                            }}
                            className="bg-gray-500/50 rounded-xl p-4 flex-1 mr-2"
                        >
                            <Text className="text-white text-lg text-center">
                                Annuleren
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={handleSaveName}
                            style={{ backgroundColor: 'rgb(217,93,93)' }}
                            className="rounded-xl p-4 flex-1 ml-2"
                        >
                            <Text className="text-white text-lg text-center">
                                Opslaan
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <TouchableOpacity 
                    onPress={() => setIsEditing(true)}
                    style={{ backgroundColor: 'rgb(217,93,93)' }}
                    className="rounded-xl p-4 mb-8"
                >
                    <Text className="text-white text-lg text-center">
                        Verander naam
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <View className="flex-1 bg-[#162433]">
            {isOffline && (
                <View className="absolute top-0 w-full bg-yellow-500 p-2">
                    <Text className="text-white text-center">
                        Je werkt momenteel offline. Wijzigingen worden lokaal opgeslagen.
                    </Text>
                </View>
            )}
            
            {/* Header */}
            <View className="pt-8 px-6 mb-8">
                <TouchableOpacity 
                    onPress={() => navigation.goBack()}
                    className="mb-4"
                >
                    <BackArrow />
                </TouchableOpacity>
                <Text className="text-4xl font-black text-white">
                    Instellingen
                </Text>
            </View>

            {/* Settings List */}
            <View className="px-6">
                {renderNameSection()}

                {/* Toggles */}
                <View className="space-y-6">
                    <View className="flex-row justify-between items-center">
                        <Text className="text-white text-lg">Push-meldingen</Text>
                        <Switch 
                            value={pushNotifications}
                            onValueChange={setPushNotifications}
                            trackColor={{ false: "#3f3f3f", true: "#ea5258" }}
                            thumbColor="#fff"
                        />
                    </View>

                    <View className="flex-row justify-between items-center">
                        <Text className="text-white text-lg">Wist je dat?</Text>
                        <Switch 
                            value={wistJeDat}
                            onValueChange={handleWistJeDatToggle}
                            trackColor={{ false: "#3f3f3f", true: "#ea5258" }}
                            thumbColor="#fff"
                        />
                    </View>

                    <View className="flex-row justify-between items-center">
                        <Text className="text-white text-lg">Geluiden</Text>
                        <Switch 
                            value={sounds}
                            onValueChange={setSounds}
                            trackColor={{ false: "#3f3f3f", true: "#ea5258" }}
                            thumbColor="#fff"
                        />
                    </View>
                </View>

                {/* Delete Account */}
                <TouchableOpacity 
                    className="mt-auto pt-40"
                    onPress={handleDeleteAccount}
                >
                    <Text className="text-[#ea5258] text-lg text-center">
                        Verwijder account
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default SettingsScreen;