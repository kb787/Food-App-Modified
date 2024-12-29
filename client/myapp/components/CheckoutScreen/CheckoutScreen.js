import React, {useState} from 'react';
import {useStripe} from '@stripe/stripe-react-native';
import {
  SafeAreaView,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';

const CheckoutScreen = ({cartData, totalPrice}) => {
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const [loading, setLoading] = useState(false);
  const [paymentInitialized, setPaymentInitialized] = useState(false);

  const handleCheckout = async () => {
    try {
      const response = await fetch(
        'http://192.168.209.116:3500/v1/api/checkout',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cart: cartData,
            totalPrice: totalPrice,
          }),
        },
      );

      if (!response.ok) {
        throw new Error('Checkout failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error during checkout:', error);
      Alert.alert(
        'Error',
        'Unable to process checkout. Please try again later.',
      );
      return null;
    }
  };
  const fetchPaymentSheetParams = async () => {
    try {
      const response = await fetch(
        'http://192.168.209.116:3500/v1/api/payment-sheet',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const {paymentIntent, ephemeralKey, customer} = await response.json();
      return {
        paymentIntent,
        ephemeralKey,
        customer,
      };
    } catch (error) {
      console.error('Error fetching payment sheet params:', error);
      Alert.alert(
        'Error',
        'Unable to initialize payment. Please try again later.',
      );
      return null;
    }
  };

  const initializePaymentSheet = async () => {
    try {
      setLoading(true);
      const params = await fetchPaymentSheetParams();

      if (!params) {
        return false;
      }

      const {paymentIntent, ephemeralKey, customer} = params;

      const {error} = await initPaymentSheet({
        merchantDisplayName: 'Example, Inc.',
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          name: 'Jane Doe',
        },
      });

      if (error) {
        console.error('Error initializing payment sheet:', error);
        Alert.alert(
          'Error',
          'Unable to initialize payment. Please try again later.',
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in initializePaymentSheet:', error);
      Alert.alert(
        'Error',
        'Unable to initialize payment. Please try again later.',
      );
      return false;
    }
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      if (!paymentInitialized) {
        const initialized = await initializePaymentSheet();
        if (!initialized) {
          setLoading(false);
          return;
        }
        setPaymentInitialized(true);
      }

      const {error} = await presentPaymentSheet();

      if (error) {
        Alert.alert(`Error code: ${error.code}`, error.message);
      } else {
        Alert.alert('Success', 'Your order is confirmed!');
        setPaymentInitialized(false);
      }
    } catch (error) {
      console.error('Error handling payment:', error);
      Alert.alert(
        'Error',
        'Unable to process payment. Please try again later.',
      );
    } finally {
      setLoading(false);
    }
  };
  // const handlePayment = async () => {
  //   try {
  //     setLoading(true);
  //     const checkoutResult = await handleCheckout();
  //     if (!checkoutResult) {
  //       setLoading(false);
  //       return;
  //     }

  //     if (!paymentInitialized) {
  //       const initialized = await initializePaymentSheet();
  //       if (!initialized) {
  //         setLoading(false);
  //         return;
  //       }
  //       setPaymentInitialized(true);
  //     }

  //     const {error} = await presentPaymentSheet();

  //     if (error) {
  //       Alert.alert(`Error code: ${error.code}`, error.message);
  //     } else {
  //       Alert.alert('Success', 'Your order is confirmed!');
  //       setPaymentInitialized(false); // Reset for next payment
  //     }
  //   } catch (error) {
  //     console.error('Error handling payment:', error);
  //     Alert.alert(
  //       'Error',
  //       'Unable to process payment. Please try again later.',
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonWrapping}>
        {loading ? (
          <ActivityIndicator size="large" color="rgb(59 130 246)" />
        ) : (
          <TouchableOpacity
            style={styles.buttonOuterStyling}
            onPress={handlePayment}>
            <Text style={styles.buttonInnerStyling}>Proceed for Payment</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonWrapping: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    marginTop: '5%',
    marginBottom: '5%',
  },
  buttonOuterStyling: {
    backgroundColor: 'rgb(59 130 246)',
    padding: '4%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    width: '85%',
  },
  buttonInnerStyling: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default CheckoutScreen;
