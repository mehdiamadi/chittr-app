import React from 'react'
import { ScrollView, ActivityIndicator, Text, View, Image } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import styles from '../styles'
import { Card } from 'react-native-elements'
const fetch = require('isomorphic-fetch')

export default function HomeScreen ({ route, navigation }) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [chitData, setChitData] = React.useState([])

  const { token } = route.params

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

  // return (
  //   <View style={styles.container}>
  //     <ScrollView
  //       refreshControl={
  //         <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  //       }
  //     >
  //       {chitData.map((item) => {
  //         return (
  //           <View key={item.chit_id}>
  //             <Image
  //               source={{ uri: 'http://10.0.2.2:3333/api/v0.0.5/chits/' + item.chit_id + '/photo' }}
  //               style={styles.photo}
  //             />
  //             <Text style={styles.item}>
  //               {item.user.given_name}
  //               {'\n\n'}
  //               {item.chit_content}
  //             </Text>
  //           </View>
  //         )
  //       })}
  //     </ScrollView>
  //   </View>
  // )

  return (
    <View style={styles.container}>
      <ScrollView>
        {chitData.map((item) => {
          return (
            <View key={item.chit_id}>
              <Card
                title={item.user.given_name}
                image={
                  <Image
                    source={{ uri: 'http://10.0.2.2:3333/api/v0.0.5/chits/' + item.chit_id + '/photo' }}
                    style={styles.photo}
                  />
                }
              >
                <Text style={{ marginBottom: 10 }}>
                  {item.chit_content}
                </Text>
              </Card>
            </View>
          )
        })}
      </ScrollView>
    </View>
  )
}
