import React, { Component } from 'react';
import { ActivityIndicator, Text, View, StyleSheet, Alert, ScrollView, TouchableOpacity, Image, Button } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { AuthContext } from '../Context';

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

export default function UserScreen({ route }) {

    const { token } = route.params;
    const { userID } = route.params;

    const [isLoading, setIsLoading] = React.useState(true);
    const [givenName, setGivenName] = React.useState('');
    const [followers, setFollowers] = React.useState([]);
    const [following, setFollowing] = React.useState([]);

    const getUser = () => {
        fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + userID)
            .then((response) => response.json())
            .then((responseJson) => {
                setGivenName(responseJson.given_name);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const getFollowers = () => {
        fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + userID + '/followers')
            .then((response) => response.json())
            .then((responseJson) => {
                setFollowers(responseJson);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const getFollowing = () => {
        fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + userID + '/following')
            .then((response) => response.json())
            .then((responseJson) => {
                setIsLoading(false);
                setFollowing(responseJson);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    React.useEffect(() => {
        getUser();
        getFollowers();
        getFollowing();
    }, []);

    if (isLoading) {
        return (
            <View>
                <ActivityIndicator />
            </View>
        )
    }
    return (
        <React.Fragment>
            <View style={styles.container}>
                <Text>{givenName}</Text>
                <Image
                    source={{ uri: 'http://10.0.2.2:3333/api/v0.0.5/user/' + userID + '/photo' }}
                    style={styles.photo} />
                    {token != null ? (
                        <Button title="Follow"></Button>
                    ): (null)}
            </View>
            
            <Tab.Navigator>
                <Tab.Screen name="Followers" component={FollowersScreen} initialParams={{ followersData: followers }} lazy={true} />
                <Tab.Screen name="Following" component={FollowingScreen} initialParams={{ followingData: following }} lazy={true} />
            </Tab.Navigator>
        </React.Fragment>
    );
}