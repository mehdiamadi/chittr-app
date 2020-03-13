import React, { Component } from 'react'
import { TextInput, View, Button } from 'react-native'
import Styles from '../Styles'
const fetch = require('isomorphic-fetch')

export default class SignUpScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      given_name: '',
      family_name: '',
      email: '',
      password: ''
    }
  }

  signup () {
    fetch('http://10.0.2.2:3333/api/v0.0.5/user',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          given_name: this.state.given_name,
          family_name: this.state.family_name,
          email: this.state.email,
          password: this.state.password
        })
      })
  }

  render () {
    return (
      <View style={{ padding: 10 }}>
        <TextInput
          style={{ height: 40 }}
          placeholder='First Name'
          onChangeText={(givenName) => this.setState({ givenName })}
          value={this.state.given_name}
        />
        <TextInput
          style={{ height: 40 }}
          placeholder='Surname'
          onChangeText={(familyName) => this.setState({ familyName })}
          value={this.state.family_name}
        />
        <TextInput
          style={{ height: 40 }}
          placeholder='Email'
          onChangeText={(email) => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          style={{ height: 40 }}
          placeholder='Password'
          onChangeText={(password) => this.setState({ password })}
          value={this.state.password}
        />
        <Button
          onPress={() => this.signup()}
          title='Sign Up'
        />
      </View>
    )
  }
}
