import React from 'react';
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';

const SliderQuestion = ({ question, value, onChange }) => (
    <View className="flex-1 justify-center items-center px-8">
        <Text className="text-white text-xl text-center mb-16">
            {question.text || question.question}
        </Text>
        <View className="w-full max-w-[300px]">
            <View className="relative">
                <View className="absolute h-[20px] w-[2px] bg-white/20 left-1/2 -translate-x-1/2" />
                <Slider
                    style={{ width: '100%', height: 40 }}
                    minimumValue={0}
                    maximumValue={100}
                    value={value}
                    onValueChange={onChange}
                    minimumTrackTintColor="#EA5258"
                    maximumTrackTintColor="rgba(255,255,255,0.2)"
                    thumbTintColor="#EA5258"
                    trackStyle={{ height: 3 }}
                    thumbStyle={{ 
                        width: 24, 
                        height: 24, 
                        backgroundColor: '#EA5258' 
                    }}
                />
            </View>
            <View className="flex-row justify-between mt-2">
                <Text className="text-white/70 text-base">
                    {question.minLabel || 'Niet'}
                </Text>
                <Text className="text-white/70 text-base">
                    {question.maxLabel || 'Wel'}
                </Text>
            </View>
        </View>
    </View>
);

export default SliderQuestion;