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
import imageLocation from '../../images/imageLocation.png';
import axios from 'axios';

const SignUp = () => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const navigation = useNavigation();

  const handleUserSignUp = async () => {
    if (!userName || !userEmail || !userPassword) {
      Alert.alert('Entering all fields is mandatory');
    }
    try {
      const registerResponse = await axios.post(
        'http://192.168.68.116:3500/v1/api/auth/signup-user',
        {
          userName: userName,
          userEmail: userEmail,
          userPassword: userPassword,
        },
      );
      if (registerResponse.data.success) {
        Alert.alert('Sign-Up successfull');
        navigation.navigate('SignIn');
      } else {
        Alert.alert('User Already Exists');
      }
    } catch (error) {
      Alert.alert(` Unable to login due to error ${error}`);
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerText}>Signup</Text>
        <Image
          source={imageLocation}
          style={styles.image}
          resizeMode="contain"
        />

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.textInputStyling}
              value={userName}
              onChangeText={text => setUserName(text)}
              placeholder="Enter your user name"
              placeholderTextColor="#666"
            />
          </View>

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
            onPress={handleUserSignUp}>
            <Text style={styles.textButtonInnerStyling}>Sign Up</Text>
          </TouchableOpacity>

          <Link to={{screen: 'SignIn'}} style={styles.bottomTextStyling}>
            Already having an account? Sign In Here!
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;

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
