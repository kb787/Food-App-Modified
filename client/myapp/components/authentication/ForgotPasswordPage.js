import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import axios from 'axios';

const ForgotPasswordPage = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const navigation = useNavigation();

  const handleForgotPassword = async () => {
    try {
      if (newPassword !== confirmPassword) {
        setMessage('Passwords do not match.');
        setSuccess(false);
        return;
      }
      const response = await axios.post(
        'http://192.168.79.116:3500/v1/api/verification/change-password',
        {
          verificationCode: verificationCode,
          userPassword: newPassword,
        },
      );
      if (response.data.success) {
        setMessage(response.data.message);
        setSuccess(true);
        navigation.navigate('MainProductScreen');
      } else {
        setMessage(response.data.message);
        setSuccess(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Unable to process your request due to an error');
      setSuccess(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Verification Code"
        value={verificationCode}
        onChangeText={setVerificationCode}
      />
      <TextInput
        style={styles.input}
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry={true}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={true}
      />

      <TouchableOpacity
        style={[styles.button, {backgroundColor: 'rgb(194, 65, 12)'}]}
        onPress={handleForgotPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
      {message ? (
        <Text style={[styles.message, {color: success ? 'green' : 'red'}]}>
          {message}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    width: '100%',
    height: 40,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  message: {
    marginTop: 20,
  },
});

export default ForgotPasswordPage;
