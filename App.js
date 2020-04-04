import * as React from 'react';
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { Avatar, Card, Title, Paragraph } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { WebView } from 'react-native-webview';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;


export class HomeScreen extends React.Component {
  componentDidMount() {
    this.fetchData();
  }

  constructor(props) {
    super(props);
    this.state = { isLoading: true, dataSource: [] };
  }

  async fetchData() {
    try {
      return fetch(
        'https://newsapi.org/v2/top-headlines?country=in&apiKey=2890fe75234046e0bf976a2b8014aeae'
      )
        .then(response => response.json())
        .then(responseJson => {
          // console.log('Moview list: ', responseJson);
          this.setState(
            {
              isLoading: false,
              dataSource: responseJson.articles,
            },
            function () { }
          );
        })
        .catch(error => {
          console.error(error);
        });
    } catch (err) {
      console.warn(err);
    }
  }
  handleItemPressed = itemData => {
    // console.log('item pressed called: ', itemData);
    this.props.navigation.navigate('Profile', {
      name: itemData.title,
      url: itemData.url,
    });
  };

  render() {
    return (
      <View style={{ flex: 1, padding: 5 }}>
        <FlatList
          data={this.state.dataSource}
          renderItem={({ item }) => (
            <Card
              onPress={() => {
                this.handleItemPressed(item);
              }}
              style={{ marginTop: 5, marginStart: 5, marginEnd: 5, padding: 10 }}>
              <View style={{ flexDirection: 'row' }}>
                <Image
                  style={{ width: 80, height: 80 }}
                  source={{
                    uri: item.urlToImage,
                  }}
                />
                <Text
                  style={{ flexShrink: 1, fontSize: 18, fontWeight: '600', marginStart: 3 }}>
                  {item.title}
                </Text>

              </View>
              <View>
                {item.author ?
                  <Text
                    style={{ fontSize: 14, color: 'blue', marginStart: 3 }}>
                    Auther: {item.author}
                  </Text>
                  : null}
                <Text style={{ fontSize: 14, color: 'black' }}>
                  {item.description}
                </Text>
              </View>

              <View
                style={{
                  marginTop: 5,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={{ fontSize: 12, color: 'blue' }}>
                  {item.source.name}
                </Text>
                <Text style={{ fontSize: 12, color: 'blue' }}>
                  {item.publishedAt}
                </Text>
              </View>
            </Card>
          )}
          keyExtractor={(item, index) => `${index}`}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({});

function ProfileScreen({ navigation, route }) {
  const { url } = route.params;
  return (
    <View style={{ flex: 1, alignItems: 'flex-end' }}>
      <WebView
        source={{
          uri: url,
        }}
        startInLoadingState={true}
        scalesPageToFit={true}
        style={{
          width: deviceWidth,
          height: deviceHeight,
        }}
      />
    </View>
  );
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Home' }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: 'Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
