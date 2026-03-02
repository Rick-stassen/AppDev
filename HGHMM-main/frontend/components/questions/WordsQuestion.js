import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const WordsQuestion = ({ question, selectedWord, onSelect }) => {

  return (
    <View className="w-full flex-row flex-wrap px-4">
      {question.options.map((option, index) => (
        <TouchableOpacity 
          key={index}
          className="w-1/2 px-2 mb-10"
          onPress={() => onSelect(option)}
        >
          <Text 
            className={`text-xl text-center ${
              selectedWord === option 
                ? 'text-[#EA5258] font-bold' 
                : 'text-white'
            }`}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default WordsQuestion;