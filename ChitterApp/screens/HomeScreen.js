import React, { Component } from 'react';
import { ScrollView, ActivityIndicator, Text, View, StyleSheet, RefreshControl } from 'react-native';

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

function wait(timeout) {
	return new Promise(resolve => {
		setTimeout(resolve, timeout);
	});
}

export default function HomeScreen() {

	const [isLoading, setIsLoading] = React.useState(false);
	const [chitData, setChitData] = React.useState([]);
	const [refreshing, setRefreshing] = React.useState(false);

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);

		getData().then(() => {
			setRefreshing(false);
		});
	}, [refreshing]);

	getData = async() => {
		fetch('http://10.0.2.2:3333/api/v0.0.5/chits')
			.then((response) => response.json())
			.then((responseJson) => {
				setIsLoading(false);
				setChitData(responseJson);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	React.useEffect(() => {
		getData();
	}, []);

	if (isLoading) {
		return (
			<View>
				<ActivityIndicator />
			</View>
		)
	}
	return (
		<View style={styles.container}>
			<ScrollView
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}>
				{chitData.map((item) => {
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