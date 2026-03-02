import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SliderResultCard, WordResultCard } from './ResultsScreen';
import { questions } from '../data/questions'; 
import ApiService from '../services/api';

const MijnOverzichtScreen = ({ route }) => {
    const { userName } = route.params || {};
    const [selectedRole, setSelectedRole] = useState(null);
    const [roleResults, setRoleResults] = useState({});
    const navigation = useNavigation();

    const loadResults = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            if (!userId) return;

            const answers = await ApiService.getUserAnswers(parseInt(userId));
            const results = {};
            
            answers.forEach(answer => {
                if (!results[answer.role]) {
                    results[answer.role] = [];
                }
                results[answer.role].push(answer);
            });
            
            setRoleResults(results);
        } catch (error) {
            console.error('Error loading results:', error);
        }
    };

    useEffect(() => {
        loadResults();
    }, []);

    const roleButtons = [
        { title: 'Student', role: 'student' },
        { title: 'Werknemer', role: 'werknemer' },
        { title: 'Vriend', role: 'vriend' },
        { title: 'Familielid', role: 'familielid' }
    ];

    const renderResult = (result) => {
        if (!result || !result.answers) return null;
        
        return Object.entries(result.answers).map(([questionId, value]) => {
            const question = questions.find(q => q.id.toString() === questionId);
            if (!question) return null;

            switch(question.type) {
                case 'slider':
                    return <SliderResultCard key={questionId} question={question} value={value} />;
                case 'words':
                    return <WordResultCard key={questionId} question={question} value={value} />;
                default:
                    return null;
            }
        });
    };

    return (
        <View className="flex-1 bg-[#162433]">
            <View className="pt-8 px-6">
                <Text className="text-4xl font-black text-white text-center mb-2">
                    Mijn Overzicht
                </Text>
                <Text className="text-gray-300 text-lg text-center mb-8">
                    Bekijk je eerdere resultaten
                </Text>
            </View>

            {!selectedRole ? (
                <View className="flex-1 px-6">
                    <View className="flex-row flex-wrap justify-center gap-4">
                        {roleButtons.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                className={`w-[45%] aspect-square rounded-3xl p-6 ${
                                    roleResults[item.role]?.length > 0 
                                        ? 'bg-gray-800/50' 
                                        : 'bg-gray-800/20'
                                }`}
                                onPress={() => roleResults[item.role]?.length > 0 && setSelectedRole(item.role)}
                            >
                                <Text className="text-white text-xl font-bold mb-2">
                                    {item.title}
                                </Text>
                                <Text className="text-gray-400">
                                    {roleResults[item.role]?.length || 0} resultaten
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            ) : (
                <View className="flex-1">
                    <TouchableOpacity 
                        className="px-6 mb-4"
                        onPress={() => setSelectedRole(null)}
                    >
                        <Text className="text-gray-400">← Terug naar rollen</Text>
                    </TouchableOpacity>
                    
                    <ScrollView className="flex-1 px-6">
                        {roleResults[selectedRole]?.map((result, index) => (
                            <View key={index} className="mb-8">
                                <Text className="text-white text-lg mb-4">
                                    {new Date(result.date).toLocaleDateString()}
                                </Text>
                                {renderResult(result)}
                            </View>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
};

export default MijnOverzichtScreen;