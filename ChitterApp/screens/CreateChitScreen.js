import React, { Component } from 'react';
import { Text, View, TextInput, Button, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { AuthContext } from '../Context';

export default function PostChitScreen({ route }) {

	const { user_id } = route.params;
	const { token } = route.params;

	const [locationPermission, setLocationPermission] = React.useState(false);
	const [latitude, setLatitude] = React.useState('');
	const [longtitude, setLongtitude] = React.useState('');
	const [chitContent, setChitContent] = React.useState('');
	const [givenName, setGivenName] = React.useState('');
	const [familyName, setFamilyName] = React.useState('');
	const [emailAddress, setEmail] = React.useState('');

	async function requestLocationPermission() {
		try {
			const granted = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
				{
					title: 'Lab04 Location Permission',
					message:
						'This app requires access to your location.',
					buttonNeutral: 'Ask Me Later',
					buttonNegative: 'Cancel',
					buttonPositive: 'OK',
				},
			);
			if (granted === PermissionsAndroid.RESULTS.GRANTED) {
				console.log('You can access location');
				return true;
			} else {
				console.log('Location permission denied');
				return false;
			}
		} catch (err) {
			console.warn(err);
		}
	}

	const findCoordinates = () => {
		if (!locationPermission) {
			setLocationPermission(requestLocationPermission());
		}
		else {
			Geolocation.getCurrentPosition(
				(position) => {
					const location = JSON.stringify(position);
					this.setState({ location });
				},
				(error) => {
					Alert.alert(error.message)
				},
				{
					enableHighAccuracy: true,
					timeout: 20000,
					maximumAge: 1000
				}
			);
		}
	};

	React.useEffect(() => {
		return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + user_id)
			.then((response) => response.json())
			.then((responseJson) => {
				setGivenName(responseJson.given_name);
				setFamilyName(responseJson.family_name);
				setEmail(responseJson.email);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	// const getUser = (user_id) => {
	// 	fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + userID)
	// 		.then((response) => response.json())
	// 		.then((responseJson) => {
	// 			const user = {
	// 				given_name: responseJson.given_name,
	// 				family_name: responseJson.family_name,
	// 				email: responseJson.email
	// 			}
	// 			//console.log("user id = " + user['given_name']);
	// 			return user['given_name'];
	// 		})
	// 		.catch((error) => {
	// 			console.log(error);
	// 		});
	// }

	const postChit = () => {
		return fetch("http://10.0.2.2:3333/api/v0.0.5/chits",
			{
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'X-Authorization': token,
				},
				body: JSON.stringify({
					timestamp: new Date().getTime(),
					chit_content: chitContent,
					location: ({
						longitude: 1234,
						latitude: 1234,
					}),
					user: ({
						user_id: parseInt(user_id),
						given_name: givenName,
						family_name: familyName,
						email: emailAddress,
					})
				})
			})
		// .then((response) => response.json())
		// .then((responseJson) => {

		// })
		// .catch((error) => {
		// 	console.error(error);
		// });
	};

	return (
		<View style={{ padding: 10 }} >
			<TextInput
				style={{ height: 40 }}
				placeholder="What's on your mind?"
				onChangeText={(chitContent) => setChitContent(chitContent)}
				value={chitContent}
			/>
			<Button
				onPress={postChit}
				title="Post"
			/>
		</View >
	);
}



// class CreateChitScreen extends Component{
// 	constructor(props) {
// 		super(props);
// 		this.state = {
// 			timestamp: '',
// 			chit_content: '',
// 			latitude: '',
// 			longtitude: '',

// 			given_name: '',
// 			family_name: '',
// 			email: '',
// 		}
// 	}

// 	login() {
// 		return fetch("http://10.0.2.2:3333/api/v0.0.5/chits",
// 			{
// 				method: 'POST',
// 				headers: {
// 					Accept: 'application/json',
// 					'Content-Type': 'application/json',
// 				},
// 				body: JSON.stringify({
// 					email: this.state.email,
// 					password: this.state.password,
// 					location : JSON.stringify({
// 						longtitude: this.state.longtitude,
// 						latitude: this.state.latitude,
// 					}),
// 					user : JSON.stringify({
// 						given_name: this.state.given_name,
// 						family_name: this.state.family_name,
// 						email: this.state.email,
// 					})
// 				})
// 			})
// 			.then((response) => response.json())
// 			.then((responseJson) => {
// 				this.state.token = responseJson.token;
// 				Alert.alert(this.state.token);
// 			})
// 			.catch((error) => {
// 				console.error(error);
// 			});
// 	}

// 	render() {
// 		return (
// 			<View style={{ padding: 10 }} >
// 				<TextInput
// 					style={{ height: 40 }}
// 					placeholder="email"
// 					onChangeText={(email) => this.setState({ email })}
// 					value={this.state.email}
// 				/>
// 				<TextInput
// 					style={{ height: 60 }}
// 					placeholder="password"
// 					onChangeText={(password) => this.setState({ password })}
// 					value={this.state.password}
// 				/>
// 				<Button
// 					onPress={() => this.login()}
// 					title="Sign In"
// 				//color="lightgrey"
// 				/>
// 				<Button
// 					//onPress={() => navigation.navigate('Sign Up')}
// 					title="Sign Up"
// 				/>
// 			</View >
// 		);
// 	}
// }
// export default CreateChitScreen;