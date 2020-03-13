import React from 'react'
import { ScrollView, ActivityIndicator, Text, View, RefreshControl } from 'react-native'
import styles from '../Styles'
import { Card } from 'react-native-elements'
const fetch = require('isomorphic-fetch')

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

  const getDate = (epoch) => {
    var date = new Date(epoch)
    var strDate = 'd/m/y'
      .replace('d', date.getDate())
      .replace('y', date.getFullYear())
      .replace('m', date.getMonth() + 1)

    return strDate
  }

  const getData = async () => {
    if (token === null) {
      fetch('http://10.0.2.2:3333/api/v0.0.5/chits')
        .then((response) => response.json())
        .then((responseJson) => {
          setIsLoading(false)
          setChitData(responseJson)
        })
        .catch((error) => {
          console.log(error)
        })
    } else {
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
  }

  React.useEffect(() => {
    const update = navigation.addListener('focus', () => {
      getData()
    })
    // Return the function to update from the event so it gets removed on unmount
    return update
  }, [])

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
    <>
      <View>
        {/* <Header
          leftComponent={{ icon: 'menu', size: 30, color: '#fff' }}
          centerComponent={{ text: 'HOME', style: { color: '#fff', fontSize: 20 } }}
          rightComponent={
            <TouchableOpacity onPress={() => { navigation.navigate('Sign In') }}>
              <View style={{
                backgroundColor: 'white',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
                padding: 5
              }}
              >
                <Text>Sign In</Text>
              </View>
            </TouchableOpacity>}
          containerStyle={styles.headerContainer}
        /> */}
      </View>
      <View style={styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {chitData.map((item) => {
            return (
              <View key={item.chit_id}>
                <Card
                  title={item.user.given_name}
                  titleStyle={{ textAlign: 'left', paddingLeft: 10 }}
                  image={{ uri: 'http://10.0.2.2:3333/api/v0.0.5/chits/' + item.chit_id + '/photo' }}
                  containerStyle={{ borderRadius: 5 }}
                >
                  <Text style={{ marginBottom: 10 }}>
                    {getDate(item.timestamp)}
                  </Text>
                  <Text style={{ marginBottom: 10 }}>
                    {item.chit_content}
                  </Text>
                </Card>
              </View>
            )
          })}
        </ScrollView>
      </View>
    </>
  )
}
