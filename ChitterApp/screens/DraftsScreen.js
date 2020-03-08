import React, { Component } from 'react';
import { ScrollView, ActivityIndicator, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { storeDrafts, getDrafts } from '../DraftsAPI';

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
	photo: {
		width: 100,
		height: 100,
		alignItems: 'center',
	},
});

export default function DraftsScreen({ route, navigation }) {
	const { user_id } = route.params;
	const { token } = route.params;

	const [isLoading, setIsLoading] = React.useState(false);
	const [draftsData, setDraftsData] = React.useState(null);

	getData = async () => {
		getDrafts().then(result => {
			if (result != undefined) {
				var data = JSON.parse(result);
				setDraftsData(data) && setIsLoading(false);
			}
			else {
				setDraftsData(null);
			}
		})
	};

	React.useEffect(
		() => navigation.addListener('focus', () =>
			console.log('i got here'),
			getData(),
			console.log(draftsData),
		),
		[]
	);

	// React.useEffect(() => {
	// 	const update = navigation.addListener('focus', () => {
	// 		getData()
	// 	  });

	// 	  // Return the function to unsubscribe from the event so it gets removed on unmount
	// 	  return update;
	// }, []);


	if (isLoading) {
		return (
			<View>
				<ActivityIndicator />
			</View>
		)
	}

	return (
		<View style={styles.container}>
			{draftsData == null ? (
				<Text>No drafts</Text>
			) : (
					<ScrollView>
						{draftsData.map((item, index) => {
							return (
								<View key={index}>
									<TouchableOpacity
										onPress={() => {
											navigation.navigate('Home', {
												screen: 'Post', params: {
													draftIndex: index,
													draftContent: item.chit_content,
													user_id: user_id,
													token: token
												}
											});
										}}>
										<View style={styles.item}>
											<Text style={styles.item}>
												{item.chit_content}
											</Text>
										</View>
									</TouchableOpacity>
								</View>
							)
						})}
					</ScrollView>
				)}
		</View>
	)
}