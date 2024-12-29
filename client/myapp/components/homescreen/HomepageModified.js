import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
  ImageBackground,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import imageDelivery from '../../images/imageDelivery.png';
import imageLocation from '../../images/imageLocation.png';
import itemCateg from '../../images/itemCateg.png';
import backgroundImage from '../../images/backgroundImage.png';
import foodItem from '../../images/foodItem.png';
import {useNavigation} from '@react-navigation/native';

const cardData = [
  {
    id: 1,
    imageUrl: foodItem,
    description:
      'Experience the freshest flavors delivered straight to your door, guaranteed to tantalize your taste buds!',
  },
  {
    id: 2,
    imageUrl: imageDelivery,
    description:
      'Track your delicious journey from kitchen to doorstep with real-time location updates on your booked food items!',
  },
  {
    id: 3,
    imageUrl: itemCateg,
    description: 'Explore food-items in all categories',
  },
];
const HomepageModified = () => {
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
    <ImageBackground
      source={backgroundImage}
      style={styles.backgroundImage}
      resizeMode="cover">
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView>
          <View style={styles.overlay}>
            <Text style={styles.containerHeading}>
              Your Delicious Journey Starts Here
            </Text>
            <Animated.View style={{opacity: fadeAnim}}>
              <Text style={styles.containerAdvertisementPara}>
                Feast on flavors with Food-Basket! Order now for a taste
                sensation, delivered to your door. Satisfaction guaranteed.
              </Text>
            </Animated.View>
            <Animated.View style={{opacity: fadeAnim}}>
              {cardData.map(item => (
                <View
                  style={{
                    padding: '8%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  key={item.id}>
                  <View style={styles.cardStyling}>
                    <Image source={item.imageUrl} style={styles.imageStyling} />
                    <Text style={styles.cardText}>{item.description}</Text>
                  </View>
                </View>
              ))}
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
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  mainContainer: {
    flex: 1,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    padding: 20,
  },
  containerHeading: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  containerAdvertisementPara: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
  },
  cardStyling: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    overflow: 'hidden',
    padding: 0,
  },
  imageStyling: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    margin: 0,
    padding: 0,
  },
  cardText: {
    color: 'white',
    textAlign: 'center',
    padding: '4%',
    justifyContent: 'flex-start',
  },
  buttonWrapping: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  buttonStyling: {
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  buttonTextStyling: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomepageModified;
