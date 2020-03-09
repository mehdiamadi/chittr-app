import React from 'react'
import { Text, View, TextInput, Button, PermissionsAndroid, TouchableOpacity, Alert } from 'react-native'
import Geolocation from 'react-native-geolocation-service'
import ImagePicker from 'react-native-image-picker'
import { storeDrafts, getDrafts, deleteDraftAPI, storeNewDraft } from '../DraftsAPI'
import styles from '../styles'
const fetch = require('isomorphic-fetch')

export default function CreateChitScreen ({ route, navigation }) {
  const { userID } = route.params
  const { token } = route.params
  const { draftIndex } = route.params
  const { draftContent } = route.params

  const [locationPermission, setLocationPermission] = React.useState(false)
  const [latitude, setLatitude] = React.useState()
  const [longitude, setLongitude] = React.useState()
  const [chitContent, setChitContent] = React.useState('')
  const [givenName, setGivenName] = React.useState('')
  const [familyName, setFamilyName] = React.useState('')
  const [emailAddress, setEmail] = React.useState('')
  const [photo, setPhoto] = React.useState(null)

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
        } else {
          storeNewDraft(draft)
        }
      })
    } catch (e) {
      // saving error
    }

    navigation.navigate('Home')
  }

  async function saveDraft () {
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
        storeDrafts(result.push(draft))
        Alert.alert('saved')
      })
    } catch (e) {
      console.log(e)
    }
  }

  async function deleteDraft () {
    try {
      deleteDraftAPI(draftIndex)
      navigation.navigate('Home')
    } catch (e) {
      console.log(e)
    }
  }

  const showPicker = () => {
    const options = {
      noData: true
    }
    ImagePicker.launchImageLibrary(options, response => {
      if (response.uri) {
        setPhoto(response.uri)
      }
    })
  }

  const uploadPhoto = (chitID) => {
    // Create the form data object
    var data = new FormData() // eslint-disable-line no-undef
    data.append('file', {
      uri: photo,
      name: 'file.jpg',
      type: 'image/jpg'
    })

    fetch('http://10.0.2.2:3333/api/v0.0.5/chits/' + chitID + '/photo',
      {
        method: 'POST',
        headers: {
          // Accept: 'application/json',
          // 'Content-Type': 'multipart/form-data;',
          'X-Authorization': token
        },
        body: data
      })
      .then(response => {
        console.log('upload succes', response)
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
    <View style={{ padding: 10 }}>
      {draftContent == null ? ( // if chit is not a draft then dispaly normal text input
        <TextInput
          style={{ height: 40 }}
          placeholder="What's on your mind?"
          onChangeText={(chitContent) => setChitContent(chitContent)}
          value={chitContent}
        />
      ) : ( // if chit is a draft then the value of the text input is the draft content
        <TextInput
          style={{ height: 40 }}
          onChangeText={(chitContent) => setChitContent(chitContent)}
          value={chitContent}
        />
      )}
      <Button
        onPress={postChit}
        title='Post'
      />
      <Button
        onPress={showPicker}
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
            onPress={saveDraft}
            title='Save draft'
          />
          <TouchableOpacity onPress={deleteDraft}>
            <View>
              <Text>Delete draft</Text>
            </View>
          </TouchableOpacity>
        </>
      )}
      {/* <Button
        onPress={scheduleChit}
        title='Schedule Chit'
      /> */}
    </View>
  )
}
