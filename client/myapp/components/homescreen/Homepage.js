import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import imageDelivery from '../../images/imageDelivery.png';
import imageLocation from '../../images/imageLocation.png';
import foodItem from '../../images/foodItem.png';
import itemCateg from '../../images/itemCateg.png';
import {useNavigation} from '@react-navigation/native';
const Homepage = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnimCards = useRef(new Animated.Value(0)).current;
  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 10000,
      useNativeDriver: true,
    }).start();
  };
  const fadeInCards = () => {
    Animated.timing(fadeAnimCards, {
      toValue: 1,
      duration: 13000,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    fadeIn();
    fadeInCards();
  }, []);

  const navigator = useNavigation();

  const handleButtonClick = () => {
    navigator.navigate('SignUp');
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView>
        <View>
          <Text style={styles.containerHeading}>Food-Basket</Text>
          <Animated.View style={{opacity: fadeAnim}}>
            <Text style={styles.containerAdvertisementPara}>
              Feast on flavors with Food-Basket! Order now for a taste
              sensation, delivered to your door. Satisfaction guaranteed.
            </Text>
          </Animated.View>
          <Animated.View style={{opacity: fadeAnimCards}}>
            <View style={{padding: '8%'}}>
              <View style={styles.cardStyling}>
                <Image source={foodItem} style={styles.imageStyling} />
                <Text
                  style={{color: 'white', textAlign: 'center', padding: '4%'}}>
                  Experience the freshest flavors delivered straight to your
                  door, guaranteed to tantalize your taste buds!
                </Text>
              </View>
              <View style={styles.cardStyling}>
                <Image source={imageLocation} style={styles.imageStyling} />
                <Text
                  style={{color: 'white', textAlign: 'center', padding: '4%'}}>
                  Track your delicious journey from kitchen to doorstep with
                  real-time location updates on your booked food items!
                </Text>
              </View>
              <View style={styles.cardStyling}>
                <Image source={itemCateg} style={styles.imageStyling} />
                <Text
                  style={{color: 'white', textAlign: 'center', padding: '4%'}}>
                  Explore food-items in all categories
                </Text>
              </View>
            </View>
          </Animated.View>
          <View style={styles.buttonWrapping}>
            <TouchableOpacity
              style={styles.buttonStyling}
              onPress={handleButtonClick}>
              <Text style={styles.buttonTextStyling}>Explore More</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Homepage;

const styles = StyleSheet.create({
  mainContainer: {
    display: 'flex',
    flex: 1,
    backgroundColor: 'rgb(249 115 22)',
  },
  containerHeading: {
    textAlign: 'center',
    fontSize: 40,
    paddingTop: '4%',
    color: 'white',
  },
  containerAdvertisementPara: {
    textAlign: 'center',
    fontSize: 22,
    paddingTop: '6%',
    color: 'white',
    paddingRight: '2%',
    paddingLeft: '2%',
    maxWidth: '100%',
    justifyContent: 'center',
  },

  cardStyling: {
    backgroundColor: 'rgb(194 65 12)',
    color: 'white',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: '5%',
    marginTop: '4%',
    borderColor: 'white',
    borderWidth: 3,
  },
  imageStyling: {
    width: 400,
    height: 250,
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2%',
  },
  buttonStyling: {
    display: 'flex',
    backgroundColor: 'white',
    color: 'rgb(194 65 12)',
    width: '80%',
    padding: '5%',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginBottom: '5%',
  },
  buttonWrapping: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextStyling: {
    fontSize: 22,
    color: 'rgb(194 65 12)',
  },
});
