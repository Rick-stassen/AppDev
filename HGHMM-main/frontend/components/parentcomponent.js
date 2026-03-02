import React, { useState } from 'react';
import { View, Button } from 'react-native';
import WistJeDatHandler from './WistJeDatHandler'; // Adjusted path since they are in the same folder

const ParentComponent = () => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [currentContent, setCurrentContent] = useState(null);

    const openModal = async (questionNumber) => {
        try {
            const content = await import(`./q${questionNumber}`); // Relative import path
            setCurrentContent(content.default);
            setModalVisible(true);
        } catch (error) {
            console.error('Error loading question content:', error);
        }
    };

    const closeModal = () => {
        setModalVisible(false);
        setCurrentContent(null);
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
            <Button title="Toon Vraag 1" onPress={() => openModal(1)} />
            <Button title="Toon Vraag 2" onPress={() => openModal(2)} />
            <Button title="Toon Vraag 3" onPress={() => openModal(3)} />
            <Button title="Toon Vraag 4" onPress={() => openModal(4)} />
            <WistJeDatHandler
                isVisible={isModalVisible}
                onClose={closeModal}
                content={currentContent}
            />
        </View>
    );
};

export default ParentComponent;