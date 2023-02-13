import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Home from './src/screens/home/Home';
import RegisterScreen from './src/screens/auth/Register';
import LoginScreen from './src/screens/auth/Login';
import Loading from './src/screens/home/Loading';
import Users from './src/screens/users/Users';
import PrivateChat from './src/screens/chat/PrivateChat';
import UploadUserImage from './src/screens/images/UploadUserImage';
import Profile from './src/screens/auth/Profile';
import Rooms from './src/screens/rooms/Rooms';
import RoomChat from './src/screens/rooms/RoomChat';

const Stack = createStackNavigator();

import { LogBox } from 'react-native';
import Settings from './src/screens/settings/Settings';
LogBox.ignoreLogs(['Warning: Async Storage has been extracted from react-native core']);

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Loading" component={Loading} options={{
          headerShown: false,
        }}/>
        <Stack.Screen name="Login" component={LoginScreen} options={{
          title: "Login",
          headerTitleAlign: "center"
        }}/>
        <Stack.Screen name="SignUp" component={RegisterScreen} options={{
          title: "Register",
          headerTitleAlign: "center"
        }}/>
        <Stack.Screen name="Home" component={Home} options={{
          title: "Home",
          headerShown: false,
        }}/>
        <Stack.Screen name="Profile" component={Profile} options={{
          title: "Profile",
          headerTitleAlign: "center"
        }}/>
        <Stack.Screen name="Settings" component={Settings} options={{
          title: "Settings",
          headerTitleAlign: "center"
        }}/>
        <Stack.Screen name="Users" component={Users} options={{
          title: "Users",
          headerTitleAlign: "center"
        }}/>
        <Stack.Screen name="PrivateChat" component={PrivateChat} options={{
          title: "Private Messages",
          headerTitleAlign: "center",
          headerShown: false,
        }}/>
        <Stack.Screen name="Rooms" component={Rooms} options={{
          title: "Rooms",
          headerTitleAlign: "center",
        }}/>
        <Stack.Screen name="RoomChat" component={RoomChat} options={{
          title: "Rooms",
          headerTitleAlign: "center",
          headerShown: false,
        }}/>
        <Stack.Screen name="UploadUserImage" component={UploadUserImage} options={{
          headerShown: false
        }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
