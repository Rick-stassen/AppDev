// Maken van de welkom page

// Prototype Slide 4
// https://xd.adobe.com/view/b5143bbc-a743-4dda-8ede-1c5d8bcdf3f4-e047/screen/41bafec7-949d-40ee-897f-69d2f4c55892

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';

const BackArrow = ({ color = "#6B7280", size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 330 330" fill="none" transform={[{ rotate: '180deg' }]}>
        <Path
            fill={color}
            d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001 c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213 C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606 C255,161.018,253.42,157.202,250.606,154.389z"
        />
    </Svg>
);

const ijsberg = () => {
    const navigation = useNavigation();

    return (
        <View className="flex-1 relative">
            {/* Back Arrow */}
            <TouchableOpacity 
                className="absolute top-8 left-4 z-10 p-2"
                onPress={() => navigation.goBack()}
            >
                <BackArrow color="#6B7280" size={24} />
            </TouchableOpacity>

            {/* Counter 2/4 */}
            <View className="absolute top-8 w-full items-center">
                <Text className="text-gray-500 text-lg">
                    <Text className="font-bold">2</Text>/4
                </Text>
            </View>

            <View className="absolute top-[39%] w-full items-center px-6">
                <Text className="text-4xl font-black text-white text-center leading-tight">De{' '}
                    <Text className="text-[#ea5258]">ijsberg</Text>
                </Text>
            </View>

            <View className="absolute top-[46%] w-full items-center px-8 sm:px-10">
                <Text className="text-gray-300 text-lg sm:text-xl lg:text-2xl text-center">Je zult kennis maken met de ijsberg. Deze symboliseert {''}
                    <Text className="text-white font-bold text-lg sm:text-xl lg:text-2xl text-center"> bovenwater als </Text>je 
                    <Text className="text-white font-bold text-lg sm:text-xl lg:text-2xl text-center"> bewuste </Text>gedachten en gevoelens, en 
                    <Text className="text-white font-bold text-lg sm:text-xl lg:text-2xl text-center"> onderwater </Text>als het 
                    <Text className="text-white font-bold text-lg sm:text-xl lg:text-2xl text-center"> onbewuste</Text>.
                </Text>
            </View>

            {/* Bottom Button */}
            <View className="absolute bottom-12 w-full px-8">
                <TouchableOpacity 
                    className="bg-[#ea5258] rounded-full py-4 px-8"
                    onPress={() => navigation.navigate('Rollen')}
                >
                    <Text className="text-white text-center text-lg font-semibold">
                        Verder
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ijsberg;