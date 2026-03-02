import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';

const BackArrow = ({ color = "#fff", size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth="2">
        <Path d="M15 18l-6-6 6-6" />
    </Svg>
);

const InfoSection = ({ title, children }) => (
    <View className="mb-8">
        <Text className="text-[#ea5258] text-2xl font-bold mb-2">
            {title}
        </Text>
        {children}
    </View>
);

const InfoScreen = () => {
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
                    Info
                </Text>
            </View>

            {/* Content */}
            <View className="px-6">
                <InfoSection title="Hoe gaat het met mij?">
                    <Text className="text-white text-lg leading-relaxed">
                        Dit is een tool die nodigt je uitnodigt om even{' '}
                        <Text className="font-bold">stil</Text> te{' '}
                        <Text className="font-bold">staan</Text> bij jezelf. 
                        Leer jezelf kennen door een{' '}
                        <Text className="font-bold">duik</Text> te nemen in je onbewuste.
                    </Text>
                </InfoSection>

                <InfoSection title="De ijsberg">
                    <Text className="text-white text-lg leading-relaxed">
                        Je zult kennis maken met de ijsberg. Deze symboliseert{' '}
                        <Text className="font-bold">bovenwater</Text> als je{' '}
                        <Text className="font-bold">bewuste</Text> gedachten en gevoelens en{' '}
                        <Text className="font-bold">onderwater</Text> als het{' '}
                        <Text className="font-bold">onbewuste</Text>.
                    </Text>
                </InfoSection>

                <InfoSection title="Vier rollen">
                    <Text className="text-white text-lg leading-relaxed">
                        Je verkent verschillende vragen die je door vier belangrijke rollen leiden. 
                        Ontdek jezelf als{' '}
                        <Text className="font-bold">student</Text>,{' '}
                        <Text className="font-bold">werknemer</Text>,{' '}
                        <Text className="font-bold">vriend</Text> en{' '}
                        <Text className="font-bold">familielid</Text>.
                    </Text>
                </InfoSection>
            </View>
        </View>
    );
};

export default InfoScreen; 