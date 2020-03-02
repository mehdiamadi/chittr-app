import React, { Component } from 'react';
import { Button, View, ActivityIndicator } from 'react-native';
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

const AuthContext = React.createContext();

export default function ChitterApp() {
	return (
		<AppDrawerNav />
	)
}

function SplashScreen() {
	return (
		<View>
			<ActivityIndicator />
		</View>
	)
}

function AppStackNav() {

	const [state, dispatch] = React.useReducer(
		(prevState, action) => {
			switch (action.type) {
				case 'RESTORE_TOKEN':
					return {
						...prevState,
						userToken: action.token,
						isLoading: false,
					};
				case 'SIGN_IN':
					return {
						...prevState,
						isSignout: false,
						userToken: action.token,
					};
				case 'SIGN_OUT':
					return {
						...prevState,
						isSignout: true,
						userToken: null,
					};
			}
		},
		{
			isLoading: true,
			isSignout: false,
			userToken: null,
		}
	);

	// React.useEffect(() => {
	// 	// Fetch the token from storage then navigate to our appropriate place
	// 	const bootstrapAsync = async () => {
	// 		let userToken;

	// 		try {
	// 			userToken = await AsyncStorage.getItem('userToken');
	// 		} catch (e) {
	// 			// Restoring token failed
	// 		}

	// 		// After restoring token, we may need to validate it in production apps

	// 		// This will switch to the App screen or Auth screen and this loading
	// 		// screen will be unmounted and thrown away.
	// 		dispatch({ type: 'RESTORE_TOKEN', token: userToken });
	// 	};

	// 	bootstrapAsync();
	// }, []);

	const authContext = React.useMemo(
		() => ({
			signIn: async (username, password) => {
				// In a production app, we need to send some data (usually username, password) to server and get a token
				// We will also need to handle errors if sign in failed
				// After getting token, we need to persist the token using `AsyncStorage`
				// In the example, we'll use a dummy token

				fetch("http://10.0.2.2:3333/api/v0.0.5/login",
					{
						method: 'POST',
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							email: username,
							password: password,
						})
					})
					.then((response) => response.json())
					.then((responseJson) => {
						token = responseJson.token;
						Alert.alert(this.state.token);
					})
					.catch((error) => {
						console.error(error);
					});

				dispatch({ type: 'SIGN_IN', token: token });
			},
			signOut: () => dispatch({ type: 'SIGN_OUT' }),
			signUp: async data => {
				// In a production app, we need to send user data to server and get a token
				// We will also need to handle errors if sign up failed
				// After getting token, we need to persist the token using `AsyncStorage`
				// In the example, we'll use a dummy token

				dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
			},
		}),
		[]
	);

	return (
		<AuthContext.Provider value={authContext}>
			<Stack.Navigator>
				{/* <Stack.Screen
					name="Home"
					component={AppTabNav}
					options={{
						headerShown: false,
					}}
				/>
				<Stack.Screen name="Sign In" component={LoginScreen} />
				<Stack.Screen name="Sign Up" component={SignUpScreen} />
				<Stack.Screen name="User" component={UserScreen} /> */}

				{state.isLoading ? (
					// We haven't finished checking for the token yet
					<Stack.Screen name="Splash" component={SplashScreen} />
				) : state.userToken == null ? (
					// No token found, user isn't signed in
					<Stack.Screen name="Sign In" component={LoginScreen} /> ,
					<Stack.Screen name="Sign Up" component={SignUpScreen} /> ,
					<Stack.Screen name="User" component={UserScreen} />
				) : (
							// User is signed in
							<Stack.Screen
								name="Home"
								component={AppTabNav}
								options={{
									headerShown: false,
								}}
							/>
						)}
			</Stack.Navigator>
		</AuthContext.Provider>
	)
}

function AppDrawerNav() {
	//const { signOut } = React.useContext(AuthContext);
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