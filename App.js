/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {
  Platform, 
  StyleSheet, 
  Text,
  View, 
  Button,
  TouchableHighlight,
  TouchableOpacity,
  Modal,
  NavigatorIOS,
  FlatList,
  ActivityIndicator} from 'react-native';
import TableView from 'react-native-tableview';
import {yelpInfo} from './utils';
const { Section, Item } = TableView;

export default class App extends Component {
  render() {
    return (
      <NavigatorIOS
        initialRoute={{
          component: ListScene,
          title: 'List of Restaurants',
        }}
        style={{
          flex: 1
        }}
      />
    );
  }
}

export class ListScene extends Component {

  geolocation = {
    latitude: 39.904392,
    longitude:  116.812052
  }


  constructor() {
    
    super();

    console.log(this);

    this.state = {
      isLoading: false,
      restaurants: []
    };

  }

  componentDidMount() {
    if ("geolocation" in navigator) {
      /* geolocation is available */

      navigator.geolocation.getCurrentPosition((position) => {
        this.geolocation = position.coords
      });
    } else {
      /* geolocation IS NOT available */
      console.log("Geolocation is not available");
    }
  }

  findRestaurants() {
    
    this.setState({isLoading: true});

    fetch(`https://api.yelp.com/v3/businesses/search?term=restaurants&latitude=${this.geolocation.latitude}&longitude=${this.geolocation.longitude}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${yelpInfo.apiKey}`
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      const restaurants = responseJson.businesses;

      this.setState({restaurants: restaurants});
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      this.setState({isLoading: false});
    });

  }

  onRestaurantSelected(restaurant) {
    console.log(restaurant, this);
    
  }

  render() {

    const {restaurants} = this.state;

    return (
      <View 
        style={{
          flex: 1,
          flexDirection: 'column',
          paddingTop: 64
        }}>

        <TouchableOpacity
          style={{
            alignItems: 'center',
            backgroundColor: '#0092f9',
            padding: 10
         }}
         onPress={this.findRestaurants.bind(this)}
       >
         <Text
          style={{
            color: 'white'
          }}
         >Find restaurants nearby ...</Text>
       </TouchableOpacity>

        <View 
          style={{
            flex: 1,
            flexDirection: 'column'
          }}>

          <TableView
            style={{ flex: 1 }}
            onPress={event => this.onRestaurantSelected(restaurants[event.selectedIndex])}
          >
            <Section arrow>
              {restaurants.map(a => <Item key={a.id}>{a.name}</Item>)}
            </Section>
          </TableView>

        </View>
        

        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.isLoading}>
          <View 
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}>
            <View 
              style={{
                width: 100,
                height: 100,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#777777',
                borderRadius: 10
              }}>
              <ActivityIndicator
                size="large"
                color="white"></ActivityIndicator>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
