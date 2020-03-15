import React from 'react'
import { View, ActivityIndicator, ScrollView } from 'react-native'
import { Card, ListItem, SearchBar, Button } from 'react-native-elements'
import Styles from '../Styles'
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

  // const checkIsFollowing = (usernames) => {
  //   for (var i = 0; i < Object.keys(usernames).length; i++) {
  //     //console.log(usernames[i])
  //     for (var j = 0; j < Object.keys(following).length; i++) {
  //       if (following[i].user_id === usernames[i].user_id) {
  //         setIsFollowing(true)
  //       }
  //     }
  //   }
  // }

  const checkIsFollowing = (usernames, following) => {
    var usernamesCopy = usernames
    for (var i = 0; i < Object.keys(usernames).length; i++) {
      if (following.length !== 0) {
        for (var j = 0; j < Object.keys(following).length; j++) {
          //console.log(following[j].user_id, usernames[i].user_id)
          if (following[j].user_id === usernamesCopy[i].user_id) {
            usernamesCopy[i].isFollowing = true
            break
          } else {
            usernamesCopy[i].isFollowing = false
          }
        }
      } else {
        usernamesCopy[i].isFollowing = false
      }
    }
    setUsernames(usernamesCopy)
    //console.log(usernames)
  }

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
        getFollowing()

        var temp = usernames
        temp[getIndex(userID)].isFollowing = !temp[getIndex(userID)].isFollowing
        setUsernames(temp)
      })
  }

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
      {/* <Input
        placeholder='Search Username'
        leftIcon={
          <Icon
            type='font-awesome'
            name='search'
            size={24}
            color='black'
            iconStyle={styles.signInIcons}
          />
        }
        onChangeText={(username) => this.setState({ username })}
        value={this.state.username}
        onSubmitEditing={this.searchUser()}
      /> */}
      <SearchBar
        placeholder='Search Username...'
        onChangeText={(username) => setUsername(username)}
        value={username}
        platform='android'
        onSubmitEditing={() => { searchUser() }}
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
                      token !== null && item.user_id !== userID && usernames[getIndex(item.user_id)].isFollowing
                        ? <Button
                          title='Unfollow'
                          onPress={() => followUser('DELETE', item.user_id)}
                          buttonStyle={{
                            backgroundColor: 'red',
                            borderRadius: 15,
                            padding: 5
                          }}
                        />
                        : (token != null && item.user_id !== userID && !usernames[getIndex(item.user_id)].isFollowing
                          ? <Button
                            title='Follow'
                            onPress={() => followUser('POST', item.user_id)}
                            buttonStyle={{
                              backgroundColor: '#000080',
                              borderRadius: 15,
                              padding: 5
                            }}
                          />
                          : (null)
                        )
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
