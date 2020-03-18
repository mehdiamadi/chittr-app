import React, { Component } from 'react'
import { ScrollView, ActivityIndicator, View, RefreshControl, Image } from 'react-native'
import Styles from '../Styles'
import { Card, Avatar, Divider, Text } from 'react-native-elements'
const fetch = require('isomorphic-fetch')

class Chit extends Component { // Component for chit
  constructor (props) {
    super(props)
    this.state = {
      style: {
        flex: 1,
        aspectRatio: 1.5,
        resizeMode: 'contain',
        marginTop: 10
      }, // Style state for each cit photo
      validLoc: this.props.item.location !== undefined,
      location: ''
    }
  }

  // Function to convert epoch time to regular formatted time
  getDate (epoch) {
    var date = new Date(epoch)
    var strDate = 'd/m/y'
      .replace('d', date.getDate())
      .replace('y', date.getFullYear())
      .replace('m', date.getMonth() + 1)
    return strDate
  }

  // Function to get actual address from lat and long
  getLocation () {
    if (this.state.validLoc) {
      fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + this.props.item.location.latitude + ',' + this.props.item.location.longitude + '&key=AIzaSyDiOm0596xwHMzZ0pqMAN3yxXj2BJpUum0') // Get address from google geocoder API
        .then((response) => response.json())
        .then((responseJson) => {
          var location = responseJson.plus_code.compound_code
          this.setState({
            location: location.slice(8) // Remove code from location
          })
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }

  componentDidMount () {
    this.getLocation()
  }

  render () {
    return (
      <Card
        title={
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Avatar // User photo as avatar
              rounded
              source={{ uri: 'http://10.0.2.2:3333/api/v0.0.5/user/' + this.props.item.user_id + '/photo' }}
              size='medium'
            />
            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
              {this.props.item.user.given_name}
            </Text>
            <View>
              <Text style={{ marginBottom: 10 }}>
                {this.getDate(this.props.item.timestamp)}
              </Text>
              {this.state.validLoc ? ( // If location is set
                <View>
                  <Text style={{ marginBottom: 10 }}>
                    {this.state.location}
                  </Text>
                </View>
              ) : (null)}
            </View>
          </View>
        }
        titleStyle={{ textAlign: 'left', paddingLeft: 10 }}
        containerStyle={{ borderRadius: 5 }}
      >
        <Divider style={{ marginTop: 10 }} />
        <Text style={{ marginBottom: 10 }}>
          {this.props.item.chit_content}
        </Text>
        <Image
          style={this.state.style}
          source={{ uri: 'http://10.0.2.2:3333/api/v0.0.5/chits/' + this.props.item.chit_id + '/photo' }}
          onError={() => this.setState({ style: {} })} // Sets style to empty to not render the photo when nothing is returned from the network request
        />
      </Card>
    )
  }
}

export default function HomeScreen ({ route, navigation }) {
  // Declare new state variables
  const [isLoading, setIsLoading] = React.useState(true)
  const [chitData, setChitData] = React.useState([])
  const [refreshing, setRefreshing] = React.useState(false)

  const { token } = route.params

  const onRefresh = React.useCallback(() => { // Function to get data when user pulls to refresh
    setRefreshing(true)

    getData().then(() => {
      setRefreshing(false)
    })
  }, [refreshing])

  const getData = async () => {
    if (token === null) { // If user is not signed in
      return fetch('http://10.0.2.2:3333/api/v0.0.5/chits?start=0&count=end') // Gets all chits
        .then((response) => response.json())
        .then((responseJson) => {
          setIsLoading(false)
          setChitData(responseJson)
        })
        .catch((error) => {
          console.log(error)
        })
    } else { // If user is signed in then pass the token in the header
      return fetch('http://10.0.2.2:3333/api/v0.0.5/chits?start=0&count=end', // Gets all chits
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

  if (isLoading) { // If isLoading is true then display activity indicator
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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> // Add pull to refresh functionality
        }
      >
        {chitData.map((item) => { // Show each chit in chitData
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
