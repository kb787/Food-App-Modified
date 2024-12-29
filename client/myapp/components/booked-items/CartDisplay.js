import React from 'react';
import {useCart} from './CartCreation';
import {useState, useEffect} from 'react';
import Stripepaymentgateway from '../CheckoutScreen/Stripepaymentgateway';
import PaymentScreen from '../razorpay-gateway/PaymentScreen';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';

const CartDisplay = () => {
  const [loading, setLoading] = useState(false);
  const {cart} = useCart();
  const calculateTotalPrice = () => {
    let totalPrice = 0;
    cart.forEach(item => {
      totalPrice += item.productRate + item.productDeliveryFee;
    });
    return totalPrice;
  };
  const handleCheckout = async () => {
    setLoading(true);

    try {
      const response = await fetch('http://192.168.209.116:3500/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart,
          totalPrice: calculateTotalPrice(),
        }),
      });

      if (response.ok) {
        console.log('Checkout successful!');
        // Optionally, you can handle success in the frontend here
      } else {
        console.error('Error during checkout:', response.statusText);
        // Handle error in the frontend
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      // Handle network or other errors in the frontend
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleCheckout();
  }, []);

  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <View style={styles.headingWrapping}>
            <Text style={styles.contentHeading}>Cart Items</Text>
          </View>
          {cart.length === 0 ? (
            <Text>Your cart is empty.</Text>
          ) : (
            cart.map(item => (
              <View key={item._id}>
                <View style={styles.cardStyling}>
                  <View>
                    <View>
                      <View style={styles.imageWrapping}>
                        <Image
                          source={{uri: item.productImageUrl}}
                          style={styles.imageStyling}
                        />
                      </View>
                      <Text style={styles.headingStyling}>
                        {item.productName}
                      </Text>
                      <Text style={styles.paragraphStyling}>
                        Delivery Time: {item.productDeliveryTime}
                      </Text>
                      <Text style={styles.paragraphStyling}>
                        Delivery Charge: ₹{item.productDeliveryFee}
                      </Text>
                      <Text style={styles.paragraphStyling}>
                        ₹{item.productRate}
                      </Text>
                      <Text
                        style={{
                          color: item.productType === 'Veg' ? 'green' : 'red',
                          fontSize: 15,
                          fontWeight: '400',
                          padding: 1,
                        }}>
                        {item.productType}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))
          )}
          {cart.length > 0 && (
            <React.Fragment>
              <Text style={styles.totalPriceText}>
                Total Price: ₹{calculateTotalPrice()}
              </Text>
              {/* <Stripepaymentgateway
                cartItems={cart}
                totalAmount={calculateTotalPrice()}
              /> */}
              <PaymentScreen
                paymentData={cart}
                paymentAmount={calculateTotalPrice()}
              />
            </React.Fragment>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default CartDisplay;

const styles = StyleSheet.create({
  cardStyling: {
    padding: '3%',
    borderColor: 'black',
    borderWidth: 1,
  },
  headingWrapping: {
    backgroundColor: 'rgb(194 65 12)',
    padding: '2%',
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
  contentHeading: {
    fontSize: 25,
    padding: '4%',
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'rgb(194 65 12)',
  },
  totalPriceText: {
    margin: '2%',
    fontSize: 18,
  },
});
