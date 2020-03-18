import React from 'react'
import { View, ActivityIndicator, ScrollView } from 'react-native'
import { Card, ListItem, SearchBar, Button } from 'react-native-elements'
const fetch = require('isomorphic-fetch')

export default function SearchScreen ({ route, navigation }) {
  const { userID } = route.params
  const { token } = route.params

  const [username, setUsername] = React.useState('')
  const [usernames, setUsernames] = React.useState([])
  const [following, setFollowing] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    getFollowing()
  }, [])

  // Async function to search for a user
  const searchUser = async () => {
    setIsLoading(true)
    fetch('http://10.0.2.2:3333/api/v0.0.5/search_user?q=' + username)
      .then((response) => response.json())
      .then((responseJson) => {
        setIsLoading(false)
        checkIsFollowing(responseJson, following)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  // Async function to get the following list of a user
  const getFollowing = async () => {
    fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + userID + '/following')
      .then((response) => response.json())
      .then((responseJson) => {
        setFollowing(responseJson)
        if (usernames !== []) {
          checkIsFollowing(usernames, responseJson)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  // Function to check if the user in the search result is being followed by the signed in user
  const checkIsFollowing = (usernames, following) => {
    var usernamesCopy = usernames // Create copy of usernames
    for (var i = 0; i < Object.keys(usernames).length; i++) { // Loop through each user in the search result
      if (following.length !== 0) { // If the user is following other users
        for (var j = 0; j < Object.keys(following).length; j++) { // Loop through each user in the user following list
          if (following[j].user_id === usernamesCopy[i].user_id) { // If user in the search result matches a user in the following list
            usernamesCopy[i].isFollowing = true // Set isFollowing property of the user to true
            break
          } else {
            usernamesCopy[i].isFollowing = false
          }
        }
      } else {
        usernamesCopy[i].isFollowing = false
      }
    }
    setUsernames(usernamesCopy) // Set usernames state to the updated usernames isFollowing properties
  }

  // Async function to follow a user, takes method as a paramter to specify a follow or unfollow request
  const followUser = async (method, userID) => {
    fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + userID + '/follow',
      {
        method: method,
        headers: ({
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Authorization': token
        })
      })
      .then((response) => {
        getFollowing() // Get new following list

        var temp = usernames
        temp[getIndex(userID)].isFollowing = !temp[getIndex(userID)].isFollowing // Changes the user's isFollowing property after the follow/unfollow reuqest to the opposite
        setUsernames(temp)
      })
  }

  // Function that gets the index of a user in the usernames array using the userID
  const getIndex = (userID) => {
    for (var i = 0; i < Object.keys(usernames).length; i++) {
      if (userID === usernames[i].user_id) {
        return i
      }
    }
  }

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    )
  }
  return (
    <View>
      <SearchBar
        placeholder='Search Username...'
        onChangeText={(username) => setUsername(username)}
        value={username}
        platform='android' // Search bar style type
        onSubmitEditing={() => { searchUser() }} // Call searchUser function when enter is pressed on the keyboard
      />
      <ScrollView>
        {usernames.map((item) => {
          return (
            <View key={item.user_id}>
              <Card containerStyle={{ padding: 0 }}>
                {
                  <ListItem
                    key={item.user_id}
                    roundAvatar
                    title={item.given_name}
                    leftAvatar={{ source: { uri: 'http://10.0.2.2:3333/api/v0.0.5/user/' + item.user_id + '/photo' } }}
                    onPress={() => {
                      navigation.navigate('User', {
                        userID: item.user_id
                      })
                    }}
                    rightElement={
                      token !== null && item.user_id !== userID && usernames[getIndex(item.user_id)].isFollowing // If user is already followed
                        ? <Button
                          title='Unfollow'
                          onPress={() => followUser('DELETE', item.user_id)}
                          buttonStyle={{
                            backgroundColor: 'red',
                            borderRadius: 15,
                            padding: 5
                          }}
                          /> // eslint-disable-line indent
                        : (token != null && item.user_id !== userID && !usernames[getIndex(item.user_id)].isFollowing // If user is not followed
                          ? <Button
                            title='Follow'
                            onPress={() => followUser('POST', item.user_id)}
                            buttonStyle={{
                              backgroundColor: '#000080',
                              borderRadius: 15,
                              padding: 5
                            }}
                            /> // eslint-disable-line indent
                          : (null)
                    ) // eslint-disable-line indent
                    }
                    chevron
                  />
                }
              </Card>
            </View>
          )
        })}
      </ScrollView>
    </View>
  )
}
