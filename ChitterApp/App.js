import React, { Component } from 'react';
import { FlatList, ActivityIndicator, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/FontAwesome';
import HomeScreen from './screens/HomeScreen';
import CreateChitScreen from './screens/CreateChitScreen';
import SearchScreen from './screens/SearchScreen';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
	return (
		<NavigationContainer>
			<Drawer.Navigator initialRouteName="Home">
				<Drawer.Screen name="Home" component={AppTabNav} />
			</Drawer.Navigator>
		</NavigationContainer>
	);
}

function AppTabNav() {
	return (
		<Tab.Navigator>
			<Tab.Screen
				options={{
					tabBarIcon: ({ color }) => <Icon
						name="home"
						size={30}
						color={color} />
				}}
				name="Home" component={HomeScreen}
			/>
			<Tab.Screen
				options={{
					tabBarIcon: ({ color }) => <Icon
						name="plus"
						size={30}
						color={color} />
				}}
				name="Post" component={CreateChitScreen}
			/>
			<Tab.Screen
				options={{
					tabBarIcon: ({ color }) => <Icon
						name="search"
						size={30}
						color={color} />
				}}
				name="Search" component={SearchScreen}
			/>
		</Tab.Navigator>
	)
}