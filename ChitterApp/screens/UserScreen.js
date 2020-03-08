import React from 'react'
import { ActivityIndicator, Text, View, StyleSheet, ScrollView, TouchableOpacity, Image, Button } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
const fetch = require('isomorphic-fetch')

const styles = StyleSheet.create({
  container: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexShrink: 1
  },
  item: {
    marginTop: 12,
    padding: 30,
    backgroundColor: 'white',
    fontSize: 18
  },
  photo: {
    width: 100,
    height: 100,
    alignItems: 'center'
  }
})

function FollowersScreen ({ route }) {
  const { followersData } = route.params
  return (
    <View>
      <ScrollView>
        {followersData.map((item) => {
          return (
            <View key={item.user_id}>
              <TouchableOpacity>
                <View style={styles.item}>
                  <Text>{item.given_name}</Text>
                </View>
              </TouchableOpacity>
            </View>
          )
        })}
      </ScrollView>
    </View>
  )
}

function FollowingScreen ({ route }) {
  const { followingData } = route.params
  return (
    <View>
      <ScrollView>
        {followingData.map((item) => {
          return (
            <View key={item.user_id}>
              <TouchableOpacity>
                <View style={styles.item}>
                  <Text>{item.given_name}</Text>
                </View>
              </TouchableOpacity>
            </View>
          )
        })}
      </ScrollView>
    </View>
  )
}

const Tab = createMaterialTopTabNavigator()

export default function UserScreen ({ route, navigation }) {
  const { token } = route.params
  const { userID } = route.params
  const { authID } = route.params

  const [isLoading, setIsLoading] = React.useState(true)
  const [givenName, setGivenName] = React.useState('')
  const [followers, setFollowers] = React.useState([])
  const [following, setFollowing] = React.useState([])

  const followUser = (method) => {
    fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + userID + '/follow',
      {
        method: method,
        headers: ({
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Authorization': token
        })
      })
  }

  const getUser = () => {
    fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + userID)
      .then((response) => response.json())
      .then((responseJson) => {
        setGivenName(responseJson.given_name)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const getFollowers = () => {
    fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + userID + '/followers')
      .then((response) => response.json())
      .then((responseJson) => {
        setFollowers(responseJson)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const getFollowing = () => {
    fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + userID + '/following')
      .then((response) => response.json())
      .then((responseJson) => {
        setFollowing(responseJson)
        setIsLoading(false)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const checkIsFollowing = () => {
    for (var i = 0; i < Object.keys(followers).length; i++) {
      var user = followers[i]
      if (user.user_id === parseInt(authID)) {
        return true
      }
    }
  }

  // React.useEffect(() => {
  //     getUser();
  //     getFollowers();
  //     getFollowing();
  // }, []);

  React.useEffect(
    () => navigation.addListener('focus', () =>
      getUser(),
    getFollowers(),
    getFollowing()
    ),
    []
  )

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    )
  } else {
    return (
      <>
        <View style={styles.container}>
          <Text>{givenName}</Text>
          <Image
            source={{ uri: 'http://10.0.2.2:3333/api/v0.0.5/user/' + userID + '/photo' }}
            style={styles.photo}
          />
          {token != null && userID !== authID && checkIsFollowing()
            ? <Button title='Unfollow' onPress={followUser('DELETE')} />
            : (token != null && userID !== authID && !checkIsFollowing()
              ? <Button title='Follow' onPress={followUser('POST')} />
              : (null)
            )}
        </View>

        <Tab.Navigator>
          <Tab.Screen name='Followers' component={FollowersScreen} initialParams={{ followersData: followers }} />
          <Tab.Screen name='Following' component={FollowingScreen} initialParams={{ followingData: following }} />
        </Tab.Navigator>
      </>
    )
  }
}
