import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const WelkomSlide = () => {
  const navigation = useNavigation();

  return (
    <View className="flex-1 relative">
      {/* Counter 1/4 */}
      <View className="absolute top-8 w-full items-center">
        <Text className="text-gray-500 text-lg">
          <Text className="font-bold">1</Text>/4
        </Text>
      </View>

      {/* Main Content */}
      <View className="flex-1 justify-center px-8">
        <Text className="text-4xl font-black text-[#ea5258] text-center mb-8">
          Welkom
        </Text>
        
        <Text className="text-gray-300 text-xl text-center leading-relaxed">
          Deze tool nodigt je uit om even <Text className="font-bold">stil</Text> te{' '}
          <Text className="font-bold">staan</Text> bij jezelf. Leer jezelf kennen door een{' '}
          <Text className="font-bold">duik</Text> te nemen in je onbewuste.
        </Text>
      </View>

      {/* Bottom Button */}
      <View className="pb-12 px-8">
        <TouchableOpacity 
          className="bg-[#ea5258] rounded-full py-4 px-8"
          onPress={() => navigation.navigate('IjsbergPage')}
        >
          <Text className="text-white text-center text-lg font-semibold">
            Verder
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WelkomSlide;
