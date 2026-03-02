import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, SafeAreaView, StatusBar, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Zee from '../assets/svg/Zee.svg';
import IJsberg from '../assets/png/IJsberg.png';
import Lichtstralen from '../assets/svg/Lichtstralen.svg';
import StudentRol from '../assets/svg/Student rol.svg';
import WerknemerRol from '../assets/svg/Werknemer rol.svg';
import VriendRol from '../assets/svg/Vriend rol.svg';
import FamilieRol from '../assets/svg/Familie rol.svg';
import Svg, { Path, Circle } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Menu dots icon component
const MenuDotsIcon = ({ color = "#fff", size = 24 }) => (
    <View className="w-10 h-10 rounded-full bg-gray-500/20 items-center justify-center">
        <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
            <Circle cx="4" cy="12" r="2" />
            <Circle cx="12" cy="12" r="2" />
            <Circle cx="20" cy="12" r="2" />
        </Svg>
    </View>
);

const HomeScreen = ({ route }) => {
    const navigation = useNavigation();
    const { userName, role: initialRole } = route.params;
    const [menuVisible, setMenuVisible] = useState(false);
    const [currentRole, setCurrentRole] = useState(initialRole);
    const { width } = useWindowDimensions();
    const [currentUserName, setCurrentUserName] = useState(route.params?.userName);

    // Calculate icon size based on screen width
    const iconSize = Math.min(width * 0.18, 80);
    const spacing = Math.min(width * 0.03, 16);

    useEffect(() => {
        // Update local state when route params change
        if (route.params?.userName) {
            setCurrentUserName(route.params.userName);
        }
    }, [route.params?.userName]);

    const handleRoleSelect = async (selectedRole) => {
        try {
            await AsyncStorage.setItem('userRole', selectedRole);
            setCurrentRole(selectedRole);
            navigation.navigate('Question', { 
                userName, 
                role: selectedRole
            });
        } catch (error) {
            console.error('Error saving role:', error);
            navigation.navigate('Question', { 
                userName, 
                role: selectedRole
            });
        }
    };

    return (
        <View className="flex-1 relative">
            <StatusBar barStyle="light-content" />
            
            {/* Menu Button */}
            <TouchableOpacity 
                className="absolute top-12 right-4 z-50"
                onPress={() => setMenuVisible(true)}
            >
                <MenuDotsIcon />
            </TouchableOpacity>

            {/* Title */}
            <View className="absolute top-[10%] w-full items-center px-6">
                <Text className="text-4xl font-black text-white text-center mb-2">
                    Welkom <Text className="text-[#ea5258]">{currentUserName}</Text>
                </Text>
                <Text className="text-gray-300 text-lg text-center">
                    {currentRole ? 
                        `Je verkent jezelf als ${currentRole}` : 
                        'Welke rol wil je onderzoeken?'
                    }
                </Text>
            </View>

            {/* Role Buttons Container */}
            <View className="absolute top-[25%] w-full items-center">
                <View style={{ 
                    flexDirection: 'row', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    gap: spacing
                }}>
                    {/* Student Role */}
                    <TouchableOpacity 
                        onPress={() => handleRoleSelect('student')}
                        style={{ opacity: currentRole === 'student' ? 1 : 0.5 }}
                    >
                        <StudentRol width={iconSize} height={iconSize} />
                    </TouchableOpacity>

                    {/* Employee Role */}
                    <TouchableOpacity 
                        onPress={() => handleRoleSelect('werknemer')}
                        style={{ opacity: currentRole === 'werknemer' ? 1 : 0.5 }}
                    >
                        <WerknemerRol width={iconSize} height={iconSize} />
                    </TouchableOpacity>

                    {/* Friend Role */}
                    <TouchableOpacity 
                        onPress={() => handleRoleSelect('vriend')}
                        style={{ opacity: currentRole === 'vriend' ? 1 : 0.5 }}
                    >
                        <VriendRol width={iconSize} height={iconSize} />
                    </TouchableOpacity>

                    {/* Family Role */}
                    <TouchableOpacity 
                        onPress={() => handleRoleSelect('familielid')}
                        style={{ opacity: currentRole === 'familielid' ? 1 : 0.5 }}
                    >
                        <FamilieRol width={iconSize} height={iconSize} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Images Container */}
            <View className="absolute top-[35%] w-full items-center flex-1">
                <View className="w-full h-2/3 absolute bottom-0">
                    <Zee width="100%" preserveAspectRatio="xMidYMid slice" className="z-0 w-full absolute" />
                    <Lichtstralen 
                        width="100%" 
                        preserveAspectRatio="xMidYMid slice" 
                        className="z-5 w-full absolute"
                    />
                </View>

                <Image
                    source={IJsberg}
                    className="w-3/5 sm:w-3/5 lg:w-1/2 h-auto mt-3 sm:mt-8 lg:mt-10 z-10"
                    resizeMode="contain"
                />
            </View>

            {/* Menu Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={menuVisible}
                onRequestClose={() => setMenuVisible(false)}
            >
                <SafeAreaView className="flex-1 bg-[#162433]">
                    <StatusBar barStyle="light-content" />
                    
                    <TouchableOpacity 
                        className="absolute top-12 right-4 z-50"
                        onPress={() => setMenuVisible(false)}
                    >
                        <MenuDotsIcon />
                    </TouchableOpacity>

                    <View className="flex-1 pt-20 px-8">
                        <View className="flex-row items-center">
                            <Text className="text-4xl font-black text-white">
                                Menu
                            </Text>
                        </View>

                        <View className="flex-1 pt-16">
                            <TouchableOpacity
                                className="py-8"
                                onPress={() => {
                                    setMenuVisible(false);
                                    navigation.navigate('SettingsScreen', { userName });
                                }}
                            >
                                <Text className="text-white text-2xl font-light">
                                    Instellingen
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="py-8"
                                onPress={() => {
                                    setMenuVisible(false);
                                    navigation.navigate('MijnOverzichtScreen', { userName });
                                }}
                            >
                                <Text className="text-white text-2xl font-light">
                                    Mijn overzichten
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="py-8"
                                onPress={() => {
                                    setMenuVisible(false);
                                    navigation.navigate('Ondersteuning');
                                }}
                            >
                                <Text className="text-white text-2xl font-light">
                                    Ondersteuning
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="py-8"
                                onPress={() => {
                                    setMenuVisible(false);
                                    navigation.navigate('Info');
                                }}
                            >
                                <Text className="text-white text-2xl font-light">
                                    Info
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>
        </View>
    );
};

export default HomeScreen;