import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, Dimensions, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { loginRequest } from '../redux_saga/actions/loginActions';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const LoginScreen = ({ props }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const loginStatus = useSelector((state: any) => state.login);
  const loginLoading = useSelector((state: any) => state.login.loading);
  const loginError = useSelector((state: any) => state.login.error);

  useEffect(() => {
    if (loginError) {
      const errorString = String(loginError);
      if (errorString.includes('[auth/user-not-found]')) {
        setMessage('User not found. Please check your email and password.');
      } else if (errorString.includes('[auth/wrong-password]')) {
        setMessage('Incorrect password. Please try again.');
      } else if (errorString.includes('[auth/invalid-email]')) {
        setMessage('invalid email. Please try again.');
      } else if (errorString.includes('[auth/invalid-credential]')) {
        setMessage('The supplied credential is incorrect');
      } else {
        setMessage('something went wrong. Please try again');
      }
    } else {
      setMessage('');
    }
  }, [loginError])

  useEffect(() => {
    if (loginStatus?.isSuccess) {
      setMessage('');
      setEmail('');
      setPassword('');
      navigation.navigate('APP', { screen: 'Products' });
    }
  }, [loginStatus, navigation]);


  const handleLogin = async () => {
    try {
      if (email.length > 0 && password.length > 0) {
        dispatch(loginRequest({ email, password }));
      } else {
        Alert.alert("Please fill all the required fields")
      }
    } catch (err: any) {
      console.log("error occured while login ", err);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>
          Login
        </Text>
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
          <Text style={{ color: 'red', justifyContent: 'center', alignItems: 'center' }}>
            {message}
          </Text>
        )}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleLogin()}
        >
          {loginLoading ? (
            <View style={{ flexDirection: 'row' }}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={{ color: '#fff', marginLeft: 10 }}>Login</Text>
            </View>
          ) : (
            <Text style={{ color: '#fff' }}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signup}
          onPress={() => {
            navigation.navigate('Auth', { screen: 'SignUp' });
          }}
        >
          <Text style={{ color: 'blue', marginTop: 8 }}>
            Don't have an account? Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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

export default LoginScreen;