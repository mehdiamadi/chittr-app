import React, { Component } from 'react';
import { Text, View, TextInput, Button, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { AuthContext } from '../Context';
import ImagePicker from 'react-native-image-picker';

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
	const [photo, setPhoto] = React.useState(null);

	showPicker = async () => {
		const options = {
			noData: true,
		};
		ImagePicker.launchImageLibrary(options, response => {
			if (response.uri) {
				setPhoto(response.uri);
			}
		});
	}

	uploadPhoto = async (chit_id) => {
		// Create the form data object
		var data = new FormData();
		data.append('file', {
			uri: photo,
			name: 'file.jpg',
			type: 'image/jpg'
		});

		return fetch("http://10.0.2.2:3333/api/v0.0.5/chits/"+ chit_id + "/photo",
			{
				method: 'POST',
				headers: {
					// Accept: 'application/json',
					//'Content-Type': 'multipart/form-data;',
					'X-Authorization': token,
				},
				body: data
			})
			.then(response => {
				console.log('upload succes', response);
			})
			.catch(error => {
				console.log('upload error', error);
			});
	};

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
		fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + user_id)
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
			.then((response) => response.json())
			.then((responseJson) => {
				if (photo != null) {
					uploadPhoto(responseJson.chit_id);
				}
			})
			.catch((error) => {
				console.log(error);
			});
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
			<Button
				onPress={showPicker}
				title="Upload Photo"
			/>
		</View >
	);
}