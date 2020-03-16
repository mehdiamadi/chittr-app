import React, { Component } from 'react'
import { ScrollView, ActivityIndicator, Text, View, RefreshControl, Image } from 'react-native'
import Styles from '../Styles'
import { Card } from 'react-native-elements'
const fetch = require('isomorphic-fetch')

class Chit extends Component {
  constructor (props) {
    super(props)
    this.state = {
      style: { width: undefined, height: undefined, aspectRatio: 1, resizeMode: 'cover' }
    }
  }

  getDate (epoch) {
    var date = new Date(epoch)
    var strDate = 'd/m/y'
      .replace('d', date.getDate())
      .replace('y', date.getFullYear())
      .replace('m', date.getMonth() + 1)
    return strDate
  }

  render () {
    return (
      <Card
        title={this.props.item.user.given_name}
        titleStyle={{ textAlign: 'left', paddingLeft: 10 }}
        containerStyle={{ borderRadius: 5 }}
      >
        <Image
          style={this.state.style}
          source={{ uri: 'http://10.0.2.2:3333/api/v0.0.5/chits/' + this.props.item.chit_id + '/photo' }}
          onError={() => this.setState({ style: {} })}
        />
        <Text style={{ marginBottom: 10 }}>
          {this.getDate(this.props.item.timestamp)}
        </Text>
        <Text style={{ marginBottom: 10 }}>
          {this.props.item.chit_content}
        </Text>
      </Card>
    )
  }
}

export default function HomeScreen ({ route, navigation }) {
  const [isLoading, setIsLoading] = React.useState(true)
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
    if (token === null) {
      return fetch('http://10.0.2.2:3333/api/v0.0.5/chits?start=0&count=end')
        .then((response) => response.json())
        .then((responseJson) => {
          setIsLoading(false)
          setChitData(responseJson)
        })
        .catch((error) => {
          console.log(error)
        })
    } else {
      return fetch('http://10.0.2.2:3333/api/v0.0.5/chits?start=0&count=end',
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
  return (
    <View style={Styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {chitData.map((item) => {
          return (
            <View key={item.chit_id}>
              <Chit item={item} />
            </View>
          )
        })}
      </ScrollView>
    </View>
  )
}
