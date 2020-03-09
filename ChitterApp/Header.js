import React from 'react'
import { Header } from 'react-native-elements'
import { Icon } from 'react-native-vector-icons/FontAwesome'
import { Styles } from './styles'

export default function Headers ({ navigation }) {
  return (
    <Header
      leftComponent={{ icon: 'menu', color: '#fff' }}
      centerComponent={{ text: 'MY TITLE', style: { color: '#fff' } }}
      rightComponent={{ icon: 'home', color: '#fff' }}
    />
  )
}
