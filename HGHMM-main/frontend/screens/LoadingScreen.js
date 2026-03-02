// Notes:
// 1. This is the first screen that the user sees when they open the app. (done)
// 2. The screen has to handle the loading of the app, and act as a transition screen to the next screen. (not done)
// 3. The screen has to have a title, subtitle, and an image of an iceberg. (done)
// 4. The screen has to fade in via an upwards animation, and fade out via a downwards animation. (unless the app is opened for the first time, then it just fades out) (not done)
// 5. The screen has to be responsive on smaller and bigger devices, using Tailwind CSS. (done, but not perfect)


// screens/LoadingScreen.js


import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Zee from '../assets/svg/Zee.svg';
import IJsberg from '../assets/png/IJsberg.png';
import Lichtstralen from '../assets/svg/Lichtstralen.svg';

const LoadingScreen = () => {
    const navigation = useNavigation();
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;
    const titleFadeAnim = useRef(new Animated.Value(1)).current;
    const descSlideAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const checkExistingUser = async () => {
            try {
                const [userName, userRole] = await Promise.all([
                    AsyncStorage.getItem('userName'),
                    AsyncStorage.getItem('userRole')
                ]);
                
                // Wait for 2 seconds before starting animations
                setTimeout(() => {
                    Animated.parallel([
                        Animated.timing(titleFadeAnim, {
                            toValue: 0,
                            duration: 800,
                            useNativeDriver: true,
                        }),
                        Animated.timing(fadeAnim, {
                            toValue: 0,
                            duration: 800,
                            useNativeDriver: true,
                        }),
                        Animated.timing(slideAnim, {
                            toValue: 100,
                            duration: 800,
                            useNativeDriver: true,
                        }),
                        Animated.timing(descSlideAnim, {
                            toValue: 50,
                            duration: 800,
                            useNativeDriver: true,
                        }),
                    ]).start(() => {
                        if (userName) {
                            navigation.replace('HomeScreen', { 
                                userName: userName,
                                role: userRole || 'student' // Fallback to student if no role saved
                            });
                        } else {
                            navigation.replace('WelkomSlide');
                        }
                    });
                }, 2000);
            } catch (error) {
                console.error('Error checking existing user:', error);
                navigation.replace('WelkomSlide');
            }
        };

        checkExistingUser();
    }, [navigation]);

    return (
        <View className="flex-1 relative">
            {/* Title - Only fades out */}
            <Animated.View 
                className="absolute top-[10%] w-full items-center z-10"
                style={{ opacity: titleFadeAnim }}
            >
                <Text className="text-4xl font-black text-white text-center">
                    Hoe gaat het{'\n'}met{' '}
                    <Text className="text-[#EA5258]">mij</Text>?
                </Text>
            </Animated.View>

            {/* Description - Fades and slides down */}
            <Animated.View 
                className="absolute top-[25%] w-full items-center px-6"
                style={{ 
                    opacity: fadeAnim,
                    transform: [{ translateY: descSlideAnim }]
                }}
            >
                <Text className="text-white text-lg text-center">
                    Leer jezelf kennen door een{'\n'}duik te nemen in je onbewuste.
                </Text>
            </Animated.View>

            {/* Images Container - Fades and slides down */}
            <Animated.View 
                className="absolute top-[35%] w-full items-center flex-1"
                style={{ 
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                }}
            >
                {/* Background SVGs */}
                <View className="w-full h-2/3 absolute bottom-0">
                    <Zee width="100%" preserveAspectRatio="xMidYMid slice" className="z-0 w-full absolute" />
                    <Lichtstralen 
                        width="100%" 
                        preserveAspectRatio="xMidYMid slice" 
                        className="z-5 w-full absolute"
                    />
                </View>

                {/* IJsberg Image */}
                <Animated.Image
                    source={IJsberg}
                    className="w-3/5 sm:w-3/5 lg:w-1/2 h-auto mt-3 sm:mt-8 lg:mt-10 z-10"
                    resizeMode="contain"
                />
            </Animated.View>
        </View>
    );
};

export default LoadingScreen;
