import React, { Component } from 'react';
import { ActivityIndicator, Text, View, StyleSheet, Alert, ScrollView, TouchableOpacity, Image } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const styles = StyleSheet.create({
    container: {
        flex: 0,
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexShrink: 1,
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

function FollowersScreen({ route }) {
    const { followersData } = route.params;
    return (
        <View>
            <ScrollView>
                {followersData.map((item) => {
                    return (
                        <View key={item.user_id}>
                            <TouchableOpacity
                            // onPress={() => {
                            //     this.props.navigation.navigate('User', {
                            //         userID: item.user_id,
                            //     });
                            // }}
                            >
                                <View style={styles.item}>
                                    <Text>{item.given_name}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )
                })}
            </ScrollView>
        </View >
    );
}

function FollowingScreen({ route }) {
    const { followingData } = route.params;
    return (
        <View>
            <ScrollView>
                {followingData.map((item) => {
                    return (
                        <View key={item.user_id}>
                            <TouchableOpacity
                            // onPress={() => {
                            //     this.props.navigation.navigate('User', {
                            //         userID: item.user_id,
                            //     });
                            // }}
                            >
                                <View style={styles.item}>
                                    <Text>{item.given_name}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )
                })}
            </ScrollView>
        </View>
    );
}

const Tab = createMaterialTopTabNavigator();

export default class UserScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            userID: '',
            given_name: '',
            followers: [],
            following: [],
            photo: '',
        }
    }

    getUser(userID) {
        return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + userID)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    given_name: responseJson.given_name,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    getFollowers(userID) {
        return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + userID + '/followers')
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    followers: responseJson,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    getFollowing(userID) {
        return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + userID + '/following')
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    following: responseJson,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    getPhoto(userID) {
        return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + userID + '/photo')
            .then((response) => {
                this.setState({
                    isLoading: false,
                    photo: response,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    componentDidMount() {
        const { userID } = this.props.route.params;
        this.state.userID = userID;
        this.getUser(userID);
        this.getFollowers(userID);
        this.getFollowing(userID);
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
            <React.Fragment>
                <View style={styles.container}>
                    <Text>{this.state.given_name}</Text>

                    <Image
                        source={{ uri: 'http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.userID + '/photo' }}
                        style={styles.photo} />
                </View>

                <Tab.Navigator>
                    <Tab.Screen name="Followers" component={FollowersScreen} initialParams={{ followersData: this.state.followers }} />
                    <Tab.Screen name="Following" component={FollowingScreen} initialParams={{ followingData: this.state.following }} />
                </Tab.Navigator>
            </React.Fragment>
        );
    }
}