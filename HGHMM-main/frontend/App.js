//Notes:
//1. Maybe add the Lucht Background Image in App.js, so it's present on all screens. (done) (refrenced by <Lucht />)
//2. Add the RotatePhone SVG in App.js, so it's it can tell the user on all screens. (done) (refrenced by <RotatePhone />)
//3. Add the LoadingScreen in App.js, so it's able to be used on all screens. (done) (refrenced by <LoadingScreen />)

// App.js

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, View, Text, useWindowDimensions } from 'react-native';
import RotatePhone from './assets/svg/RotatePhone.svg';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import LoadingScreen from './screens/LoadingScreen';
import WelkomSlide from './screens/Introscreens/WelkomSlide';
import IjsbergPage from './screens/Introscreens/IjsbergPage';
import Rollen from './screens/Introscreens/Rollen';
import Name from './screens/Introscreens/Name';
import FadeTransition from './components/FadeTransition';
import SettingsScreen from './screens/SettingsScreen';
import InfoScreen from './screens/InfoScreen';
import OndersteuningScreen from './screens/OndersteuningScreen';
import QuestionScreen from './screens/QuestionScreen';
import ResultsScreen from './screens/ResultsScreen';
import MenuScreen from './screens/MenuScreen';
import MijnOverzichtScreen from './screens/MijnOverzichtScreen';
import Lucht from './assets/svg/lucht.svg';

const Stack = createNativeStackNavigator();

const ScreenWrapper = ({ children }) => {
  const { width, height } = useWindowDimensions();
  
  return (
    <View className="flex-1 relative">
      <View className="absolute inset-0 w-full h-full">
        <Lucht width="100%" height="100%" style={{ minWidth: '100%', minHeight: '100%' }} preserveAspectRatio="xMidYMid slice" />
      </View>
      {children}
    </View>
  );
};

export default function App() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  return (
    <NavigationContainer>
      <SafeAreaView className="flex-1">
        {isLandscape ? (
          <View className="flex-1 items-center justify-center">
            <RotatePhone width={100} height={100} />
            <Text className="mt-4 text-lg font-medium text-center">
              Please rotate your device{'\n'}to portrait mode
            </Text>
          </View>
        ) : (
          <Stack.Navigator 
            screenOptions={{ 
              headerShown: false,
              contentStyle: { backgroundColor: 'transparent' },
              animation: 'fade',
              animationDuration: 300,
            }}
          >
            <Stack.Screen name="Loading">
              {props => (
                <ScreenWrapper>
                  <LoadingScreen {...props} />
                </ScreenWrapper>
              )}
            </Stack.Screen>
            <Stack.Screen name="WelkomSlide">
              {props => (
                <ScreenWrapper>
                  <FadeTransition>
                    <WelkomSlide {...props} />
                  </FadeTransition>
                </ScreenWrapper>
              )}
            </Stack.Screen>
            <Stack.Screen name="IjsbergPage">
              {props => (
                <ScreenWrapper>
                  <IjsbergPage {...props} />
                </ScreenWrapper>
              )}
            </Stack.Screen>
            <Stack.Screen name="Rollen">
              {props => (
                <ScreenWrapper>
                  <Rollen {...props} />
                </ScreenWrapper>
              )}
            </Stack.Screen>
            <Stack.Screen name="Name">
              {props => (
                <ScreenWrapper>
                  <Name {...props} />
                </ScreenWrapper>
              )}
            </Stack.Screen>
            <Stack.Screen name="HomeScreen">
              {props => (
                <ScreenWrapper>
                  <HomeScreen {...props} />
                </ScreenWrapper>
              )}
            </Stack.Screen>
            <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
            <Stack.Screen name="Info" component={InfoScreen} />
            <Stack.Screen name="Ondersteuning" component={OndersteuningScreen} />
            <Stack.Screen name='Menu' component={MenuScreen} />
            <Stack.Screen 
              name='MijnOverzichtScreen' 
              component={MijnOverzichtScreen}
              options={{
                  headerShown: false
              }} 
            />
            <Stack.Screen name="Question">
              {props => (
                <ScreenWrapper>
                  <QuestionScreen {...props} />
                </ScreenWrapper>
              )}
            </Stack.Screen>
            <Stack.Screen name="Results">
              {props => (
                <ScreenWrapper>
                  <ResultsScreen {...props} />
                </ScreenWrapper>
              )}
            </Stack.Screen>
          </Stack.Navigator>
        )}
        <StatusBar style="dark" />
      </SafeAreaView>
    </NavigationContainer>
  );
}