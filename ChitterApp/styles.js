import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: -50
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  signInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    padding: 10
  },
  signInIcons: {
    paddingRight: 10
  },
  signInTitle: {
    alignSelf: 'center',
    paddingTop: 50
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
  }
})

export default styles