import React, { Component } from 'react';
import { Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

import Icon from 'react-native-vector-icons/FontAwesome';

import HomeScreen from './screens/HomeScreen';
import CreateChitScreen from './screens/CreateChitScreen';
import SearchScreen from './screens/SearchScreen';
import LoginScreen from './screens/LoginScreen'
import SignUpScreen from './screens/SignUpScreen';
import UserScreen from './screens/UserScreen';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export default function ChitterApp() {
	return (
		<AppDrawerNav />
	)
}

function AppStackNav() {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="Home"
				component={AppTabNav}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen name="Sign In" component={LoginScreen} />
			<Stack.Screen name="Sign Up" component={SignUpScreen} />
			<Stack.Screen name="User" component={UserScreen} />
		</Stack.Navigator>
	)
}

function AppDrawerNav() {
	return (
		<NavigationContainer>
			<Drawer.Navigator>
				<Drawer.Screen name="Home" component={AppStackNav} />
			</Drawer.Navigator>
		</NavigationContainer>

	);
}

function HomeStackNav({ navigation }) {
	return (
		<Stack.Navigator>
			<Stack.Screen name="Home" component={HomeScreen}
				options={{
					headerLeft: () => (
						<Icon style={{ paddingLeft: 10 }} name="bars" size={30} onPress={() => navigation.openDrawer()} />
					),
					headerRight: () => (
						<Button
							onPress={() => navigation.navigate('Sign In')}
							title="Sign In"
							color="lightgrey"
						/>
					),
				}}
			/>
		</Stack.Navigator>
	);
}

function PostChitStackNav({ navigation }) {
	return (
		<Stack.Navigator>
			<Stack.Screen name="Post" component={CreateChitScreen}
				options={{
					headerLeft: () => (
						<Icon style={{ paddingLeft: 10 }} name="bars" size={30} onPress={() => navigation.openDrawer()} />
					),
				}} />
		</Stack.Navigator>
	);
}

function SearchStackNav({ navigation }) {
	return (
		<Stack.Navigator>
			<Stack.Screen name="Search" component={SearchScreen}
				options={{
					headerLeft: () => (
						<Icon style={{ paddingLeft: 10 }} name="bars" size={30} onPress={() => navigation.openDrawer()} />
					),
				}} />
		</Stack.Navigator>
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
				name="Home" component={HomeStackNav}
			/>
			<Tab.Screen
				options={{
					tabBarIcon: ({ color }) => <Icon
						name="plus"
						size={30}
						color={color} />
				}}
				name="Post" component={PostChitStackNav}
			/>
			<Tab.Screen
				options={{
					tabBarIcon: ({ color }) => <Icon
						name="search"
						size={30}
						color={color} />
				}}
				name="Search" component={SearchStackNav}
			/>
		</Tab.Navigator>
	)
}