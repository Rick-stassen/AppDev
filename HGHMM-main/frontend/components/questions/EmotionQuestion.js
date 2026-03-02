import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, Animated, Dimensions } from 'react-native';

const EmotionQuestion = ({ question, onAnswer, selectedEmotion: propSelectedEmotion }) => {
    const [selectedEmotion, setSelectedEmotion] = useState(propSelectedEmotion);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const scrollViewRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const windowWidth = Dimensions.get('window').width;
    const ITEM_WIDTH = 110;
    const SPACING = 24;
    const SIDE_PADDING = (windowWidth - ITEM_WIDTH) / 2;

    const emotions = [
        { id: 'Fantastisch', label: 'Fantastisch', color: 'rgb(219, 145, 55)' },
        { id: 'Blij', label: 'Blij', color: 'rgb(223, 196, 81)' },
        { id: 'Afgunstig', label: 'Afgunstig', color: 'rgb(122, 208, 92)' },
        { id: 'Angstig', label: 'Angstig', color: 'rgb(134, 86, 193)' },
        { id: 'Boos', label: 'Boos', color: 'rgb(195, 82, 78)' },
        { id: 'Verdrietig', label: 'Verdrietig', color: 'rgb(100, 141, 200)' },
    ];

    const extendedEmotions = [...emotions, ...emotions, ...emotions];
    const middleOffset = emotions.length * (ITEM_WIDTH + SPACING);

    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({
                x: middleOffset,
                animated: false,
            });
        }
    }, []);

    useEffect(() => {
        // Automatically select the current emotion in the center
        const currentEmotion = emotions[currentIndex];
        if (currentEmotion && currentEmotion.id !== selectedEmotion) {
            setSelectedEmotion(currentEmotion.id);
            onAnswer(currentEmotion.id);
        }
    }, [currentIndex]);

    const handleScroll = (event) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const maxOffset = (extendedEmotions.length - emotions.length) * (ITEM_WIDTH + SPACING);

        if (offsetX <= 0) {
            scrollViewRef.current.scrollTo({
                x: middleOffset,
                animated: false,
            });
        } else if (offsetX >= maxOffset) {
            scrollViewRef.current.scrollTo({
                x: middleOffset,
                animated: false,
            });
        }

        const centerX = offsetX + windowWidth / 2;
        const index = Math.round((centerX - SIDE_PADDING) / (ITEM_WIDTH + SPACING));
        const actualIndex = index % emotions.length;

        setCurrentIndex(actualIndex < 0 ? actualIndex + emotions.length : actualIndex);
    };

    return (
        <View className="flex-1 items-center justify-center -mt-10">
            <View className="w-full h-64 justify-center items-center relative">
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="w-full"
                    contentContainerStyle={{
                        paddingHorizontal: SIDE_PADDING,
                        gap: SPACING,
                        alignItems: 'center',
                    }}
                    snapToInterval={ITEM_WIDTH + SPACING}
                    decelerationRate="fast"
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                >
                    {extendedEmotions.map((emotion, index) => (
                        <Animated.View
                            key={`${emotion.id}-${index}`}
                            className="items-center w-[110px] h-[160px]"
                            style={{
                                transform: [
                                    {
                                        scale: selectedEmotion === emotion.id ? scaleAnim : 1,
                                    },
                                ],
                            }}
                        >
                            <View
                                className="w-[110px] h-[110px] rounded-full"
                                style={{
                                    backgroundColor: emotion.color,
                                    marginTop: 25,
                                    zIndex: 10,
                                }}
                            />
                            <Text
                                className={`text-white text-sm text-center mt-6 ${
                                    selectedEmotion === emotion.id ? 'font-bold' : 'opacity-80'
                                }`}
                            >
                                {emotion.label}
                            </Text>
                        </Animated.View>
                    ))}
                </ScrollView>

                {/* White circle outline */}
                <View
                    className="absolute w-[110px] h-[110px] rounded-full border-2 border-white left-1/2 top-1/2 -translate-x-[55px] -translate-y-[55px]"
                    style={{
                        zIndex: 20,
                    }}
                    pointerEvents="none"
                />
            </View>
            <Text className="absolute bottom-[7%] text-[#EA5258] text-base text-center font-medium px-6">
                Schuif de emoties en kies welke het dichtste bij je gevoel komt
            </Text>
        </View>
    );
};

export default EmotionQuestion;