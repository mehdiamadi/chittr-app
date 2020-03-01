import React, { Component } from 'react';
import { ActivityIndicator, Text, View, StyleSheet, Alert } from 'react-native';

export default class UserScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            userID: '',
            given_name: ''
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

    componentDidMount() {
        const { userID } = this.props.route.params;
        this.getUser(userID);
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
            <View>
                <Text>{this.state.given_name}</Text>
            </View>
        );
    }
}