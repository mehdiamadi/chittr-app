import React from 'react'
import { ScrollView, ActivityIndicator, Text, View, TouchableOpacity } from 'react-native'
import { getDrafts } from '../DraftsAPI'
import Styles from '../Styles'

export default function DraftsScreen ({ route, navigation }) {
  // Get params
  const { userID } = route.params
  const { token } = route.params

  // Declare states
  const [isLoading, setIsLoading] = React.useState(false)
  const [draftsData, setDraftsData] = React.useState(null)

  // Async function to get drafts data from local storage
  const getData = async () => {
    getDrafts().then(result => {
      if (result !== undefined) { // If drafts exist
        var data = JSON.parse(result) // Parse the result into object
        setDraftsData(data) && setIsLoading(false) // Set drafts data state and loading to false
      } else {
        setDraftsData(null) // If all drafts are deleted then set DraftsData to null
      }
    })
  }

  React.useEffect(
    () => navigation.addListener('focus', () => // If the screen goes into focus
      getData()
    ),
    []
  )

  if (isLoading) { // If isLoading is true then display activity indicator
    return (
      <View>
        <ActivityIndicator />
      </View>
    )
  } else {
    return (
      <View style={Styles.container}>
        {draftsData == null ? ( // If no drafts
          <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
            <Text>No drafts</Text>
          </View>
        ) : (
          <ScrollView>
            {draftsData.map((item, index) => { //  Provided callback function once for each draft in an draftsData
              return (
                <View key={index}>
                  <TouchableOpacity
                    onPress={() => { // Navigates to nested screen 'Post'
                      navigation.navigate('Home', {
                        screen: 'Post',
                        params: { // Pass params for draft
                          draftIndex: index,
                          draftContent: item.chit_content,
                          userID: userID,
                          token: token
                        }
                      })
                    }}
                  >
                    <View style={Styles.item}>
                      <Text style={Styles.item}>
                        {item.chit_content}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )
            })}
          </ScrollView>
        )}
      </View>
    )
  }
}
