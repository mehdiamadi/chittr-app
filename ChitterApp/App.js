import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/FontAwesome';
import HomeScreen from './screens/HomeScreen';
import CreateChitScreen from './screens/CreateChitScreen';
import SearchScreen from './screens/SearchScreen';
import { createStackNavigator } from '@react-navigation/stack';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export default function ChitterApp() {
	return (
		<AppDrawerNav />
	)
}

function AppStackNav({ navigation }) {
	return (
		<Stack.Navigator>
			<Stack.Screen
				component={AppTabNav}
				name = "Home"
				options={{
					headerLeft: () => (
						<Icon style={{ paddingLeft: 10 }} name="bars" size={30} onPress={() => navigation.openDrawer()} />
					)
				}}
			/>
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