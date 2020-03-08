import React from 'react'
import { ScrollView, ActivityIndicator, Text, View, StyleSheet, RefreshControl, Image } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
const fetch = require('isomorphic-fetch')

const styles = StyleSheet.create({
  container: {
    flex: 1
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

export default function HomeScreen ({ route, navigation }) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [chitData, setChitData] = React.useState([])
  const [refreshing, setRefreshing] = React.useState(false)

  const { token } = route.params

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)

    getData().then(() => {
      setRefreshing(false)
    })
  }, [refreshing])

  const getData = async () => {
    fetch('http://10.0.2.2:3333/api/v0.0.5/chits')
      .then((response) => response.json())
      .then((responseJson) => {
        setIsLoading(false)
        setChitData(responseJson)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const getAuthData = async () => {
    fetch('http://10.0.2.2:3333/api/v0.0.5/chits',
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Authorization': token
        }
      })
      .then((response) => response.json())
      .then((responseJson) => {
        setIsLoading(false)
        setChitData(responseJson)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        if (token == null) {
          getData()
        } else {
          getAuthData()
        }
      })

      // Return the function to unsubscribe from the event so it gets removed on unmount
      return unsubscribe
    }, [])
  )

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {chitData.map((item) => {
          return (
            <View key={item.chit_id}>
              <Image
                source={{ uri: 'http://10.0.2.2:3333/api/v0.0.5/chits/' + item.chit_id + '/photo' }}
                style={styles.photo}
              />
              <Text style={styles.item}>
                {item.user.given_name}
                {'\n\n'}
                {item.chit_content}
              </Text>
            </View>
          )
        })}
      </ScrollView>
    </View>
  )
}
