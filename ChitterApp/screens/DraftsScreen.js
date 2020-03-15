import React from 'react'
import { ScrollView, ActivityIndicator, Text, View, TouchableOpacity } from 'react-native'
import { getDrafts } from '../DraftsAPI'
import Styles from '../Styles'

export default function DraftsScreen ({ route, navigation }) {
  const { userID } = route.params
  const { token } = route.params

  const [isLoading, setIsLoading] = React.useState(false)
  const [draftsData, setDraftsData] = React.useState(null)

  const getData = async () => {
    getDrafts().then(result => {
      if (result !== undefined) {
        var data = JSON.parse(result)
        setDraftsData(data) && setIsLoading(false)
      } else {
        setDraftsData(null)
      }
    })
  }

  React.useEffect(
    () => navigation.addListener('focus', () =>
      getData()
    ),
    []
  )

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <View style={Styles.container}>
      {draftsData == null ? (
        <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
          <Text>No drafts</Text>
        </View>
      ) : (
        <ScrollView>
          {draftsData.map((item, index) => {
            return (
              <View key={index}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Home', {
                      screen: 'Post',
                      params: {
                        draftIndex: index,
                        draftContent: item.chit_content,
                        user_id: userID,
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
