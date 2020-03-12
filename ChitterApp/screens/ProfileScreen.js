import React from 'react'
import { Text, TextInput, View, Button, Image, TouchableOpacity } from 'react-native'
import { RNCamera } from 'react-native-camera'
import styles from '../styles'
const fetch = require('isomorphic-fetch')

export default function ProfileScreen ({ route, navigation }) {
  const [givenName, setGivenName] = React.useState('')
  const [familyName, setFamilyName] = React.useState('')
  const [emailAddress, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [photo, setPhoto] = React.useState(null)
  const [openCamera, setOpenCamera] = React.useState(false)

  const { userID } = route.params
  const { token } = route.params

  React.useEffect(() => {
    fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + userID)
      .then((response) => response.json())
      .then((responseJson) => {
        setGivenName(responseJson.given_name), // eslint-disable-line no-unused-expressions, no-sequences
        setFamilyName(responseJson.family_name),
        setEmail(responseJson.email)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  const takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true }
      const data = await this.camera.takePictureAsync(options)
      setPhoto(data)
      setOpenCamera(false)
    }
  }

  const uploadPhoto = () => {
    fetch('http://10.0.2.2:3333/api/v0.0.5/user/photo',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'image/jpeg',
          'X-Authorization': token
        },
        body: photo
      })
      .then(response => {
        console.log('upload success', response)
      })
      .catch(error => {
        console.log('upload error', error)
      })
  }

  const editUser = () => {
    uploadPhoto()
    fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + userID,
      {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Authorization': token
        },
        body: JSON.stringify({
          given_name: givenName,
          family_name: familyName,
          email: emailAddress,
          password: password
        })
      })
    navigation.navigate('Home') // go back to the home screen
  }

  return (
    openCamera === false ? (
      <>
        <Text>{givenName}</Text>

        <Image
          source={{ uri: 'http://10.0.2.2:3333/api/v0.0.5/user/' + userID + '/photo' }}
          style={styles.photo}
        />
        <View style={{ padding: 10 }}>
          <TextInput
            style={{ height: 40 }}
            onChangeText={(givenName) => setGivenName(givenName)}
            value={givenName}
          />
          <TextInput
            style={{ height: 40 }}
            onChangeText={(familyName) => setFamilyName(familyName)}
            value={familyName}
          />
          <TextInput
            style={{ height: 40 }}
            onChangeText={(email) => setEmail(email)}
            value={emailAddress}
          />
          <TextInput
            style={{ height: 40 }}
            placeholder='New password'
            onChangeText={(password) => setPassword(password)}
            value={password}
          />
          <Button
            onPress={editUser}
            title='Edit'
          />
          <Button
            onPress={() => setOpenCamera(true)}
            title='Upload New Photo'
          />
        </View>
      </>
    ) : (
      <View style={styles.container}>
        <RNCamera
          captureAudio={false}
          ref={ref => {
            this.camera = ref
          }}
          style={styles.preview}
        />
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-around' }}>
          <TouchableOpacity
            onPress={() => takePicture()}
            style={styles.capture}
          >
            <Text style={{ fontSize: 16 }}>
                CAPTURE
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setOpenCamera(false)}
            style={styles.capture}
          >
            <Text style={{ fontSize: 16 }}>
                CANCEL
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  )
}
