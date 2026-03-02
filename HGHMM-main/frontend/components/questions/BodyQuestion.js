import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { G, Path, Rect } from 'react-native-svg';


const BodyQuestion = ({ question, onAnswer, selectedEmotion }) => {
    const [selectedParts, setSelectedParts] = useState([]);

    const emotionColors = {
        'Fantastisch': '#DB9137',
        'Blij': '#DFC451',
        'Afgunstig': '#7AD05C',
        'Angstig': '#8656C1',
        'Boos': '#C3524E',
        'Verdrietig': '#648DC8'
    };

    const handleSelectPart = (id) => {
        const updatedParts = selectedParts.includes(id)
            ? selectedParts.filter((part) => part !== id)
            : [...selectedParts, id];

        setSelectedParts(updatedParts);
        onAnswer(updatedParts);
    };

    const highlightColor = selectedEmotion ? emotionColors[selectedEmotion] : '#fff';

    const pathProps = {
        stroke: "#fff",
        strokeWidth: "1.5",
        strokeLinecap: "round",
        strokeLinejoin: "round"
    };

    return (
        <View style={styles.container}>
            <View style={styles.bodyContainer}>
            <Svg width="120" height="325" viewBox="0 0 119.693 324.518">
    <G id="lichaam_totaal" transform="translate(-4304.488 -5426.633)">
        <G id="Group_1987" transform="translate(4305.241 5427.399)">
            {/* Hoofd */}
            <G id="Component_20_57" transform="translate(50.049 0)">
                <Path
                    id="Path_1526"
                    d="M122.887,3.687C110.3,6.2,110.255,18.155,109.792,20.307c-1.221,5.668-.344,16.039,5.54,19.138,3.979,2.1,8.895-.091,12.087-1.511A23.272,23.272,0,0,0,139,26.854c1.227-2.587,4.182-10.938-.5-17.627C134.965,4.183,128.221,2.619,122.887,3.687Z"
                    transform="translate(-109.315 -3.369)"
                    fill={selectedParts.includes('head') ? highlightColor : 'none'}
                    {...pathProps}
                    onPress={() => handleSelectPart('head')}
                />
                <Rect
                    x="109.3"  // Matches the x position of the head path
                    y="3.2"    // Matches the y position of the head path
                    width="28"  // Matches the width of the head path
                    height="30" // Approximate height of the head path for better clickability
                    fill="transparent"
                    onPress={() => handleSelectPart('head')}
                />
            </G>

            {/* Nek */}
            <G id="Component_21_18" transform="translate(57.073 36.58)">
                <Path
                    id="Path_1527"
                    d="M123.261,90.1a67.473,67.473,0,0,0,17.124-.5l-.5-13.6s-15.109,3.525-16.62,4.029Z"
                    transform="translate(-123.261 -76)"
                    fill={selectedParts.includes('neck') ? highlightColor : 'none'}
                    {...pathProps}
                    onPress={() => handleSelectPart('neck')}
                />
                <Rect
                    x="120"   // Adjusted x position to fit the neck
                    y="80"    // Matches the y position of the neck
                    width="20" // Width adjusted to match the neck area
                    height="30" // Height adjusted for the neck's clickable area
                    fill="transparent"
                    onPress={() => handleSelectPart('neck')}
                />
            </G>

            {/* Borst */}
            <G id="Component_22_61" transform="translate(42.461 53.248)">
                <Path
                    id="Path_1528"
                    d="M99.8,109.551s-10.576-1.007-2.518,56.911c0,0,18.635,5.54,42.809,0,0,0,7.051-53.889-2.014-56.407C131.561,108.246,108.861,109.551,99.8,109.551Z"
                    transform="translate(-94.249 -109.096)"
                    fill={selectedParts.includes('chest') ? highlightColor : 'none'}
                    {...pathProps}
                />
                <Rect
                    x="10" y="10" width="60" height="40"
                    fill="transparent"
                    onPress={() => handleSelectPart('chest')}
                />
            </G>

            {/* Buik */}
            <G id="Component_29_17" transform="translate(41.964 115.147)">
                <Path
                    id="Path_1529"
                    d="M96.283,232s-3.022,10.576-3.022,32.736c0,0,24.678,7.554,48.853,2.014,0,0-2.476-34.448-5.036-34.247C111.392,234.518,105.348,232,96.283,232Z"
                    transform="translate(-93.261 -232)"
                    fill={selectedParts.includes('stomach') ? highlightColor : 'none'}
                    {...pathProps}
                    onPress={() => handleSelectPart('stomach')}
                />
                <Rect
                    x="10"  // Adjusted x position to fit stomach
                    y="35" // Matches the y position of the stomach
                    width="60" // Width adjusted to match stomach area
                    height="40" // Height adjusted to fit stomach area
                    fill="transparent"
                    onPress={() => handleSelectPart('stomach')}
                />
            </G>

            {/* Linker Arm */}
            <G id="Component_24_17" transform="translate(12.753 57.229)">
                <Path
                    id="Path_1530"
                    d="M61.954,117s-17.124,2.518-16.116,55.9c0,0-9.569,38.78-10.576,41.3l4.533,2.015s8.562-21.153,13.095-31.225c4.514-10.031,4.533-26.189,5.036-28.707.143-.714,3.394-10.545,3.525-14.1C61.782,133.192,61.954,117,61.954,117Z"
                    transform="translate(-35.261 -117)"
                    fill={selectedParts.includes('leftArm') ? highlightColor : 'none'}
                    {...pathProps}
                    onPress={() => handleSelectPart('leftArm')}
                />
                <Rect
                    x="35"   // Adjusted to fit the left arm's position
                    y="117"  // Matches the y position of the left arm path
                    width="16" // Adjusted width for better fit
                    height="120" // Height adjusted to match the arm's area
                    fill="transparent"
                    onPress={() => handleSelectPart('leftArm')}
                />
            </G>

            {/* Rechter Arm */}
            <G id="Component_23_17" transform="translate(93.838 57.18)">
                <Path
                    id="Path_1531"
                    d="M196.262,116.952s18.635-4.029,16.62,60.94c0,0,6.044,39.787,7.051,42.305l-4.533,2.015s-6.044-21.656-9.569-32.233c-3.479-10.435-4.533-26.189-5.036-28.707-.143-.714-3.395-10.545-3.525-14.1C196.937,138.18,196.262,116.952,196.262,116.952Z"
                    transform="translate(-196.262 -116.903)"
                    fill={selectedParts.includes('rightArm') ? highlightColor : 'none'}
                    {...pathProps}
                    onPress={() => handleSelectPart('rightArm')}
                />
                {/* Right arm clickable area - 50% thicker and 20% taller */}
                <Rect
                    x="115"   // Adjusted slightly for the shoulder area
                    y="50"    // Slightly higher to start at the shoulder area
                    width="17" // 50% thicker than the previous width of 135
                    height="120"  // 20% taller than the previous height of 375
                    fill="transparent"
                    onPress={() => handleSelectPart('rightArm')}
                />
            </G>

            {/* Linker Been */}
            <G id="Component_26_17" transform="translate(24.337 152.919)">
                <Path
                    id="Path_1532"
                    d="M74.881,307s-13.6,46.838-14.605,77.056-2.015,69.5-2.015,69.5l7.051.5a307.918,307.918,0,0,1,7.555-34.751c3.075-11.325,2.573-21.071,4.029-33.744,4.61-40.105,18.131-54.393,18.634-74.538Z"
                    transform="translate(-58.261 -307)"
                    fill={selectedParts.includes('leftLeg') ? highlightColor : 'none'}
                    {...pathProps}
                    onPress={() => handleSelectPart('leftLeg')}
                />
                <Rect
                    x="58.3"  // Matches the x position of the left leg path
                    y="307"   // Matches the y position of the left leg path
                    width="20" // Matches the width of the left leg path
                    height="100" // Approximate height for the left leg clickable area
                    fill="transparent"
                    onPress={() => handleSelectPart('leftLeg')}
                />
            </G>


            {/* Rechter Been */}
            <G id="Component_27_17" transform="translate(71.642 156.515)">
                <Path
                    id="Path_1533"
                    d="M173.538,314.139s4.369,42.469.847,76.482c-1.127,10.883,2.2,21.368,1.007,32.736-2.014,19.138-2.3,37.531-3.022,37.773l-6.547-.5s-1.007-13.095-3.07-33.875c-.988-9.951-.175-24.6-1.463-37.641-4.029-40.794-10.732-53.472-8.741-73.525Z"
                    transform="translate(-152.189 -314.139)"
                    fill={selectedParts.includes('rightLeg') ? highlightColor : 'none'}
                    {...pathProps}
                    onPress={() => handleSelectPart('rightLeg')}
                />
                <Rect
                    x="152.2"  // Matches the x position of the right leg path
                    y="314"    // Matches the y position of the right leg path
                    width="20"  // Matches the width of the right leg path
                    height="100" // Approximate height for the right leg clickable area
                    fill="transparent"
                    onPress={() => handleSelectPart('rightLeg')}
                />
            </G>


            {/* Linker Voet */}
            <G id="Component_30_17" transform="translate(0 302.499)">
                <Path
                    id="Path_1534"
                    d="M34.276,604a15.071,15.071,0,0,1-3.525,4.533C29.09,609.779,7.883,615.4,10.1,616.591s31.288-1.367,31.729-1.511c1.354-.443-.5-10.576-.5-10.576Z"
                    transform="translate(-9.939 -604)"
                    fill={selectedParts.includes('leftFoot') ? highlightColor : 'none'}
                    {...pathProps}
                    onPress={() => handleSelectPart('leftFoot')}
                />
                {/* Left foot clickable area - significantly improved hitbox */}
                <Rect
                    x="10"    // Slightly adjusted to better match the foot's left side
                    y="580"   // Adjusted to ensure full coverage of the foot
                    width="95" // Increased width for better coverage, more aligned with the shape
                    height="55" // Increased height for full foot coverage
                    fill="transparent"
                    onPress={() => handleSelectPart('leftFoot')}
                />
            </G>

            {/* Rechter Voet */}
            <G id="Component_28_17" transform="translate(84.83 306.025)">
                <Path
                    id="Path_1535"
                    d="M185.263,611.658s1.5,3.133,2.624,5.386c1.007,2.014,7.76,8.882,5.54,10.073s-11.889.923-12.087.5c-4.533-9.569-2.518-16.62-2.518-16.62Z"
                    transform="translate(-178.375 -611)"
                    fill={selectedParts.includes('rightFoot') ? highlightColor : 'none'}
                    {...pathProps}
                    onPress={() => handleSelectPart('rightFoot')}
                />
                {/* Right foot clickable area - improved hitbox */}
                <Rect
                    x="170"  // Adjusted to better cover the right foot
                    y="590"  // Adjusted to match the bottom of the foot
                    width="95" // Increased width to match the full foot area
                    height="60" // Increased height to cover the entire foot
                    fill="transparent"
                    onPress={() => handleSelectPart('rightFoot')}
                />
            </G>

            {/* Linker Hand */}
            <G id="Component_25_17" transform="translate(6.333 158.371)">
                <Path
                    id="Path_1536"
                    d="M29.438,317.913c-3.221-.76-6.044,3.525-6.547,7.555-.4,3.215-1.037,9.506,1.511,10.576,3.1,1.3,8.349-5.463,9.065-10.073C33.965,322.765,32.353,318.6,29.438,317.913Z"
                    transform="translate(-22.514 -317.825)"
                    fill={selectedParts.includes('leftHand') ? highlightColor : 'none'}
                    {...pathProps}
                    onPress={() => handleSelectPart('leftHand')}
                />
                {/* Left hand clickable area - improved hitbox */}
                <Rect
                    x="15"   // Adjusted to better align with the left hand
                    y="305"  // Adjusted for better foot coverage
                    width="45" // Increased width to better match the hand's size
                    height="35" // Adjusted height for full hand coverage
                    fill="transparent"
                    onPress={() => handleSelectPart('leftHand')}
                />
            </G>

            {/* Rechter Hand */}
            <G id="Component_31_17" transform="translate(108.386 165.934)">
                <Path
                    id="Path_1537"
                    d="M231.752,332.921c-3.222-.761-5.54,4.029-6.044,8.058-.4,3.215-1.459,9.065,1.089,10.136,3.1,1.3,7.26-4.015,7.977-8.625C235.272,339.284,234.667,333.609,231.752,332.921Z"
                    transform="translate(-225.147 -332.841)"
                    fill={selectedParts.includes('rightHand') ? highlightColor : 'none'}
                    {...pathProps}
                    onPress={() => handleSelectPart('rightHand')}
                />
                {/* Right hand clickable area - significantly improved hitbox */}
                <Rect
                    x="190"  // Adjusted to center better with the right hand
                    y="300"  // Slightly moved up to cover more of the top of the hand
                    width="80" // Increased width for better hand coverage
                    height="70" // Increased height to fully cover the hand from top to bottom
                    fill="transparent"
                    onPress={() => handleSelectPart('rightHand')}
                />
            </G>
        </G>
    </G>
</Svg>

            </View>
            <Text style={styles.instructionText}>
                Tik op het lichaamsdeel
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    bodyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        maxHeight: '80%',
    },
    instructionText: {
        marginTop: 16,
        fontSize: 16,
        color: '#EA5258',
        textAlign: 'center',
        fontWeight: '500',
    }
});

export default BodyQuestion; 