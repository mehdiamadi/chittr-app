import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Alert, Image } from 'react-native';
import { AuthContext } from '../Context';
import ImagePicker from 'react-native-image-picker';

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
    const [givenName, setGivenName] = React.useState('');
    const [familyName, setFamilyName] = React.useState('');
    const [emailAddress, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    //const [photo, setPhoto] = React.useState(null);

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

    showPicker = async () => {
        const options = {
            noData: true,
        };
        ImagePicker.launchImageLibrary(options, response => {
            if (response.uri) {
                uploadPhoto(response.uri);
            }
        });
    }

    // if (photo != null) {
    //     uploadPhoto();
    // }

    uploadPhoto = async (image) => {
        // Create the form data object
        var data = new FormData();
        data.append('file', {
            uri: image,
            name: 'file.jpg',
            type: 'image/jpg'
        });

        return fetch("http://10.0.2.2:3333/api/v0.0.5/user/photo",
            {
                method: 'POST',
                headers: {
                    // Accept: 'application/json',
                    //'Content-Type': 'multipart/form-data;',
                    'X-Authorization': token,
                },
                body: data
            })
            .then(response => {
                console.log('upload succes', response);
            })
            .catch(error => {
                console.log('upload error', error);
            });
    };

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
                <Button
                    onPress={showPicker}
                    title="Upload New Photo"
                />
            </View >
        </React.Fragment>
    );
}