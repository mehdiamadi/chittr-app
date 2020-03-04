import React, { Component } from 'react';
import { Button, View, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

import Icon from 'react-native-vector-icons/FontAwesome';
import AIcon from 'react-native-vector-icons/MaterialIcons';

import HomeScreen from './screens/HomeScreen';
import CreateChitScreen from './screens/CreateChitScreen';
import SearchScreen from './screens/SearchScreen';
import SignInScreen from './screens/SignInScreen'
import SignUpScreen from './screens/SignUpScreen';
import UserScreen from './screens/UserScreen';

import { AuthContext } from './Context';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
var loggedIn = false;

export default function ChittrApp() {
	const [isLoading, setIsLoading] = React.useState(true);
	const [userToken, setUserToken] = React.useState(null);

	const authContext = React.useMemo(() => {
		return {
			signIn: (token) => {
				setIsLoading(false);
				setUserToken(token);
				loggedIn = true;
			},
			signUp: () => {
				setIsLoading(false);
				setUserToken(null);
			},
			signOut: () => {
				setIsLoading(false);
				setUserToken(null);
			}
		};
	}, []);

	React.useEffect(() => {
		setTimeout(() => {
			setIsLoading(false);
		}, 1000);
	}, []);

	if (isLoading) {
		return <SplashScreen />;
	}

	return (
		<AuthContext.Provider value={authContext}>
			{userToken == null ? (
				// No token found, user isn't signed in
				<AppDrawerNav />
			) : (
					// User is signed in
					<AuthDrawerNav />
				)}
		</AuthContext.Provider>
	);
}

function SplashScreen() {
	return (
		<View>
			<ActivityIndicator />
		</View>
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
			<Stack.Screen name="Sign In" component={SignInScreen} />
			<Stack.Screen name="Sign Up" component={SignUpScreen} />
			<Stack.Screen name="User" component={UserScreen} />
		</Stack.Navigator>
	)
}

function SignOut() {
	const { signOut } = React.useContext(AuthContext);
	return (
		<Button title='Sign Out' onPress={signOut()} />
	)
}

function AuthDrawerNav() {
	return (
		<NavigationContainer>
			<Drawer.Navigator>
				<Drawer.Screen name="Home" component={AppStackNav} />
				<Drawer.Screen name="Profile" component={UserScreen} />
				<Drawer.Screen name="Sign Out" component={SignOut} />
			</Drawer.Navigator>
		</NavigationContainer>
	);
}

function SignInStack({ navigation }) {
	return (
		<Stack.Navigator>
			<Stack.Screen name="Sign In" component={SignInScreen}
				options={{
					headerLeft: () => (
						<AIcon style={{ paddingLeft: 10 }} name="arrow-back" size={30} onPress={() => navigation.navigate('Home')} />
					),
				}} />
		</Stack.Navigator>
	);
}

function SignUpStack({ navigation }) {
	return (
		<Stack.Navigator>
			<Stack.Screen name="Sign Up" component={SignUpScreen}
				options={{
					headerLeft: () => (
						<Icon style={{ paddingLeft: 10 }} name="angle-left" size={30} onPress={() => navigation.navigate('Home')} />
					),
				}} />
		</Stack.Navigator>
	);
}

function AppDrawerNav() {
	return (
		<NavigationContainer>
			<Drawer.Navigator>
				<Drawer.Screen name="Home" component={AppStackNav} />
				<Drawer.Screen name="Sign In" component={SignInStack} />
				<Drawer.Screen name="Sign Up" component={SignUpStack} />
			</Drawer.Navigator>
		</NavigationContainer>
	);
}

function HomeStackNav({ navigation }) {
	return (
		<Stack.Navigator>
			{loggedIn ? (
				// User isn't signed in
				<Stack.Screen name="Home" component={HomeScreen}
					options={{
						headerLeft: () => (
							<Icon style={{ paddingLeft: 10 }} name="bars" size={30} onPress={() => navigation.openDrawer()} />
						),
					}}
				/>
			) : (
					// User is signed in
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
				)}
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

function AuthTabNav() {
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

function UnAuthTabNav() {
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
						name="search"
						size={30}
						color={color} />
				}}
				name="Search" component={SearchStackNav}
			/>
		</Tab.Navigator>
	)
}

function AppTabNav() {
	if (loggedIn) {
		return <AuthTabNav />
	}
	else {
		return <UnAuthTabNav />
	}
}