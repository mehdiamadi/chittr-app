import React, { Component } from 'react';
import { ScrollView, ActivityIndicator, Text, View, StyleSheet, Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';

const Stack = createStackNavigator();

function HomeStackNav() {
	return (
		<Stack.Navigator>
			<Stack.Screen name="Login" component={LoginScreen} />
		</Stack.Navigator>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'lightgrey',
	},
	item: {
		marginTop: 12,
		padding: 30,
		backgroundColor: 'white',
		fontSize: 18,
	},
});

export default class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			shoppingListData: []
		}
	}

	getData() {
		return fetch('http://10.0.2.2:3333/api/v0.0.5/chits')
			.then((response) => response.json())
			.then((responseJson) => {
				this.setState({
					isLoading: false,
					shoppingListData: responseJson,
				});
			})
			.catch((error) => {
				console.log(error);
			});
	}

	componentDidMount() {
		this.getData();
	}

	render() {
		if (this.state.isLoading) {
			return (
				<View>
					<ActivityIndicator />
				</View>
			)
		}
		return (
			<Stack.Navigator>
				<Stack.Screen name="Login" component={LoginScreen} 
				options = {{
					headerRight: () => (
						<Button
						  onPress={() => alert('This is a button!')}
						  title="Info"
						  color="#fff"
						/>
					  ),
				}}
				/>
			</Stack.Navigator>,

			<View style={styles.container}>
				<ScrollView>
					{this.state.shoppingListData.map((item) => {
						return (
							<View key={item.chit_id}>
								<Text style={styles.item}>{item.user.given_name}{"\n\n"}{item.chit_content}</Text>
							</View>
						)
					})}

				</ScrollView>
			</View>
		);
	}
}