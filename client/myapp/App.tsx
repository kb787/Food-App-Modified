import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Homepage from './components/homescreen/Homepage';
import SignUp from './components/authentication/SignUp';
import SignIn from './components/authentication/SignIn';
import MainProductScreen from './components/products-display/MainProductScreen';
import CartDisplay from './components/booked-items/CartDisplay';
import {CartProvider} from './components/booked-items/CartCreation';
import TrackLocation from './components/item-location-tracking/TrackLocation';
import env from './env';
import ForgotPasswordPage from './components/authentication/ForgotPasswordPage';
import HomepageModified from './components/homescreen/HomepageModified';
const Stack = createStackNavigator();

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="HomepageModified">
          {/* <Stack.Screen name="Homepage" component={Homepage} /> */}
          <Stack.Screen name="HomepageModified" component={HomepageModified} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen
            name="MainProductScreen"
            component={MainProductScreen}
          />
          <Stack.Screen name="CartDisplay" component={CartDisplay} />
          <Stack.Screen
            name="ForgotPasswordPage"
            component={ForgotPasswordPage}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
