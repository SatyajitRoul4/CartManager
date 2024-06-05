import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, Dimensions, StyleSheet, TouchableOpacity, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { signUpRequest } from '../redux_saga/actions/signupActions';
import { useNavigation } from '@react-navigation/native';

const SignUpScreen = (props: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  const dispatch = useDispatch();

  const navigation = useNavigation();

  const signUpStatus = useSelector((state: any) => state.signup);
  const signUpLoading = useSelector((state: any) => state.signup.loading);
  const signUpError = useSelector((state: any) => state.signup.error);

  useEffect(() => {
    if (signUpError) {
      const errorString = String(signUpError);
      if (errorString.includes('[auth/email-already-in-use]')) {
        setMessage('The email address is already in use by another account.');
      } else if (errorString.includes('[auth/weak-password]')) {
        setMessage('Password should be at least 6 characters');
      } else if (errorString.includes('[auth/invalid-email]')) {
        setMessage('invalid email. Please try again.');
      } else {
        setMessage('something went wrong. Please try again');
      }
    } else {
      setMessage('');
    }
  }, [signUpError])

  const handleSignUp = async () => {
    try {
      if (email.length > 0 && password.length > 0 && username.length > 0) {
        dispatch(signUpRequest({ email, password, username }));
        if (signUpStatus?.isSuccess) {
          setMessage('');
          navigation.navigate('Auth', { screen: 'Login' });
        }
      } else {
        Alert.alert("Please fill all the required fields")
      }
    } catch (err: any) {
      console.log("error occured while signup ", err);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>
          Signup
        </Text>
        <TextInput
          style={styles.inputBox}
          placeholder="Enter Your Name"
          value={username}
          onChangeText={value => setUsername(value)}
        />
        <TextInput
          style={styles.inputBox}
          placeholder="Enter Your Email"
          value={email}
          onChangeText={value => setEmail(value)}
        />
        <TextInput
          style={styles.inputBox}
          placeholder="Enter Your Password"
          value={password}
          onChangeText={value => setPassword(value)}
          secureTextEntry={true}
        />

        {message && (
          <Text style={{ color: 'red', justifyContent: 'center', alignItems: 'center' }}>{message}</Text>
        )}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleSignUp()}>
          {signUpLoading ? (
            <View style={{ flexDirection: 'row' }}>
              <ActivityIndicator size="small" color="#fff" /><Text style={{ color: '#fff', marginLeft: 10 }}>Signup</Text>
            </View>
          ) : (
            <Text style={{ color: '#fff' }}>Signup</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signup}
          onPress={() => {
            navigation.navigate('Login');
          }}>
          <Text style={{ color: 'blue', marginTop: 8 }}>Already Have An Account ?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const { height, width } = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputBox: {
    width: width - 30,
    borderRadius: 15,
    borderWidth: 2,
    marginVertical: 10,
    padding: 10,
  },
  addButton: {
    backgroundColor: 'blue',
    alignItems: 'center',
    padding: 10,
    borderRadius: 50,
  },
  signup: {
    alignItems: 'center',
  },
});

export default SignUpScreen;