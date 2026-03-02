import React from 'react';
import { View, Text, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';

const BackArrow = ({ color = "#fff", size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth="2">
        <Path d="M15 18l-6-6 6-6" />
    </Svg>
);

const SupportSection = ({ title, children }) => (
    <View className="mb-8">
        <Text className="text-[#ea5258] text-2xl font-bold mb-2">
            {title}
        </Text>
        {children}
    </View>
);

const SupportLink = ({ title, url }) => (
    <TouchableOpacity 
        className="mb-3"
        onPress={() => Linking.openURL(url)}
    >
        <Text className="text-[#ea5258] text-lg underline">
            {title}
        </Text>
    </TouchableOpacity>
);

const OndersteuningScreen = () => {
    const navigation = useNavigation();

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
                <Text className="text-4xl font-black text-white">
                    Ondersteuning
                </Text>
            </View>

            {/* Content */}
            <ScrollView className="flex-1 px-6">
                {/* Intro Text */}
                <Text className="text-white text-lg mb-8">
                    Hoe <Text className="font-bold">groot of klein</Text> je uitdaging ook is, er is altijd ondersteuning beschikbaar om je te helpen.
                </Text>

                {/* Binnen Zuyd Section */}
                <SupportSection title="Binnen Zuyd">
                    <Text className="text-white text-lg mb-4">
                        Zit je ergens mee en zou je hulp, een luisterend oor of begeleiding kunnen gebruiken?
                    </Text>
                    <Text className="text-white text-lg mb-4">
                        Via de link zie je <Text className="font-bold">wie</Text> of <Text className="font-bold">wat</Text> je zou kunnen helpen:
                    </Text>
                    <SupportLink 
                        title="Ga naar zuyd.nl/student"
                        url="https://zuyd.nl/student"
                    />
                </SupportSection>

                {/* Buiten Zuyd Section */}
                <SupportSection title="Buiten Zuyd">
                    <Text className="text-white text-lg mb-4">
                        Ook buiten school is er ondersteuning beschikbaar:
                    </Text>
                    <View>
                        <SupportLink 
                            title="- Huisarts"
                            url="https://www.thuisarts.nl/hulpzoeken"
                        />
                        <SupportLink 
                            title="- Praktijkondersteuner GGZ"
                            url="https://www.ggz.nl"
                        />
                        <SupportLink 
                            title="- @EASE"
                            url="https://ease.nl"
                        />
                        <SupportLink 
                            title="- MIND Young"
                            url="https://mindyoung.nl"
                        />
                        <SupportLink 
                            title="- Heyhetisoke.nl"
                            url="https://heyhetisoke.nl"
                        />
                        <SupportLink 
                            title="- Alles Oké? Supportlijn"
                            url="https://www.allesoke.nl"
                        />
                        <SupportLink 
                            title="- Jongerenhulponline.nl"
                            url="https://jongerenhulponline.nl"
                        />
                        <SupportLink 
                            title="- 113 zelfmoordpreventie"
                            url="https://www.113.nl"
                        />
                    </View>
                </SupportSection>
            </ScrollView>
        </View>
    );
};

export default OndersteuningScreen; 