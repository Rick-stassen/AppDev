import React from 'react';
import { View, Text, Animated, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native';

const WistJeDatHandler = ({ isVisible, onClose, content, slideAnim, role }) => {
    if (!isVisible || !content) return null;

    const { height: screenHeight } = Dimensions.get('window');

    return (
        <View 
            className="absolute inset-0 justify-end" 
            style={{ 
                backgroundColor: 'rgba(0,0,0,0.5)',
                zIndex: 1000 
            }}
        >
            <Animated.View 
                className="bg-[#162433] rounded-t-3xl overflow-hidden"
                style={{
                    transform: [{ 
                        translateY: slideAnim.interpolate({
                            inputRange: [0, 1000],
                            outputRange: [0, screenHeight * 1.2]
                        })
                    }],
                    maxHeight: screenHeight * 0.9,
                }}
            >
                <ScrollView bounces={false}>
                    <View className="p-6">
                        <View className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6" />
                        
                        {/* Role Circle */}
                        <View className="items-center mb-8">
                            <View className="bg-[#EA5258] rounded-full w-[90px] h-[90px] justify-center items-center">
                                <Text className="text-white text-xs mb-1">
                                    Ik als
                                </Text>
                                <Text className="text-white text-lg font-bold capitalize">
                                    {role}
                                </Text>
                            </View>
                        </View>

                        {/* Title */}
                        <Text className="text-white text-3xl font-bold text-center mb-6">
                            Wist je dat?
                        </Text>

                        {/* Content Container with Red Border */}
                        <View className="border-2 border-[#EA5258] rounded-3xl p-6">
                            {/* Subtitle */}
                            {content.subtitle && (
                                <Text className="text-[#EA5258] text-lg text-center mb-6 italic">
                                    {content.subtitle}
                                </Text>
                            )}
                            
                            {/* Main Content */}
                            <View className="space-y-4">
                                {Array.isArray(content.content) ? (
                                    content.content.map((item, index) => (
                                        <Text key={index} className="text-white text-base leading-6">
                                            {typeof item === 'string' ? item : item.text}
                                        </Text>
                                    ))
                                ) : (
                                    <Text className="text-white text-base leading-6">
                                        {typeof content.content === 'string' ? content.content : content.content.text}
                                    </Text>
                                )}
                            </View>

                            {/* Image if exists */}
                            {content.image && (
                                <View className="mt-6">
                                    <Image 
                                        source={content.image}
                                        style={{ 
                                            width: '100%', 
                                            height: 200,
                                            tintColor: '#EA5258'
                                        }}
                                        resizeMode="contain"
                                    />
                                </View>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </Animated.View>

            {/* Overlay Touch Handler */}
            <TouchableOpacity 
                activeOpacity={1}
                onPress={onClose}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}
            />
        </View>
    );
};

export default WistJeDatHandler; 