import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import CreateAccountScreen from './screens/CreateAccountScreen';
import CreateAccountStep2Screen from './screens/CreateAccountStep2Screen';
import CreateAccountStep3Screen from './screens/CreateAccountStep3Screen';
import CreateAccountStep4Screen from './screens/CreateAccountStep4Screen';
import CreateAccountStep5Screen from './screens/CreateAccountStep5Screen';
import CreateAccountStep6Screen from './screens/CreateAccountStep6Screen';
import CreateAccountStep7Screen from './screens/CreateAccountStep7Screen';
import GmailSignInScreen from './screens/GmailSignInScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
        <Stack.Screen name="CreateAccountStep2" component={CreateAccountStep2Screen} />
        <Stack.Screen name="CreateAccountStep3" component={CreateAccountStep3Screen} />
        <Stack.Screen name="CreateAccountStep4" component={CreateAccountStep4Screen} />
        <Stack.Screen name="CreateAccountStep5" component={CreateAccountStep5Screen} />
        <Stack.Screen name="CreateAccountStep6" component={CreateAccountStep6Screen} />
        <Stack.Screen name="CreateAccountStep7" component={CreateAccountStep7Screen} />
        <Stack.Screen name="GmailSignIn" component={GmailSignInScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}