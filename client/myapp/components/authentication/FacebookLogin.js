import React, {useState} from 'react';
import {View, Button, Text, Alert, TouchableOpacity} from 'react-native';
import * as Facebook from 'expo-facebook';
import {Link, useNavigation} from '@react-navigation/native';

const FacebookLogin = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);

  const loginWithFacebook = async () => {
    try {
      await Facebook.initializeAsync({
        appId: 469937909170990,
        appName: 'food-app',
      });
      console.log(Facebook);

      const {type, token} = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile', 'email'],
      });

      if (type === 'success') {
        const response = await fetch(
          `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${token}`,
        );
        const data = await response.json();
        console.log('Facebook user data: ', data);
        setUserData(data);
        const backendResponse = await fetch(
          'http://192.168.68.116:3500/v1/api/facebook-auth',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              accessToken: token,
            }),
          },
        );
        if (backendResponse.data.success) {
          Alert.alert('Facebook login success');
          navigation.navigate('MainProductScreen');
        }
      } else {
        console.log('Facebook login cancelled');
      }
    } catch (error) {
      console.error('Facebook login error: ', error);
    }
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View
        style={{
          marginTop: '2%',
          marginBottom: '2%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '99%',
        }}>
        <TouchableOpacity
          onPress={loginWithFacebook}
          style={{
            backgroundColor: 'rgb(rgb(14 165 233)',
            width: '100%',
            height: 45,
            marginTop: '3%',
            marginBottom: '3%',
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: 'white', fontSize: 18}}>
            Login with Facebook
          </Text>
        </TouchableOpacity>
      </View>
      {userData && (
        <View style={{marginTop: 20}}>
          <Text>Name: {userData.name}</Text>
          <Text>Email: {userData.email}</Text>
          <Text>Facebook ID: {userData.id}</Text>
        </View>
      )}
    </View>
  );
};

export default FacebookLogin;
