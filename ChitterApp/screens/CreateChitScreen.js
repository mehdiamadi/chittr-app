import React from 'react'
import { Text, View, TextInput, PermissionsAndroid, TouchableOpacity, Alert } from 'react-native'
import { Button } from 'react-native-elements'
import Geolocation from 'react-native-geolocation-service'
import { RNCamera } from 'react-native-camera'
import { storeDrafts, getDrafts, deleteDraftAPI, storeNewDraft, editDraft } from '../DraftsAPI'
import Styles from '../Styles'
const fetch = require('isomorphic-fetch')

export default function CreateChitScreen ({ route, navigation }) {
  // Get params
  const { userID } = route.params
  const { token } = route.params
  const { draftIndex } = route.params
  const { draftContent } = route.params

  // Declare new state variables
  const [locationPermission, setLocationPermission] = React.useState(false)
  const [latitude, setLatitude] = React.useState()
  const [longitude, setLongitude] = React.useState()
  const [chitContent, setChitContent] = React.useState('')
  const [givenName, setGivenName] = React.useState('')
  const [familyName, setFamilyName] = React.useState('')
  const [emailAddress, setEmail] = React.useState('')
  const [photo, setPhoto] = React.useState(null)
  const [openCamera, setOpenCamera] = React.useState(false)

  const enabled = chitContent.length > 0
  const draftEnabled = chitContent.length > 0 && draftContent !== chitContent

  // Add check icon on the right of the header that calls the postChit method when pressed
  navigation.setOptions({
    headerRight: () => (
      <Button
        disabled={!enabled}
        onPress={() => postChit()} // Calls post chit method
        title='Post'
        buttonStyle={{ marginRight: 10, borderRadius: 10, padding: 5 }}
      />
    )
  })

  // Save a draft if no drafts currently exist in local storage
  async function saveNewDraft () {
    // Create new draft object that holds only the chit content
    var draft = ({
      chit_content: chitContent
    })

    try {
      getDrafts().then(result => {
        if (result == null) { // If no drafts have been previously saved
          var draftData = [ // Create array to hold draft objects
            draft
          ]
          storeDrafts(JSON.stringify(draftData)) // Stores array of drafts to local storage using AsyncStorage
        } else if (draftIndex !== undefined) { // If the post is a draft
          editDraft(draftIndex, draft) // Edit the draft using the DraftsAPI editDraft method
        } else {
          storeNewDraft(draft) // Pushes new draft to existing array using AsyncStorage
        }
      })
    } catch (error) {
      console.log(error)
    }
    navigation.navigate('Home') // Navigates to the home page
  }

  async function deleteDraft () { // Async function to delete a single draft
    try {
      deleteDraftAPI(draftIndex) // Call deleteDraft function passing the draft index
      navigation.navigate('Home')
    } catch (error) {
      console.log(error)
    }
  }

  const takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true } // Set camera options
      const data = await this.camera.takePictureAsync(options) // Takes picture
      setPhoto(data) // Sets photo state to photo taken by camera
      setOpenCamera(false) // Stop displaying camera
    }
  }

  const uploadPhoto = (chitID) => { // Sends photo to assingment API
    fetch('http://10.0.2.2:3333/api/v0.0.5/chits/' + chitID + '/photo',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'image/jpeg', // Sets content type
          'X-Authorization': token // Sets authorization header with the token
        },
        body: photo // Sends photo as the body
      })
      .then(response => {
        console.log('Upload success', response)
      })
      .catch(error => {
        console.log('Upload error', error)
      })
  }

  async function requestLocationPermission () { // Request location permission
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, // Display permission prompt
        {
          title: 'Location Permission',
          message: 'This app requires access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) { // If permission is granted
        console.log('You can access location')
        return true
      } else {
        console.log('Location permission denied')
        return false
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Function to get coorindates
  const findCoordinates = () => {
    if (!locationPermission) {
      setLocationPermission(requestLocationPermission())
    } else {
      Geolocation.getCurrentPosition(
        (position) => { // set Lat and Long states from result of getCurrentPosition
          setLatitude(position.coords.latitude)
          setLongitude(position.coords.longitude)
        },
        (error) => {
          Alert.alert(error.message)
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 1000
        }
      )
    }
  }

  React.useEffect(() => {
    const update = navigation.addListener('blur', () => { // If the screen goes out of focus
      setChitContent('') // Clear chit content state
    })

    fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + userID) // Network call to get user details
      .then((response) => response.json())
      .then((responseJson) => { // Set user detail states
        setGivenName(responseJson.given_name)
        setFamilyName(responseJson.family_name)
        setEmail(responseJson.email)
      })
      .catch((error) => {
        console.log(error)
      })

    if (draftContent !== undefined) { // If a draft is being viewed
      setChitContent(draftContent) // Set chit content to the draft content
    }
    return update
  }, [findCoordinates()])

  // Async function to post a chit
  const postChit = async () => {
    if (chitContent === '') {
      Alert.alert()
    }

    fetch('http://10.0.2.2:3333/api/v0.0.5/chits',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Authorization': token // Authorization header
        },
        body: JSON.stringify({
          timestamp: new Date().getTime(),
          chit_content: chitContent,
          location: ({
            longitude: longitude,
            latitude: latitude
          }),
          user: ({
            user_id: parseInt(userID),
            given_name: givenName,
            family_name: familyName,
            email: emailAddress
          })
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        if (photo != null) { // If photo is taken upload it to the server
          uploadPhoto(responseJson.chit_id) // Call uploadPhoto function and pass the chit_it from the respose
        }
      })
      .catch((error) => {
        console.log(error)
      })

    if (draftIndex != null) { // If chit was a draft then delete it from AsyncStorage
      deleteDraft() // Delete draft
    }
    navigation.navigate('Home') // Navigate to the home page
  }

  return (
    {
      ...navigation.setOptions({ // Show header by default
        headerShown: true
      }),
      ...navigation.dangerouslyGetParent().setOptions({ // Show bottom tab navigator by default
        tabBarVisible: true
      })
    },
    openCamera === false ? ( // If camera is not requested
      <>
        <View style={{ padding: 10 }}>
          {draftContent == null ? ( // if chit is not a draft then dispaly normal text input
            <TextInput
              style={{ height: 40 }}
              placeholder="What's on your mind?"
              onChangeText={(chitContent) => setChitContent(chitContent)}
              value={chitContent}
              maxLength={141}
            />
          ) : ( // if chit is a draft then the value of the text input is the draft content
            <TextInput
              style={{ height: 40 }}
              onChangeText={(chitContent) => setChitContent(chitContent)}
              value={chitContent}
              maxLength={141}
            />
          )}
          <Button
            onPress={() => setOpenCamera(true)} // Set openCamera state to true to show the camera screen
            title='Upload Photo'
          />
          {draftIndex == null ? ( // If draft is not passed to the screen then display the save new draft button
            <Button
              disabled={!enabled}
              onPress={saveNewDraft}
              title='Save as draft'
            />
          ) : (
            <>
              <Button
                disabled={!draftEnabled}
                onPress={saveNewDraft}
                title='Save draft' // Different title to indicate a draft is being viewed
              />
              <Button // Delete draft button
                onPress={() =>
                  Alert.alert( // Confirmation alert
                    'Confirm',
                    'Are you sure you want to delete this draft?',
                    [
                      {
                        text: 'Cancel',
                        style: 'cancel'
                      },
                      { text: 'OK', onPress: () => deleteDraft() } // Call deleteDraft function if 'OK' is pressed
                    ]
                  )}
                title='Delete draft'
              />
            </>
          )}
        </View>
      </>
    ) : (
      {
        ...navigation.setOptions({ // When camera is opened, hide header and buttom tab navigator
          headerShown: false
        }),
        ...navigation.dangerouslyGetParent().setOptions({
          tabBarVisible: false
        })
      },
      <View style={Styles.container}>
        <RNCamera
          captureAudio={false} // Don't ask permission for audio
          ref={ref => {
            this.camera = ref // Ref to integrate with third party libraries
          }}
          style={Styles.preview}
        />
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'stretch', backgroundColor: '#000080' }}>
          <TouchableOpacity
            onPress={() => takePicture()} // Call take picture function
            style={Styles.capture}
          >
            <Text style={Styles.capture}>
            CAPTURE
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setOpenCamera(false)}
            style={Styles.capture}
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
