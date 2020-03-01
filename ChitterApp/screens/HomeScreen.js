import React, { Component } from 'react';
import { ScrollView, ActivityIndicator, Text, View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	container: {
		flex: 1,
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