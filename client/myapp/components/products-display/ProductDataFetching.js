import React from 'react';
import {useState, useEffect} from 'react';
import {
  Alert,
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {useCart} from '../booked-items/CartCreation';
import NavbarProductPage from './NavbarProductPage';

const ProductDataFetching = () => {
  const [data, setData] = useState([]);
  const {addToCart} = useCart();
  const navigation = useNavigation();
  const [buttonClicked, setButtonClicked] = useState(false);
  const [page, setPage] = useState(1);

  const handleButtonPageClicked = pageNumber => {
    setPage(pageNumber);
  };
  const handleFetchProductData = async page => {
    try {
      let fetchResponse = await fetch(
        `http://192.168.68.116:3500/v1/api/product/show-product?page=${page}`,
      );
      if (!fetchResponse) {
        Alert.alert('No data found');
      } else {
        const jsonData = await fetchResponse.json();
        if (Array.isArray(jsonData)) {
          setData(jsonData);
        } else {
          Alert.alert('Response is in invalid form');
        }
      }
    } catch (error) {
      Alert.alert(`Unable to fetch data due to ${error} occured`);
    }
  };
  useEffect(() => {
    handleFetchProductData(page);
  }, [page]);

  const handleDataUpdate = ({categoryData, buttonClicked}) => {
    setButtonClicked(buttonClicked);
    setData(categoryData);
  };
  const handleCartButtonClick = item => {
    addToCart(item);
    navigation.navigate('CartDisplay');
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <NavbarProductPage onDataUpdate={handleDataUpdate} />
        {data?.map(item => (
          <View key={item._id} style={styles.cardStyling}>
            <View>
              <View>
                <View style={styles.imageWrapping}>
                  <Image
                    source={{uri: item.productImageUrl}}
                    style={styles.imageStyling}
                  />
                </View>
                <Text style={styles.headingStyling}>{item.productName}</Text>
                <Text style={styles.paragraphStyling}>
                  Delivery Time :- {item.productDeliveryTime}
                </Text>
                <Text style={styles.paragraphStyling}>
                  Delivery Charge :- ₹{item.productDeliveryFee}
                </Text>
                <Text style={styles.paragraphStyling}>₹{item.productRate}</Text>
                <Text
                  style={
                    item.productType === 'Veg'
                      ? {
                          display: 'flex',
                          color: 'green',
                          fontSize: 15,
                          fontWeight: '400',
                          padding: 1,
                          width: 'auto',
                        }
                      : {
                          color: 'red',
                          fontSize: 15,
                          fontWeight: '400',
                          padding: 1,
                        }
                  }>
                  {item.productType}
                </Text>
              </View>
              <View style={styles.buttonWrapping}>
                <TouchableOpacity
                  style={styles.buttonStyling}
                  onPress={() => handleCartButtonClick(item)}>
                  <Text style={styles.buttonTextStyling}>Add to Cart</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
        <View style={styles.pageButtonWrapping}>
          <TouchableOpacity
            style={styles.pageButtonOuterStyling}
            onPress={() => handleButtonPageClicked(1)}>
            <Text style={styles.pageButtonTextStyling}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.pageButtonOuterStyling}
            onPress={() => handleButtonPageClicked(2)}>
            <Text style={styles.pageButtonTextStyling}>2</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.pageButtonOuterStyling}
            onPress={() => handleButtonPageClicked(3)}>
            <Text style={styles.pageButtonTextStyling}>3</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductDataFetching;

const styles = StyleSheet.create({
  cardStyling: {
    padding: '3%',
    borderColor: 'black',
    borderWidth: 1,
  },
  imageStyling: {
    width: 260,
    height: 160,
    borderRadius: 15,
    borderColor: 'darkgrey',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapping: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: '3%',
  },
  headingStyling: {
    fontSize: 19,
    fontWeight: '600',
  },
  paragraphStyling: {
    fontSize: 15,
    fontWeight: '400',
  },
  buttonWrapping: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: '2%',
  },
  buttonStyling: {
    backgroundColor: 'rgb(59 130 246)',
    padding: '4%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    width: '85%',
  },
  buttonTextStyling: {
    color: 'white',
    fontSize: 16,
  },
  pageButtonWrapping: {
    backgroundColor: 'rgb(194 65 12)',
    flex: 1,
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageButtonOuterStyling: {
    backgroundColor: 'rgb(59 130 246)',
    paddingVertical: '2%',
    paddingHorizontal: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    margin: '4%',
  },
  pageButtonTextStyling: {
    color: 'white',
    fontSize: 18,
  },
});
