import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Image,
} from 'react-native';
import React from 'react';
import {useState} from 'react';
import {Link, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import loginImage from '../../images/loginImage.png';
import ForgotPasswordPage from './ForgotPasswordPage';
import FacebookLogin from './FacebookLogin';

const SignIn = () => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const navigation = useNavigation();
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleEmailSending = async () => {
    if (!userEmail) {
      Alert.alert('Entering User Email is Mandatory');
      return;
    }
    try {
      const response = await axios.post(
        'http://192.168.68.116:3500/v1/api/verification/send-email',
        {
          userEmail: userEmail,
        },
      );
      setSuccess(true);
      navigation.navigate('ForgotPasswordPage');
    } catch (error) {
      console.error('Error:', error.response);
      setMessage('Unable to process your request due to an error');
      setSuccess(false);
    }
  };
  const handleUserSignIn = async () => {
    if (!userEmail || !userPassword) {
      Alert.alert('Entering all fields is mandatory');
    }
    try {
      const postResponse = await axios.post(
        'http://192.168.68.116:3500/v1/api/auth/signin-user ',
        {
          userEmail: userEmail,
          userPassword: userPassword,
        },
      );
      if (postResponse.data.success) {
        Alert.alert('Sign-In Successfull');
        navigation.navigate('MainProductScreen');
      } else {
        Alert.alert('Invalid credentials for the user');
      }
    } catch (error) {
      Alert.alert(` Unable to login due to error ${error}`);
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerText}>Signin</Text>
        <Image source={loginImage} style={styles.image} resizeMode="contain" />

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              keyboardType="email-address"
              style={styles.textInputStyling}
              value={userEmail}
              onChangeText={text => setUserEmail(text)}
              placeholder="Enter your email address"
              placeholderTextColor="#666"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.textInputStyling}
              value={userPassword}
              onChangeText={text => setUserPassword(text)}
              placeholder="Enter your password"
              secureTextEntry={true}
              placeholderTextColor="#666"
            />
          </View>

          <TouchableOpacity
            style={styles.textButtonOuterStyling}
            onPress={handleUserSignIn}>
            <Text style={styles.textButtonInnerStyling}>Sign Up</Text>
          </TouchableOpacity>
          <FacebookLogin />
          <Link to={{screen: 'SignUp'}} style={styles.bottomTextStyling}>
            Not having an account? Sign Up Here!
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default SignIn;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  headerText: {
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: '5%',
    marginTop: '5%',
  },
  image: {
    width: '100%',
    height: 250,
    marginVertical: 12,
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: '5%',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    color: '#333',
  },
  textInputStyling: {
    width: '100%',
    height: 45,
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 6,
    paddingHorizontal: 15,
    textAlign: 'left',
  },
  textButtonOuterStyling: {
    backgroundColor: 'rgb(194 65 12)',
    width: '100%',
    height: 45,
    marginTop: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButtonInnerStyling: {
    fontSize: 18,
    color: 'white',
  },
  bottomTextStyling: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
});
