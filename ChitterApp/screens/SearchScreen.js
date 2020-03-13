import React, { Component } from 'react'
import { View, ActivityIndicator, ScrollView } from 'react-native'
import { Card, ListItem, SearchBar } from 'react-native-elements'
import Styles from '../Styles'
const fetch = require('isomorphic-fetch')

export default class SearchScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      username: '',
      usernames: []
    }
  }

  searchUser () {
    fetch('http://10.0.2.2:3333/api/v0.0.5/search_user?q=' + this.state.username)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          usernames: responseJson
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  render () {
    if (this.state.isLoading) {
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
          onChangeText={(username) => this.setState({ username })}
          value={this.state.username}
          platform='android'
          onSubmitEditing={() => { this.searchUser() }}
        />
        <ScrollView>
          {this.state.usernames.map((item) => {
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
                        this.props.navigation.navigate('User', {
                          userID: item.user_id
                        })
                      }}
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
}
