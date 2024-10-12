import {
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import {useDispatch} from 'react-redux';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  fetchUserProfile,
} from '../store/authSlice';
import axios from 'axios';
import {sha256} from 'js-sha256';
import {jwtDecode} from 'jwt-decode';

const LoginScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [BACKEND_URL, setBACKEND_URL] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkInternetConnectivity = async () => {
      try {
        const state = await NetInfo.fetch();
        if (!state.isConnected) {
          Alert.alert(
            'No Internet Connection',
            'Please check your internet connection and try again',
            [{text: 'Ok'}],
          );
        } else {
          fetchIP();
        }
      } catch (error) {
        Alert.alert(
          'Error',
          `An error occurred while checking internet connectivity: ${error.message}`,
          [{text: 'Ok'}],
        );
      }
    };
    checkInternetConnectivity();
  }, []);

  const fetchIP = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://json.extendsclass.com/bin/766b9c024d94?timestamp=${new Date().getTime()}`,
      );
      if (response.ok) {
        const data = await response.json();
        const url = data.backend_url.toString();
        console.log('URL: ', url);
        setBACKEND_URL(url);
      }
    } catch (error) {
      Alert.alert(
        'Error',
        `Unable to connect to backend server: ${error.message}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (email === '' || password === '') {
      Alert.alert('Error', 'Please fill all fields', [{text: 'Ok'}]);
      return;
    } else {
      try {
        console.log('URL fetched:', BACKEND_URL);
        dispatch(loginStart());
      } catch (error) {
        Alert.alert(
          'Error',
          `Error in dispatching login start: ${error.message}`,
          [{text: 'Ok'}],
        );
      }

      const hashedPassword = sha256(password);
      Alert.alert(
        'Attributes',
        `http://${BACKEND_URL}/auth/login` + ' ' + email + ' ' + hashedPassword,
      );
      try {
        const response = await axios.post(`http://${BACKEND_URL}/auth/login`, {
          username: email,
          password: hashedPassword,
        });

        if (response.status === 200) {
          const {token} = response.data;
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp && decodedToken.exp > currentTime) {
            if (decodedToken.role === 'user') {
              dispatch(loginSuccess({token, backendURL: BACKEND_URL}));
              dispatch(fetchUserProfile());
              Alert.alert('Success', 'Login successful', [{text: 'Ok'}]);
              navigation.replace('Main');
            } else {
              handleInvalidRole();
            }
          } else {
            Alert.alert('Error', 'Token expired, please log in again', [
              {text: 'Ok'},
            ]);
          }
        } else {
          Alert.alert('Error', 'Login failed', [{text: 'Ok'}]);
        }
      } catch (err) {
        console.error(err);
        dispatch(loginFailure(err.response?.data?.error || 'Login failed'));
        Alert.alert('Error', `Login failed: ${err.message}`, [{text: 'Ok'}]);
      }
    }
  };

  const handleInvalidRole = () => {
    Alert.alert('Error', 'Invalid role assigned. Please contact support.', [
      {text: 'Ok'}],
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-2">
      <KeyboardAvoidingView>
        <View className="items-center justify-center mt-24">
          <Text className="text-[#003580] text-xl font-bold">Sign In</Text>
          <Text className="text-black mt-3 text-lg font-medium">
            Sign In to your Account
          </Text>
        </View>
        <View className="mt-12 mx-5">
          <View className="">
            <Text className="text-[#003580] text-lg font-semibold">Email</Text>
            <TextInput
              className="w-full py-0 px-1 text-black border-gray-400 border-b text-base font-semibold"
              value={email}
              onChangeText={text => setEmail(text)}
            />
          </View>
          <View className="mt-5">
            <Text className="text-[#003580] text-lg font-semibold">
              Password
            </Text>
            <TextInput
              className="w-full py-0 px-1 text-black border-gray-400 border-b text-base font-semibold"
              value={password}
              secureTextEntry={true}
              onChangeText={text => setPassword(text)}
            />
          </View>
        </View>
        <TouchableOpacity
          className="mt-5 mx-5 bg-[#003580] py-3 items-center justify-center rounded-lg"
          onPress={() => handleLogin()}
          disabled={loading} // Disable login while fetching IP
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-white text-lg font-semibold">Login In</Text>
          )}
        </TouchableOpacity>
        {BACKEND_URL === '' && !loading ? (
          <Text className="text-red-500 text-center mt-5">
            Unable to connect to backend server
          </Text>
        ) : BACKEND_URL === '' && loading ? (
          <Text className="text-yellow-400 text-center mt-5">
            Fetching backend URL, please wait...
          </Text>
        ) : (
          <Text className="text-green-500 text-center mt-5">
            Connected to {BACKEND_URL}
          </Text>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
