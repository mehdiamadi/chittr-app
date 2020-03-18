import React from 'react'
import { Text, View, Button, TouchableOpacity, ActivityIndicator, ToastAndroid } from 'react-native'
import { RNCamera } from 'react-native-camera'
import { Avatar, Input, Icon } from 'react-native-elements'
import Styles from '../Styles'
const fetch = require('isomorphic-fetch')

export default function ProfileScreen ({ route, navigation }) {
  const [user, setUser] = React.useState({ // Initial user details
    given_name: '',
    family_name: '',
    emailAddress: '',
    password: ''
  })

  const [updatedUser, setUpdatedUser] = React.useState({ // Updated user details
    given_name: '',
    family_name: '',
    email: '',
    password: ''
  })

  const [photo, setPhoto] = React.useState(null)
  const [openCamera, setOpenCamera] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)

  // Get params
  const { userID } = route.params
  const { token } = route.params

  React.useEffect(() => {
    fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + userID) // Get user details
      .then((response) => response.json())
      .then((responseJson) => {
        setUpdatedUser({ given_name: responseJson.given_name, family_name: responseJson.family_name, email: responseJson.email, password: '' }) // Copy values to updated user details
        setUser({ given_name: responseJson.given_name, family_name: responseJson.family_name, email: responseJson.email, password: '' }) // Set initial user details
        setIsLoading(false)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  const checkDiff = () => {
    const patchUserObject = {} // Empty object to hold changed user values
    Object.keys(user).forEach(function (key) { // Find difference between original and updated user objects
      if (user[key] !== updatedUser[key]) {
        patchUserObject[key] = updatedUser[key] // Add different values to patchUserObject
      }
    })
    return patchUserObject
  }

  const enabled = Object.keys(checkDiff()).length !== 0

  const takePicture = async () => { // Async function to take picture using react native camera
    if (this.camera) {
      const options = { quality: 0.5, base64: true }
      const data = await this.camera.takePictureAsync(options)
      setPhoto(data)
      setOpenCamera(false)
    }
  }

  const uploadPhoto = async () => { // Async function to upload user photo
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

  const editUser = () => { // Async function to edit user details with a patch network request
    if (photo !== null) { // If photo is not null then upload photo
      uploadPhoto()
    }

    fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + userID, // Network call to patch user details
      {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Authorization': token
        },
        body: JSON.stringify(checkDiff())
      })

    navigation.navigate('Home') // Go back to the home screen
  }

  if (isLoading) { // If isLoading is true then display activity indicator
    return (
      <View>
        <ActivityIndicator />
      </View>
    )
  }
  return (
    openCamera === false ? ( // Edit user container
      // React fragment
      <>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'stretch', padding: 10 }}>
          <Text>{user.givenName}</Text>
          <Avatar // User photo as avatar
            rounded
            source={{ uri: 'http://10.0.2.2:3333/api/v0.0.5/user/' + userID + '/photo' }}
            size='xlarge'
            showEditButton
            onPress={() => setOpenCamera(true)}
            containerStyle={{ alignSelf: 'center' }}
          />
          <View style={{ padding: 10 }}>
            <Input
              placeholder='Name'
              leftIcon={
                <Icon
                  type='font-awesome'
                  name='user'
                  size={24}
                  color='black'
                  iconStyle={Styles.signInIcons}
                />
              }
              onChangeText={(given_name) => setUpdatedUser({ ...updatedUser, given_name })} // eslint-disable-line camelcase
              value={updatedUser.given_name}
            />
            <Input
              placeholder='Family Name'
              onChangeText={(family_name) => setUpdatedUser({ ...updatedUser, family_name })} // eslint-disable-line camelcase
              value={updatedUser.family_name}
              inputStyle={{ paddingLeft: 58 }}
            />
            <Input
              placeholder='Name'
              leftIcon={
                <Icon
                  type='font-awesome'
                  name='envelope'
                  size={22}
                  color='black'
                  iconStyle={Styles.signInIcons}
                />
              }
              onChangeText={(email) => setUpdatedUser({ ...updatedUser, email })}
              value={updatedUser.email}
            />
            <Input
              placeholder='New Password'
              leftIcon={
                <Icon
                  type='font-awesome'
                  name='lock'
                  size={30}
                  color='black'
                  iconStyle={Styles.signInIcons}
                />
              }
              onChangeText={(password) => setUpdatedUser({ ...updatedUser, password })}
              value={updatedUser.password}
              secureTextEntry
            />
            <Button
              disabled={!enabled}
              onPress={editUser}
              title='Edit'
            />
          </View>
        </View>
      </>
    ) : ( // Camera container
      <View style={Styles.container}>
        <RNCamera
          captureAudio={false}
          ref={ref => {
            this.camera = ref
          }}
          style={Styles.preview}
        />
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'stretch', backgroundColor: '#000080' }}>
          <TouchableOpacity
            onPress={() => takePicture()}
          >
            <Text style={Styles.capture}>
                CAPTURE
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setOpenCamera(false)}
          >
            <Text style={Styles.capture}>
                CANCEL
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  )
}
