import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Alert } from 'react-native';

class SignUpScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			given_name: '',
			family_name: '',
			email: '',
			password: '',
		};
	}
	signup() {
		return fetch("http://10.0.2.2:3333/api/v0.0.5/user",
			{
				method: 'POST',
				body: JSON.stringify({
					given_name: this.state.given_name,
					family_name: this.state.family_name,
					email: this.state.email,
					password: this.state.password,
				})
			})
			.then((response) => {
				Alert.alert();
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
					placeholder="given_name"
					onChangeText={(given_name) => this.setState({ given_name })}
					value={this.state.given_name}
				/>
				<TextInput
					style={{ height: 40 }}
					placeholder="family_name"
					onChangeText={(family_name) => this.setState({ family_name })}
					value={this.state.family_name}
				/>
				<TextInput
					style={{ height: 40 }}
					placeholder="email"
					onChangeText={(email) => this.setState({ email })}
					value={this.state.email}
				/>
				<TextInput
					style={{ height: 40 }}
					placeholder="password"
					onChangeText={(password) => this.setState({ password })}
					value={this.state.password}
				/>
				<Button
					onPress={() => this.signup()}
					title="Sign Up"
				/>
			</View >
		);
	}
}
const styles = StyleSheet.create({
});

export default SignUpScreen