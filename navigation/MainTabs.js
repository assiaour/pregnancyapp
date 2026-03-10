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

const tabIcon = (emoji) => () => <Text style={{ fontSize: 22 }}>{emoji}</Text>;

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#7B68B8',
        tabBarInactiveTintColor: '#9B8AC4',
        tabBarStyle: { backgroundColor: '#fff', borderTopColor: '#D4C8E8' },
      }}
    >
      <Tab.Screen name="Home" component={HomeStackScreen} options={{ tabBarLabel: 'Home', tabBarIcon: tabIcon('🏠') }} />
      <Tab.Screen name="Tools" component={ToolsStackScreen} options={{ tabBarLabel: 'Tools', tabBarIcon: tabIcon('🔧') }} />
      <Tab.Screen name="Articles" component={ArticlesStackScreen} options={{ tabBarLabel: 'Articles', tabBarIcon: tabIcon('📚') }} />
      <Tab.Screen name="Chat" component={ChatScreen} options={{ tabBarLabel: 'Chat', tabBarIcon: tabIcon('💬') }} />
      <Tab.Screen name="Profile" component={AccountScreen} options={{ tabBarLabel: 'Profile', tabBarIcon: tabIcon('👤') }} />
    </Tab.Navigator>
  );
}
