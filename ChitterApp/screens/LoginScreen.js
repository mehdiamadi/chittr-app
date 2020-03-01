import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Alert } from 'react-native';

class LoginScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			token: '',
		}
	}

	login() {
		return fetch("http://10.0.2.2:3333/api/v0.0.5/login",
			{
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: this.state.email,
					password: this.state.password,
				})
			})
			.then((response) => response.json())
			.then((responseJson) => {
				this.setState({
                    token: responseJson.token,
				});
				Alert.alert(this.state.token);
			})
			.catch((error) => {
				console.error(error);
			});
	}

	render() {
		return (
			<View style={{ padding: 10 }} >
				<TextInput
					style={{ height: 40 }}
					placeholder="email"
					onChangeText={(email) => this.setState({ email })}
					value={this.state.email}
				/>
				<TextInput
					style={{ height: 60 }}
					placeholder="password"
					onChangeText={(password) => this.setState({ password })}
					value={this.state.password}
				/>
				<Button
					onPress={() => this.login()}
					title="Sign In"
				//color="lightgrey"
				/>
				<Button
					onPress={() =>  this.props.navigation.navigate('Sign Up')}
					title="Sign Up"
				/>
			</View >
		);
	}
}
const styles = StyleSheet.create({
});

export default LoginScreen