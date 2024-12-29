import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';

const PaymentScreen = ({paymentData, paymentAmount}) => {
  const [loading, setLoading] = useState(false);

  const createOrder = async () => {
    try {
      const amount = Math.abs(Number(paymentAmount));

      if (!amount || isNaN(amount)) {
        throw new Error('Invalid payment amount');
      }
      const response = await fetch(
        'http://192.168.68.116:3500/v1/api/create-order',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: amount,
            currency: 'INR',
          }),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const verifyPayment = async () => {
    try {
      const response = await fetch(
        'http://192.168.68.116:3500/v1/api/verify-payment',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(paymentData),
        },
      );

      if (!response.ok) {
        throw new Error('Payment verification failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      const amount = Math.round(Number(paymentAmount));

      if (!amount || isNaN(amount)) {
        throw new Error('Invalid payment amount');
      }
      const order = await createOrder();

      const options = {
        description: 'Sample Payment',
        image:
          'https://m.media-amazon.com/images/I/61L5QgPvgqL._AC_UF1000,1000_QL80_.jpg',
        currency: 'INR',
        key: 'liMZIFyTDZTFVZMgdgoFK0No',
        amount: amount,
        name: 'Your Company Name',
        order_id: order.orderId,
        prefill: {
          email: 'karan@example.com',
          contact: '9999999999',
          name: 'Karan Bhanushali',
        },
        theme: {color: '#534BE2'},
      };
      console.log(options);
      const data = await RazorpayCheckout.open(options);
      const verificationResult = await verifyPayment({
        razorpay_order_id: data.razorpay_order_id,
        razorpay_payment_id: data.razorpay_payment_id,
        razorpay_signature: data.razorpay_signature,
      });
      console.log(verificationResult);
      if (verificationResult.verified) {
        Alert.alert('Success', 'Payment successful!');
      } else {
        Alert.alert('Error', 'Payment verification failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Error', error.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#534BE2" />
      ) : (
        <TouchableOpacity style={styles.paymentButton} onPress={handlePayment}>
          <Text style={styles.buttonText}>Pay Now</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  paymentButton: {
    backgroundColor: '#534BE2',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    width: '80%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PaymentScreen;
