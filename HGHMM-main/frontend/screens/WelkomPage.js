// Maken van de welkom page
// Prototype Slide 3
// https://xd.adobe.com/view/b5143bbc-a743-4dda-8ede-1c5d8bcdf3f4-e047/screen/41bafec7-949d-40ee-897f-69d2f4c55892

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const WelkomPage = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Vul alstublieft uw naam in');
      return;
    }

    setLoading(true);
    
    // API call in background, don't wait for it
    try {
      fetch('http://85.215.191.94:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ first_name: name }),
      });
    } catch (error) {
      console.error('API Error:', error);
      // Don't show error to user, continue with local flow
    }

    // Always navigate, regardless of API status
    navigation.navigate('RoleSelection', { userName: name });
    setLoading(false);
  };

  return (
    <View className="flex-1 bg-transparent p-4">
      <View className="flex-1 justify-center">
        <Text className="text-white mb-2">Begin je reis</Text>
        <Text className="text-white mb-2">Maar voor je begint, wat is je naam?</Text>
        <TextInput
          className="border border-gray-300 rounded-md p-2 mb-4 text-white"
          value={name}
          onChangeText={setName}
          placeholder="Vul je naam in"
          placeholderTextColor="gray"
        />
      </View>
      
      <TouchableOpacity
        className="bg-red-500 rounded-md p-4 mb-4"
        onPress={handleSubmit}
      >
        <Text className="text-white text-center text-lg">Start</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WelkomPage;

