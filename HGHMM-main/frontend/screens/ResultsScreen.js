import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import { questions } from '../data/questions';

const BackArrow = ({ color = "#fff", size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth="2">
        <Path d="M15 18l-6-6 6-6" />
    </Svg>
);

const SliderResultCard = ({ question, value }) => (
    <View className="bg-gray-800/50 rounded-xl p-6 mb-4">
        <Text className="text-white text-lg mb-4">
            {question.text || question.question}
        </Text>
        <View className="h-2 bg-gray-700 rounded-full">
            <View 
                className="h-2 bg-red-500 rounded-full"
                style={{ width: `${value}%` }}
            />
        </View>
        <View className="flex-row justify-between mt-2">
            <Text className="text-gray-400">0%</Text>

            <Text className="text-gray-400">100%</Text>
        </View>
    </View>
);

const WordResultCard = ({ question, value }) => (
    <View className="bg-gray-800/50 rounded-xl p-6 mb-4">
        <Text className="text-white text-lg mb-4">
            {question.text || question.question}
        </Text>
        <Text className="text-white text-xl font-bold">
            {value}
        </Text>
    </View>
);

const ResultCard = ({ question, value }) => {
    if (!question) return null;
    
    switch (question.type) {
        case 'slider':
            return <SliderResultCard question={question} value={value} />;
        case 'words':
            return <WordResultCard question={question} value={value} />;
        default:
            return null;
    }
};

const ResultsScreen = ({ route }) => {
    const { userName, role, answers } = route.params;
    const navigation = useNavigation();


    const renderAnswer = (questionId, answer) => {
        // Safe question lookup with type checking
        const question = questions.find(q => q.id?.toString() === questionId?.toString());
        
        if (!question) {
            console.warn(`Question not found for ID: ${questionId}`);
            return answer;
        }

        switch (question.type) {
            case 'slider':
                return `${answer}%`;
            case 'words':
                return answer;
            default:
                return answer;
        }
    };

    return (
        <View className="flex-1 bg-[#162433]">
            {/* Header */}
            <View className="pt-8 px-6 mb-8">
                <TouchableOpacity 
                    onPress={() => navigation.goBack()}
                    className="mb-4"
                >
                    <BackArrow />
                </TouchableOpacity>
                <Text className="text-4xl font-black text-white mb-2">
                    Resultaten
                </Text>
                <Text className="text-gray-400 text-lg">
                    Als {role}
                </Text>
            </View>


            {/* Individual Results */}
            <ScrollView className="flex-1 px-6">
                {Object.entries(answers).map(([questionId, value]) => {
                    const question = questions.find(q => q.id === parseInt(questionId));
                    return (
                        <ResultCard 
                            key={questionId}
                            question={question}
                            value={value}
                        />
                    );
                })}

                {Object.entries(answers).map(([questionId, answer]) => (
                    <View key={questionId} className="mb-4">
                        <Text className="text-white text-lg">
                            Vraag {questionId}: {renderAnswer(questionId, answer)}
                        </Text>
                    </View>
                ))}

                {/* Action Buttons */}
                <View className="py-8 space-y-4">
                    <TouchableOpacity
                        className="bg-[#EA5258] rounded-full py-4 px-8"
                        onPress={() => navigation.navigate('RoleSelection', { userName })}
                    >
                        <Text className="text-white text-center text-lg font-semibold">
                            Probeer een andere rol
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="bg-gray-800/50 rounded-full py-4 px-8"
                        onPress={() => navigation.navigate('HomeScreen', { userName, role })}
                    >
                        <Text className="text-white text-center text-lg font-semibold">
                            Ga naar overzicht
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

export { SliderResultCard, WordResultCard };
export default ResultsScreen;