// Maken van de welkom page
// Prototype Slide 4
// https://xd.adobe.com/view/b5143bbc-a743-4dda-8ede-1c5d8bcdf3f4-e047/screen/41bafec7-949d-40ee-897f-69d2f4c55892

//button
//fade in effect
//terugpijl en slide number 

import React from 'react';
import { View, Text, Image, Button, Alert} from 'react-native';

const ijsberg = () => {
    return (
        <View className="flex-1 relative">
            <View className="absolute top-[39%] w-full items-center px-6">
                <Text className="text-5xl sm:text-5xl lg:text-6xl font-black text-white text-center leading-tight">De {''}
                <Text className="text-5xl sm:text-5xl lg:text-6xl font-black text-red-500 text-center leading-tight">ijsberg</Text>
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

            <View className="absolute top-[85%] items-center px-6 w-full bg-red-500 rounded-full">
                <Button title='verder' color="white">
                
                </Button>
            </View>

        </View>
    );
};

export default ijsberg;