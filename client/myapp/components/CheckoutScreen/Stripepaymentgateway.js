import React from 'react';
import {StripeProvider} from '@stripe/stripe-react-native';
import CheckoutScreen from './CheckoutScreen';
const Stripepaymentgateway = ({cartItems, totalAmount}) => {
  return (
    <StripeProvider
      publishableKey="pk_test_51QZ30uE28avs7nj0dEMH6qsR4luFezPx5LKZbZiF1P2XhL2xb3jkv3Rrg97W0HNsWU4iSbEeLIJG1tVLZFq4PMhK00VzBbAbdf"
      urlScheme="your-url-scheme"
      merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}">
      <CheckoutScreen cartData={cartItems} totalPrice={totalAmount} />
    </StripeProvider>
  );
};

export default Stripepaymentgateway;
