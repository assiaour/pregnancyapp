import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { UserProvider } from './context/UserContext';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import CreateAccountScreen from './screens/CreateAccountScreen';
import CreateAccountStep2Screen from './screens/CreateAccountStep2Screen';
import CreateAccountStep3Screen from './screens/CreateAccountStep3Screen';
import CreateAccountStep4Screen from './screens/CreateAccountStep4Screen';
import CreateAccountStep5Screen from './screens/CreateAccountStep5Screen';
import CreateAccountStep6Screen from './screens/CreateAccountStep6Screen';
import CreateAccountStep7Screen from './screens/CreateAccountStep7Screen';
import CreateAccountStep8Screen from './screens/CreateAccountStep8Screen';

import GmailSignInScreen from './screens/GmailSignInScreen';
import MainTabs from './navigation/MainTabs';
import { useUser } from './context/UserContext';
import { ActivityIndicator, View } from 'react-native';

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { user, hydrating } = useUser();
  if (hydrating) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F0FA' }}>
        <ActivityIndicator size="large" color="#7B68B8" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
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
      <Stack.Screen name="CreateAccountStep8" component={CreateAccountStep8Screen} />
      <Stack.Screen name="GmailSignIn" component={GmailSignInScreen} />
      
      {user && (
        <Stack.Screen name="MainTabs" component={MainTabs} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </UserProvider>
    </SafeAreaProvider>
  );
}