// Maken van de welkom page
// Prototype Slide 3
// https://xd.adobe.com/view/b5143bbc-a743-4dda-8ede-1c5d8bcdf3f4-e047/screen/41bafec7-949d-40ee-897f-69d2f4c55892

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService from '../../services/api';
import { OfflineStorage } from '../../utils/offlineStorage';

const BackArrow = ({ color = "#6B7280", size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 330 330" fill="none" transform={[{ rotate: '180deg' }]}>
        <Path
            fill={color}
            d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001 c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213 C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606 C255,161.018,253.42,157.202,250.606,154.389z"
        />
    </Svg>
);

const Name = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        // Check offline status on mount
        OfflineStorage.isOffline().then(setIsOffline);
        
        // Check if user already exists
        const checkUser = async () => {
            try {
                const id = await AsyncStorage.getItem('userId');
                const name = await AsyncStorage.getItem('userName');
                
                if (id && name) {
                    navigation.replace('HomeScreen', {
                        userName: name,
                        userId: Number(id)
                    });
                } else {
                    // Clear all data if we have incomplete user data
                    await AsyncStorage.clear();
                    await OfflineStorage.clearPendingData();
                }
            } catch (error) {
                console.error('Error checking user:', error);
                // Clear all data on error
                await AsyncStorage.clear();
                await OfflineStorage.clearPendingData();
            }
        };
        
        checkUser();
    }, []);

    const handleContinue = async () => {
        if (isLoading) return; // Prevent multiple clicks

        if (name.trim()) {
            try {
                setIsLoading(true);
                
                // Clear any existing data before creating new user
                await AsyncStorage.clear();
                await OfflineStorage.clearPendingData();
                
                const user = await ApiService.createUser(name.trim());
                
                if (user && user.id) {
                    // Store both name and ID
                    await AsyncStorage.setItem('userId', user.id.toString());
                    await AsyncStorage.setItem('userName', name.trim());

                    navigation.navigate('HomeScreen', { 
                        userName: name.trim(),
                        userId: user.id,
                        role: null,  // Initial role is null
                        isOffline: false
                    });
                } else {
                    console.error('Invalid user data:', user);
                    Alert.alert(
                        'Fout',
                        'Er ging iets mis bij het aanmaken van je profiel. Controleer je internetverbinding en probeer het opnieuw.',
                        [{ text: 'OK' }]
                    );
                }
            } catch (error) {
                console.error('Error creating user:', error);
                Alert.alert(
                    'Fout',
                    `Er ging iets mis: ${error.message}`,
                    [{ text: 'OK' }]
                );
            } finally {
                setIsLoading(false);
            }
        } else {
            Alert.alert(
                'Fout',
                'Vul alsjeblieft je naam in.',
                [{ text: 'OK' }]
            );
        }
    };

    return (
        <View className="flex-1 bg-[#162433]">
            {/* Back Arrow */}
            <TouchableOpacity 
                className="absolute top-8 left-4 z-10 p-2"
                onPress={() => navigation.goBack()}
            >
                <BackArrow color="#6B7280" size={24} />
            </TouchableOpacity>

            {/* Counter 4/4 */}
            <View className="absolute top-8 w-full items-center">
                <Text className="text-gray-500 text-lg">
                    <Text className="font-bold">4</Text>/4
                </Text>
            </View>

            <View className="absolute top-[39%] w-full items-center px-6">
                <Text className="text-4xl font-black text-white text-center leading-tight">
                    Begin je{' '}
                    <Text className="text-[#ea5258]">reis</Text>
                </Text>
            </View>

            <View className="absolute top-[46%] w-full items-center px-8 sm:px-10">
                <Text className="text-gray-300 text-lg sm:text-xl lg:text-2xl text-center mb-8">
                    Maar voor je begint, wat is je naam?
                </Text>

                {/* Input Field */}
                <TextInput
                    className="w-full bg-white/10 text-white text-lg rounded-xl p-4 border border-white/20"
                    placeholder="Vul je naam in"
                    placeholderTextColor="#9CA3AF"
                    value={name}
                    onChangeText={setName}
                />
            </View>

            {/* Bottom Button - Only visible when name is entered */}
            {name.trim().length > 0 && (
                <View className="absolute bottom-12 w-full px-8">
                    <TouchableOpacity 
                        className={`bg-[#ea5258] rounded-full py-4 px-8 ${isLoading ? 'opacity-50' : ''}`}
                        onPress={handleContinue}
                        disabled={isLoading}
                    >
                        <Text className="text-white text-center text-lg font-semibold">
                            {isLoading ? 'Even geduld...' : 'Start'}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {isOffline && (
                <View className="absolute top-0 w-full bg-yellow-500 p-2">
                    <Text className="text-white text-center">
                        Je werkt momenteel offline. Sommige functies zijn mogelijk beperkt.
                    </Text>
                </View>
            )}
        </View>
    );
};

export default Name;

