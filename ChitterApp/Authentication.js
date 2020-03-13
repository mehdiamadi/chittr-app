import AsyncStorage from '@react-native-community/async-storage'

export const setLocalToken = async (user) => {
  await AsyncStorage.setItem('token', JSON.stringify(user))
}

export const getToken = async () => {
  const userToken = await AsyncStorage.getItem('token')
  return JSON.parse(userToken)
}

export const removeToken = async () => {
  await AsyncStorage.removeItem('token')
}
