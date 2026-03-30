import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';

import MainHomeScreen from '../screens/MainHomeScreen';
import ToolsScreen from '../screens/ToolsScreen';
import WeekDetailsScreen from '../screens/WeekDetailsScreen';
import BabySizeScreen from '../screens/BabySizeScreen';
import PregnancyCalculatorScreen from '../screens/PregnancyCalculatorScreen';
import SymptomCheckerScreen from '../screens/SymptomCheckerScreen';
import ArticlesScreen from '../screens/ArticlesScreen';
import ArticleDetailScreen from '../screens/ArticleDetailScreen';
import ChatScreen from '../screens/ChatScreen';
import AccountScreen from '../screens/AccountScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const ToolsStack = createNativeStackNavigator();
const ArticlesStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="MainHome" component={MainHomeScreen} />
      <HomeStack.Screen name="WeekDetails" component={WeekDetailsScreen} />
    </HomeStack.Navigator>
  );
}

function ToolsStackScreen() {
  return (
    <ToolsStack.Navigator screenOptions={{ headerShown: false }}>
      <ToolsStack.Screen name="ToolsList" component={ToolsScreen} />
      <ToolsStack.Screen name="WeekDetails" component={WeekDetailsScreen} />
      <ToolsStack.Screen name="BabySize" component={BabySizeScreen} />
      <ToolsStack.Screen name="Calculator" component={PregnancyCalculatorScreen} />
      <ToolsStack.Screen name="SymptomChecker" component={SymptomCheckerScreen} />
    </ToolsStack.Navigator>
  );
}

function ArticlesStackScreen() {
  return (
    <ArticlesStack.Navigator screenOptions={{ headerShown: false }}>
      <ArticlesStack.Screen name="ArticlesList" component={ArticlesScreen} />
      <ArticlesStack.Screen name="ArticleDetail" component={ArticleDetailScreen} />
    </ArticlesStack.Navigator>
  );
}

const tabIcon = (emoji, isFocused) => (
  <Text style={{
    fontSize: isFocused ? 24 : 20,
    opacity: isFocused ? 1 : 0.5,
    marginTop: 4
  }}>
    {emoji}
  </Text>
);

export default function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#9A75F0',
        tabBarInactiveTintColor: '#8A8696',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 16,
          shadowColor: '#8C72FF',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 16,
          height: 85,
          paddingBottom: 30,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        }
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          tabBarLabel: 'Accueil',
          tabBarIcon: ({ focused }) => tabIcon('🌟', focused)
        }}
      />
      <Tab.Screen
        name="Tools"
        component={ToolsStackScreen}
        options={{
          tabBarLabel: 'Outils',
          tabBarIcon: ({ focused }) => tabIcon('🧩', focused)
        }}
      />
      <Tab.Screen
        name="Articles"
        component={ArticlesStackScreen}
        options={{
          tabBarLabel: 'Articles',
          tabBarIcon: ({ focused }) => tabIcon('📰', focused)
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarLabel: 'Chat',
          tabBarIcon: ({ focused }) => tabIcon('💬', focused)
        }}
      />
      <Tab.Screen
        name="Profile"
        component={AccountScreen}
        options={{
          tabBarLabel: 'Compte',
          tabBarIcon: ({ focused }) => tabIcon('👤', focused)
        }}
      />
    </Tab.Navigator>
  );
}
