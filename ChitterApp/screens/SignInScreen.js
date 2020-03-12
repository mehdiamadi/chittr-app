import React from 'react'
import { TextInput, View, Alert, SafeAreaView } from 'react-native'
import { AuthContext } from '../Context'
import { Input, Button, Text, Header, Icon } from 'react-native-elements'
import styles from '../styles'
const fetch = require('isomorphic-fetch')

export default function LoginScreens ({ navigation }) {
  const { signIn } = React.useContext(AuthContext)
  const [userID, setUserID] = React.useState('')
  const [email, setEmail] = React.useState('j.smith@mail.com')
  const [password, setPassword] = React.useState('password')
  const [token, setToken] = React.useState('')

  const enabled = email.length > 0 && password.length > 0
  const getToken = async () => {
    /* if (email == '' || password == '') {
    Alert.alert('');
    }
    else { */
    fetch('http://10.0.2.2:3333/api/v0.0.5/login',
      {
        method: 'POST',
        headers: ({
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
          email: email,
          password: password
        })
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        setToken(responseJson.token)
        setUserID(responseJson.id)
      })
      .catch((error) => {
        console.log(error)
        Alert.alert('Unable to sign in, check your details and try again')
      })
    // }
  }

  if (token !== '' && userID !== '') {
    signIn(token, userID)
  }

  return (
    <>
      <View>
        {/* <Header
          leftComponent={{ icon: 'arrow-back', size: 30, color: '#fff' }}
          centerComponent={{ text: 'SIGN IN', style: { color: '#fff', fontSize: 20 } }}
          containerStyle={styles.headerContainer}
        /> */}
      </View>
      <View style={styles.container}>
        <Text h1 style={styles.signInTitle}>Chittr</Text>
        <View style={styles.signInContainer}>
          <Input
            placeholder='Email Address'
            leftIcon={
              <Icon
                type='font-awesome'
                name='envelope'
                size={24}
                color='black'
                iconStyle={styles.signInIcons}
              />
            }
            onChangeText={(email) => setEmail(email)}
            value={email}
          />
          <Input
            placeholder='Password'
            leftIcon={
              <Icon
                type='font-awesome'
                name='user'
                size={24}
                color='black'
                iconStyle={{ paddingRight: 15 }}
              />
            }
            onChangeText={(password) => setPassword(password)}
            value={password}
            secureTextEntry
          />
          <Button
            disabled={!enabled}
            onPress={getToken}
            title='Sign In'
            type='solid'
            buttonStyle={{ marginTop: 100 }}
          />
          <Button
            onPress={() => navigation.navigate('Sign Up')}
            title='Sign Up'
            type='outline'
          />
        </View>
      </View>
    </>
  )
}
