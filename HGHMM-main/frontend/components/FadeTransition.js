import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

const FadeTransition = ({ children }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
            delay: 100 
        }).start();

        return () => {
            fadeAnim.setValue(1);
        };
    }, []);

    return (
        <Animated.View 
            style={{ 
                flex: 1, 
                opacity: fadeAnim,
                backgroundColor: 'transparent'
            }}
        >
            {children}
        </Animated.View>
    );
};

export default FadeTransition; 