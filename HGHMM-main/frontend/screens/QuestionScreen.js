import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Modal, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { questions } from '../data/questions';
import SliderQuestion from '../components/questions/SliderQuestion';
import WordsQuestion from '../components/questions/WordsQuestion';
import EmotionQuestion from '../components/questions/EmotionQuestion';
import BodyQuestion from '../components/questions/BodyQuestion.js';
import WistJeDatHandler from '../components/WistJeDatHandler';
import { wistJeDatContent as q1Content } from '../components/wistjedat/q1';
import { wistJeDatContent as q4Content } from '../components/wistjedat/q4';
import { wistJeDatContent as q7Content } from '../components/wistjedat/q7';
import { wistJeDatContent as q28Content } from '../components/wistjedat/q28';
import ApiService from '../services/api';

// Get screen dimensions
const { height: screenHeight } = Dimensions.get('window');
const MODAL_OFFSET = screenHeight * 1.2; // Add 20% more to ensure it's fully off screen

const BackArrow = ({ color = "#fff", size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth="2">
        <Path d="M15 18l-6-6 6-6" />
    </Svg>
);

const PauseIcon = () => (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Path 
            d="M10 4H6V20H10V4Z" 
            fill="#FFFFFF"
        />
        <Path 
            d="M18 4H14V20H18V4Z" 
            fill="#FFFFFF"
        />
    </Svg>
);

const PauseModal = ({ visible, onClose, onSave }) => (
    <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
    >
        <View className="flex-1 bg-black/50 justify-center items-center p-6">
            <View className="bg-[#162433] rounded-3xl p-6 w-full max-w-sm">
                <Text className="text-white text-xl font-bold mb-6 text-center">
                    Wil je pauzeren?
                </Text>
                <View className="space-y-4">
                    <TouchableOpacity
                        className="bg-[#EA5258] rounded-full py-4"
                        onPress={onSave}
                    >
                        <Text className="text-white text-center font-semibold">
                            Opslaan en afsluiten
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="bg-white/10 rounded-full py-4"
                        onPress={onClose}
                    >
                        <Text className="text-white text-center">
                            Doorgaan
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
);

const RoleIndicator = ({ role }) => (
    <View className="bg-[#EA5258] rounded-full p-3 w-[100px] h-[100px] justify-center items-center shadow-lg" style={{
        shadowColor: '#EA5258',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8
    }}>
        <View className="items-center">
            <Text className="text-white text-sm mb-1 opacity-90">
                Ik als
            </Text>
            <Text className="text-white text-lg font-bold" style={{textTransform: 'capitalize'}}>
                {role}
            </Text>
        </View>
    </View>
);

const getWistJeDatContent = (questionId) => {
    if (!questionId) return null;
    
    let content;
    switch (questionId) {
        case 1:
            content = q1Content;
            break;
        case 4:
            content = q4Content;
            break;
        case 7:
            content = q7Content;
            break;
        case 28:
            content = q28Content;
            break;
        default:
            content = null;
    }
    
    if (content) {
    }
    
    return content;
};

const QuestionScreen = ({ route }) => {
    const { userName, role, wistJeDat } = route.params;
    const navigation = useNavigation();
    
    // Animation values
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(screenHeight)).current;
    
    // Other state
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [sliderValue, setSliderValue] = useState(50);
    const [selectedWord, setSelectedWord] = useState('');
    const [selectedEmotion, setSelectedEmotion] = useState(null);
    const [feelingAtHome, setFeelingAtHome] = useState('wel');
    const [selectedBodyParts, setSelectedBodyParts] = useState([]);
    const [isPaused, setIsPaused] = useState(false);
    const [isWistJeDatEnabled, setIsWistJeDatEnabled] = useState(true);
    const [showWistJeDat, setShowWistJeDat] = useState(false);

    const filteredQuestions = questions.filter(q => q.category === role.toLowerCase());

    if (filteredQuestions.length === 0) {
        return (
            <View className="flex-1 bg-[#162433] justify-center items-center px-6">
                <Text className="text-white text-xl text-center">
                    Er zijn momenteel geen vragen beschikbaar voor deze rol.
                </Text>
                <TouchableOpacity
                    className="mt-8 bg-[#EA5258] rounded-full py-4 px-8"
                    onPress={() => navigation.goBack()}
                >
                    <Text className="text-white text-center text-lg font-semibold">
                        Ga terug
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    const animateTransition = (callback) => {
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            })
        ]).start(callback);
    };

    const saveAnswers = async (roleType, answersData) => {
        try {
            const key = `answers_${roleType}_${new Date().toISOString()}`;
            await AsyncStorage.setItem(key, JSON.stringify({
                role: roleType,
                answers: answersData,
                userName,
                date: new Date().toISOString()
            }));
        } catch (error) {
            console.error('Error saving answers:', error);
        }
    };

    const saveProgress = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            if (!userId) throw new Error('No user ID found');

            await ApiService.saveAnswers(parseInt(userId), role, answers);
            navigation.navigate('Results', { 
                userName, 
                role,
                answers 
            });
        } catch (error) {
            console.error('Error saving progress:', error);
            Alert.alert('Error', 'Kon antwoorden niet opslaan');
        }
    };

    useEffect(() => {
        const loadProgress = async () => {
            try {
                const savedProgress = await AsyncStorage.getItem(`progress_${role}`);
                if (savedProgress) {
                    const progress = JSON.parse(savedProgress);
                    setCurrentQuestion(progress.currentQuestion);
                    setAnswers(progress.answers);
                    setSliderValue(progress.sliderValue);
                    setSelectedWord(progress.selectedWord);
                    setSelectedEmotion(progress.selectedEmotion);
                    setSelectedBodyParts(progress.selectedBodyParts);
                    setFeelingAtHome(progress.feelingAtHome);
                    // Clear saved progress after loading
                    await AsyncStorage.removeItem(`progress_${role}`);
                }
            } catch (error) {
                console.error('Error loading progress:', error);
            }
        };

        loadProgress();
    }, []);

    useEffect(() => {
        // Load "Wist Je Dat" setting from AsyncStorage when the component mounts
        const loadWistJeDatSetting = async () => {
            try {
                const storedValue = await AsyncStorage.getItem('wistJeDat');
                // Default to true if no value is stored
                const isEnabled = storedValue === null ? true : JSON.parse(storedValue);
                setIsWistJeDatEnabled(isEnabled);
            } catch (error) {
                console.error('Error loading "Wist Je Dat" setting:', error);
            }
        };
    
        loadWistJeDatSetting();
    }, []); // Runs only once when the component mounts
    
    useEffect(() => {
        // Trigger initial animation when the screen mounts
        const startInitialAnimation = () => {
            animateTransition(() => {
            });
        };
    
        startInitialAnimation();
    }, []); // Runs only once when the component mounts
    
    // State to control modal visibility
    const [isModalVisible, setIsModalVisible] = useState(false);
    
    // Function to open the modal when the "Wist je dat?" button is pressed
    const handleWistJeDatPress = () => {
        const currentQ = filteredQuestions[currentQuestion];
        if (!currentQ) return;
        
        const content = getWistJeDatContent(currentQ.id);
        if (!content) return;
        
        setShowWistJeDat(true);
        slideAnim.setValue(MODAL_OFFSET);
        
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                damping: 30,
                mass: 0.8,
                stiffness: 200,
                overshootClamping: false,
                restDisplacementThreshold: 0.01,
                restSpeedThreshold: 0.01,
                useNativeDriver: true,
            })
        ]).start();
    };
    
    // Function to close the modal
    const closeWistJeDat = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true
            }),
            Animated.spring(slideAnim, {
                toValue: MODAL_OFFSET,
                damping: 30,
                mass: 0.8,
                stiffness: 200,
                overshootClamping: true,
                restDisplacementThreshold: 0.01,
                restSpeedThreshold: 0.01,
                useNativeDriver: true,
            })
        ]).start();
        
        // Hide overlay and modal after animation duration
        setTimeout(() => {
            setShowWistJeDat(false);
        }, 300); // Match this with animation duration
    };
    
    const handleNext = () => {
        const question = filteredQuestions[currentQuestion];
        let value;
        
        switch(question.type) {
            case 'slider':
                value = sliderValue;
                if (currentQuestion === 2 && value < 50) {
                    setFeelingAtHome('niet');
                }
                break;
            case 'words':
                value = selectedWord;
                break;
            case 'emotion':
                value = selectedEmotion;
                break;
            case 'body':
                value = selectedBodyParts;
                break;
            default:
                value = null;
        }
        
        const updatedAnswers = {
            ...answers,
            [question.id.toString()]: value
        };
        
        setAnswers(updatedAnswers);

        if (currentQuestion < filteredQuestions.length - 1) {
            // First fade out
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start(() => {
                // Update state after fade out
                setCurrentQuestion(prev => prev + 1);
                setSliderValue(50);
                setSelectedWord('');
                setSelectedEmotion(null);
                setSelectedBodyParts([]);
                
                // Then fade in new question
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }).start();
            });
        } else {
            // Save answers and navigate
            saveAnswers(role.toLowerCase(), updatedAnswers)
                .then(() => {
                    navigation.navigate('HomeScreen', { userName });
                });
        }
    };

    const formatQuestionText = (text) => {
        if (!text) return '';
        
        // Check for text between ! marks
        const parts = text.split(/(!.*?!)/);
        
        return (
            <Text className="text-white text-xl text-center">
                {parts.map((part, index) => {
                    if (part.startsWith('!') && part.endsWith('!')) {
                        return (
                            <Text key={index} className="text-[#EA5258] font-bold" style={{textTransform: 'lowercase'}}>
                                {part.slice(1, -1)}
                            </Text>
                        );
                    }
                    return <Text key={index}>{part}</Text>;
                })}
            </Text>
        );
    };

    const renderQuestionContent = () => {
        const question = filteredQuestions[currentQuestion];
        if (!question) return null;

        const QuestionText = () => (
            <Text className="text-white text-xl text-center mb-8">
                {formatQuestionText(question.text || question.question)}
            </Text>
        );

        switch (question.type) {
            case 'slider':
                return (
                    <View className="flex-1">
                        <SliderQuestion
                            question={question}
                            value={sliderValue}
                            onChange={setSliderValue}
                        />
                    </View>
                );
            case 'words':
                return (
                    <View className="flex-1">
                        <QuestionText />
                        <WordsQuestion
                            question={question}
                            selectedWord={selectedWord}
                            onSelect={setSelectedWord}
                        />
                    </View>
                );
            case 'emotion':
                return (
                    <View className="flex-1">
                        <QuestionText />
                        <EmotionQuestion
                            question={question}
                            selectedEmotion={selectedEmotion}
                            onAnswer={setSelectedEmotion}
                        />
                    </View>
                );
            case 'body':
                return (
                    <View className="flex-1">
                        <QuestionText />
                        <BodyQuestion
                            question={question}
                            selectedEmotion={selectedEmotion}
                            onAnswer={setSelectedBodyParts}
                        />
                    </View>
                );
            default:
                return null;
        }
    };

    const isNextButtonDisabled = () => {
        const currentQ = filteredQuestions[currentQuestion];
        
        switch (currentQ.type) {
            case 'emotion':
                return !selectedEmotion;
            case 'body':
                return selectedBodyParts.length === 0;
            case 'slider':
                return sliderValue === null;
            case 'words':
                return !selectedWord;
            case 'feeling':
                return !feelingAtHome;
            case 'text':
                return !answers[currentQ.id] || answers[currentQ.id].trim() === '';
            case 'multipleChoice':
                return !answers[currentQ.id];
            default:
                return false;
        }
    };

    const renderWistJeDatButton = () => {
        const currentQuestionId = filteredQuestions[currentQuestion]?.id;
        const hasWistJeDat = [1, 4, 7, 28].includes(currentQuestionId);

        if (!hasWistJeDat) return null;

        return (
            <View className="px-6 mb-4">
                <TouchableOpacity 
                    className="bg-white/10 rounded-full py-4 border border-white/20"
                    onPress={handleWistJeDatPress}
                >
                    <Text className="text-white text-center text-base font-medium">
                        Wist je dat?
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    const animateWistJeDat = (show) => {
        Animated.spring(slideAnim, {
            toValue: show ? 0 : screenHeight,
            damping: 25,
            mass: 1,
            stiffness: 120,
            overshootClamping: false,
            restDisplacementThreshold: 0.01,
            restSpeedThreshold: 0.01,
            useNativeDriver: true,
        }).start(() => {
            if (!show) {
                setShowWistJeDat(false);
            }
        });
    };

    return (
        <View className="flex-1 bg-[#162433]">
            <PauseModal 
                visible={isPaused}
                onClose={() => setIsPaused(false)}
                onSave={saveProgress}
            />
            
            <View className="pt-8 px-6 flex-row justify-between items-center">
                <View className="flex-row items-center space-x-2">
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <BackArrow color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text className="text-white text-lg">
                        <Text className="font-bold">{currentQuestion + 1}</Text>/{filteredQuestions.length}
                    </Text>
                </View>
                <TouchableOpacity 
                    className="bg-white/10 p-3 rounded-full"
                    onPress={() => setIsPaused(true)}
                >
                    <PauseIcon />
                </TouchableOpacity>
            </View>

            {/* Role indicator */}
            <View className="mt-6 items-center">
                <RoleIndicator role={role} />
            </View>

            {/* Question content */}
            <Animated.View 
                className="flex-1"
                style={{ opacity: fadeAnim }}
            >
                {renderQuestionContent()}
            </Animated.View>

            {renderWistJeDatButton()}

            <WistJeDatHandler 
                isVisible={showWistJeDat}
                onClose={closeWistJeDat}
                content={getWistJeDatContent(filteredQuestions[currentQuestion]?.id)}
                slideAnim={slideAnim}
                role={role}
            />

            {/* Bottom buttons */}
            {!showWistJeDat ? (
                <View className="px-6 pb-8 space-y-4">
                    <TouchableOpacity 
                        className={`rounded-full py-4 ${
                            isNextButtonDisabled() 
                                ? 'bg-gray-400/50' 
                                : 'bg-[#EA5258]'
                        }`}
                        onPress={handleNext}
                        disabled={isNextButtonDisabled()}
                    >
                        <Text className={`text-white text-center text-lg font-semibold ${
                            isNextButtonDisabled() ? 'opacity-50' : ''
                        }`}>
                            {currentQuestion === filteredQuestions.length - 1 ? 'Opslaan' : 'Verder'}
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View className="px-6 pb-8">
                    <TouchableOpacity 
                        className="bg-white/10 rounded-full py-4 border border-white/20"
                        onPress={closeWistJeDat}
                    >
                        <Text className="text-white text-center text-lg font-semibold">
                            Terug
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default QuestionScreen;