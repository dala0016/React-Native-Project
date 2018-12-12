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
  Image,
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

export class DetailsScene extends Component {
  render() {
    const {item} = this.props;
    const rating = item.rating;

    styles = {
      property: {
        color: '#999',
        fontSize: 18
      },
      value: {
        color: '#333',
        fontSize: 16
      },
      item: {
        margin: 10,
        flexDirection: 'row',
        alignItems: 'center'
      }
    };

    let ratingIcon;

    switch(rating) {
      case 0:
        ratingIcon = require('./images/rating/0.png');
        break;
      case 1:
        ratingIcon = require('./images/rating/1.png');
        break;
      case 1.5:
        ratingIcon = require('./images/rating/1_5.png');
        break;
      case 2:
        ratingIcon = require('./images/rating/2.png');
        break;
      case 2.5:
        ratingIcon = require('./images/rating/2_5.png');
        break;
      case 3:
        ratingIcon = require('./images/rating/3.png');
        break;
      case 3.5:
        ratingIcon = require('./images/rating/3_5.png');
        break;
      case 4:
        ratingIcon = require('./images/rating/4.png');
        break;
      case 4.5:
        ratingIcon = require('./images/rating/4_5.png');
        break;
      case 5:
        ratingIcon = require('./images/rating/5.png');
        break;
      default:

    };

    return (
      <View
        style={{
          paddingTop: 64
        }}>
        {item.image_url != '' && 
        <View
          style={{
            margin: 10,
            height: 300,
            flexGrow: 0,
            backgroundColor: '#F5F5F5',
            shadowOpacity: 0.75,
            shadowRadius: 5,
            shadowColor: '050505',
            shadowOffset: { height: 0, width: 0 }
          }}
        >
          <Image
            source={{
              uri: item.image_url
            }}
            style={{
              width: '100%',
              height: '100%'
            }}
          />
        </View>
        }
        <View
          style={styles.item}
        >
          <Text
            style={styles.property}
          >Name: </Text>
          <Text
            style={styles.value}
          >{item.name}</Text>
        </View>
        <View
          style={styles.item}
        >
          <Text
            style={styles.property}
          >Phone: </Text>
          <Text
            style={styles.value}
          >{item.phone}</Text>
        </View>
        <View
          style={styles.item}
        >
          <Text
            style={styles.property}
          >Distance: </Text>
          <Text
            style={styles.value}
          >{(item.distance / 1000).toFixed(2)}km</Text>
        </View>
        <View
          style={styles.item}
        >
          <Text
            style={styles.property}
          >Price: </Text>
          <Text
            style={styles.value}
          >{item.price}</Text>
        </View>
        <View
          style={styles.item}
        >
          <Text
            style={styles.property}
          >Rating: </Text>
          <Image
            source={ratingIcon}
            style={{
              width: 153,
              height: 27
            }}
          />
        </View>
      </View>
    )
  }
}

export class ListScene extends Component {

  geolocation = {
    latitude: 39.904392,
    longitude:  116.812052
  }

  constructor() {
    
    super();


    this.state = {
      isLoading: false,
      restaurants: []
    };

  }

  componentDidMount() {
    this.findRestaurants();
  }

  findRestaurants() {
    
    let doWork = () => {
      
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
    };

    if ("geolocation" in navigator) {
      /* geolocation is available */
      navigator.geolocation.getCurrentPosition((position) => {
        this.geolocation = position.coords;
        doWork();
      }, (error) => {
        console.log(error);
        doWork();
      });
    } else {
      /* geolocation IS NOT available */
      console.log("Geolocation is not available");
      doWork();
    }
    

  }

  onRestaurantSelected(restaurant) {
    this.props.navigator.push({
      title: 'Details',
      component: DetailsScene,
      passProps: {
        item: restaurant
      }
    });
  }

  render() {

    const {restaurants} = this.state;

    restaurants.sort((a, b) => { return a.distance - b.distance});

    let listData = restaurants.map((item) => {
      return <Item key={item.id}>{`${item.name} (${(item.distance / 1000).toFixed(2)} km)`}</Item>;
    });

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
            backgroundColor: '#D32323',
            padding: 10
         }}
         onPress={this.findRestaurants.bind(this)}
       >
         <Text
          style={{
            color: '#F5F5F5'
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
              {listData}
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
                backgroundColor: '#999999',
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
