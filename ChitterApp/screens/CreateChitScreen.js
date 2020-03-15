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

  // Add check icon on the right of the header that calls the postChit method when pressed
  navigation.setOptions({
    headerRight: () => (
      <Button
        onPress={() => postChit()}
        icon={{
          name: 'check',
          size: 30,
          color: 'white'
        }}
        buttonStyle={{ paddingRight: 10, backgroundColor: '#000080' }}
      />
    )
  })

  // Save a draft if no drafts currently exist in local storage
  async function saveNewDraft () {
    var draft = ({
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

    try {
      getDrafts().then(result => {
        if (result == null) { // if no drafts have been previously saved
          var draftData = [
            draft
          ]
          storeDrafts(JSON.stringify(draftData))
        } else if (draftIndex !== undefined) {
          console.log(draftIndex)
          editDraft(draftIndex, draft)
        } else {
          storeNewDraft(draft)
        }
      })
    } catch (e) {
      // saving error
    }
    navigation.navigate('Home')
  }

  async function deleteDraft () {
    try {
      deleteDraftAPI(draftIndex)
      navigation.navigate('Home')
    } catch (e) {
      console.log(e)
    }
  }

  const takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true }
      const data = await this.camera.takePictureAsync(options)
      setPhoto(data)
      setOpenCamera(false)
    }
  }

  const uploadPhoto = (chitID) => {
    fetch('http://10.0.2.2:3333/api/v0.0.5/chits/' + chitID + '/photo',
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

  async function requestLocationPermission () {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Lab04 Location Permission',
          message: 'This app requires access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can access location')
        return true
      } else {
        console.log('Location permission denied')
        return false
      }
    } catch (err) {
      console.warn(err)
    }
  }

  const findCoordinates = () => {
    if (!locationPermission) {
      setLocationPermission(requestLocationPermission())
    } else {
      Geolocation.getCurrentPosition(
        (position) => {
          // const location = JSON.stringify(position);
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
    const update = navigation.addListener('blur', () => {
      setChitContent('')
    })

    fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + userID)
      .then((response) => response.json())
      .then((responseJson) => {
        setGivenName(responseJson.given_name)
        setFamilyName(responseJson.family_name)
        setEmail(responseJson.email)
      })
      .catch((error) => {
        console.log(error)
      })

    if (draftContent !== undefined) {
      setChitContent(draftContent)
    }
    return update
  }, [findCoordinates()])

  const postChit = () => {
    fetch('http://10.0.2.2:3333/api/v0.0.5/chits',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Authorization': token
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
        if (photo != null) {
          uploadPhoto(responseJson.chit_id)
        }
      })
      .catch((error) => {
        console.log(error)
      })

    if (draftIndex != null) { // if chit was a draft then delete it from AsyncStorage
      deleteDraft()
    }
    navigation.navigate('Home')
  }

  return (
    {
      ...navigation.setOptions({
        headerShown: true
      }),
      ...navigation.dangerouslyGetParent().setOptions({
        tabBarVisible: true
      })
    },
    openCamera === false ? (
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
            onPress={() => setOpenCamera(true)}
            title='Upload Photo'
          />
          {draftIndex == null ? (
            <Button
              onPress={saveNewDraft}
              title='Save as draft'
            />
          ) : (
            <>
              <Button
                onPress={saveNewDraft}
                title='Save draft'
              />
              <Button
                // onPress={deleteDraft}
                onPress={() =>
                  Alert.alert(
                    'Confirm',
                    'Are you sure you want to delete this draft?',
                    [
                      {
                        text: 'Cancel',
                        style: 'cancel'
                      },
                      { text: 'OK', onPress: () => deleteDraft() }
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
        ...navigation.setOptions({
          headerShown: false
        }),
        ...navigation.dangerouslyGetParent().setOptions({
          tabBarVisible: false
        })
      },
      <View style={Styles.container}>
        <RNCamera
          captureAudio={false}
          ref={ref => {
            this.camera = ref
          }}
          style={Styles.preview}
        />
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-around' }}>
          <TouchableOpacity
            onPress={() => takePicture()}
            style={Styles.capture}
          >
            <Text style={{ fontSize: 16 }}>
            CAPTURE
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setOpenCamera(false)}
            style={Styles.capture}
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
