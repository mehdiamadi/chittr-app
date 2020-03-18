import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  capture: {
    fontSize: 16,
    color: 'white'
  },
  headerContainer: {
    marginTop: -50
  },
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  userContainer: {
    flex: 0,
    alignItems: 'center'
  },
  signInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    padding: 10
  },
  signInIcons: {
    marginRight: 20
  },
  signInTitle: {
    alignSelf: 'center',
    paddingBottom: 80
  },
  item: {
    marginTop: 12,
    padding: 30,
    fontSize: 18
  },
  avatar: {
    width: 100,
    height: 100,
    alignItems: 'center'
  },
  photo: {
    width: 100,
    height: 100,
    alignItems: 'center'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
})

export default styles
