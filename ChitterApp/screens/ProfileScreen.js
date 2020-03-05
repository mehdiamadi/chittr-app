import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Alert, Image } from 'react-native';
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

export default function ProfileScreen({ route }) {
    const [givenName, setGivenName] = React.useState('UPDATED');
    const [familyName, setFamilyName] = React.useState('UPDATED');
    const [emailAddress, setEmail] = React.useState('UPDATED');
    const [password, setPassword] = React.useState('UPDATED');
    const [details, setDetails] = React.useState({
        givenName: '',
        familyName: '',
        emailAddress: '',
    });
    const { user_id } = route.params;
    const { token } = route.params;

    React.useEffect(() => {
        fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + user_id)
            .then((response) => response.json())
            .then((responseJson) => {
                // setGivenName(responseJson.given_name);
                // setFamilyName(responseJson.family_name);
                // setEmail(responseJson.email);
                setDetails({
                    givenName: responseJson.given_name,
                    familyName: responseJson.family_name,
                    emailAddress: responseJson.email,
                })
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const editUser = () => {
        fetch("http://10.0.2.2:3333/api/v0.0.5/user/" + user_id,
            {
                method: 'PATCH',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'X-Authorization': token,
				},
                body: JSON.stringify({
                    given_name: givenName,
                    family_name: familyName,
                    email: emailAddress,
                    password: password,
                })
            })
    };

    return (
        <React.Fragment>
            <View style={styles.container}>
                <Text>{details.givenName}</Text>

                <Image
                    source={{ uri: 'http://10.0.2.2:3333/api/v0.0.5/user/' + user_id + '/photo' }}
                    style={styles.photo} />
            </View>

            <View style={{ padding: 10 }} >
                <TextInput
                    style={{ height: 40 }}
                    placeholder={details.givenName}
                    onChangeText={(given_name) => setGivenName(given_name)}
                    value={givenName}
                />
                <TextInput
                    style={{ height: 40 }}
                    placeholder={details.familyName}
                    onChangeText={(family_name) => setFamilyName(family_name)}
                    value={familyName}
                />
                <TextInput
                    style={{ height: 40 }}
                    placeholder={details.emailAddress}
                    onChangeText={(email) => setEmail(email)}
                    value={emailAddress}
                />
                <TextInput
                    style={{ height: 40 }}
                    placeholder="New password"
                    onChangeText={(password) => setPassword(password)}
                    value={password}
                />
                <Button
                    onPress={editUser}
                    title="Edit"
                />
            </View >
        </React.Fragment>
    );
}