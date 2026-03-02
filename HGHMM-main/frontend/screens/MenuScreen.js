import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const MenuButton = ({ onPress, children }) => (
  <TouchableOpacity 
    onPress={onPress}
    className="py-8 border-b border-gray-700/30"
  >
    <Text className="text-white text-2xl font-light">
      {children}
    </Text>
  </TouchableOpacity>
);

const MenuScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userName } = route.params || {};
  const { wistJeDat } = route.params || {};

  return (
    <View className="absolute top-0 left-0 right-0 bottom-0 w-full h-full bg-[#162433] flex-1">
      {/* Close Button */}
      <TouchableOpacity 
        className="absolute top-12 right-6 z-50 w-10 h-10 bg-gray-500/20 rounded-full flex items-center justify-center"
        onPress={() => navigation.goBack()}
      >
        <Text className="text-white text-2xl">×</Text>
      </TouchableOpacity>

      {/* Menu Container */}
      <View className="flex-1 pt-20 px-8">
        {/* Menu Header */}
        <View className="flex-row items-center">
          <Text className="text-4xl font-black text-white">
            Menu
          </Text>
        </View>

        {/* Menu Items */}
        <View className="flex-1 pt-16">
          <MenuButton onPress={() => navigation.navigate('SettingsScreen', userName, wistJeDat)}>
            Instellingen
          </MenuButton>

          <MenuButton onPress={() => navigation.navigate('MijnOverzichtScreen', userName)}>
            Mijn overzichten
          </MenuButton>

          <MenuButton onPress={() => navigation.navigate('Ondersteuning')}>
            Ondersteuning
          </MenuButton>

          <MenuButton onPress={() => navigation.navigate('Info')}>
            Info
          </MenuButton>
        </View>
      </View>
    </View>
  );
};

export default MenuScreen;
