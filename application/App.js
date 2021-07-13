import React, {useEffect, useState} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  PermissionsAndroid
} from 'react-native';

import Auth0 from 'react-native-auth0';
import Geolocation from '@react-native-community/geolocation';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Weather from './screens/weather';
import Token from './screens/token';

const auth0 = new Auth0({ 
  domain: 'aysad.us.auth0.com', 
  clientId: 'owNIC1R1npKkG9slpm9M0LTr0lOzH4Hq' 
});

const BottomTabs = createBottomTabNavigator();

const LogoutButton = (props) => {
  return <View onPress={props.logout()}
    accessibilityLabel="Logout"
  /> 
}

const App = () => {
  const [ accessToken, setAccessToken ] = useState(null);
  const [ location, setLocation ] = useState({latitude: '', longitude: ''});

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const getGeoLocation = async () => {
    const config = {
      enableHighAccuracy: true,
      timeout: 20000,
    };
  
    try {
      Geolocation.getCurrentPosition(
        info => {
          console.log("INFO", info);
          const latitude = info.coords.latitude;
          const longitude = info.coords.longitude; 
          setLocation({latitude, longitude});
        },
        error => console.log("ERROR", error),
        config,
      );
    } catch (err) {
      console.log(err);
    }
  }

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Request Permission",
          message: "This app requires your location information",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getGeoLocation()
        console.log("Location permission granted")
      } else {
        console.log("Location permission denied")
      }

    } catch (err) {
       console.warn(err)
    }
  }

  const loginAuth0 = () => {
    console.log("in auth0 signin");
    auth0
    .webAuth
    .authorize({scope: 'openid profile email'})
    .then(credentials =>
      setAccessToken(credentials.accessToken)
    )
    .catch(err => console.log(err));
  };
  
  const logoutAuth0 = () => { 
    console.log("in auth0 logout");
    auth0.webAuth
    .clearSession({})
    .then(success => {
      console.log('Logged out!');
      setAccessToken(null);
    })
    .catch(err => {
        console.log('Log out cancelled', err);
    });
  }
  
  const LoginButton = () => {
    return <Button 
            title="Login" 
            onPress={loginAuth0}
            accessibilityLabel="Login" 
          />
  }  

  return (
    <>
     { accessToken ?
      <NavigationContainer>
        <BottomTabs.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              switch (route.name) {
                case 'Weather':
                  iconName = 'weather-cloudy';
                  break;
                case 'Token':
                  iconName = 'key';
                  break;
                default:
                  iconName = 'logout';
              } 
              // You can return any component that you like here!
              return <Icon name={iconName} size={size} color={color} />;
            },
          })}
          tabBarOptions={{
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
          }}
        >
          <BottomTabs.Screen 
            name="Weather" 
            children={()=><Weather geoData={location}/>}
          />
          <BottomTabs.Screen 
            name="Token" 
            children={()=><Token token={accessToken}/>}
          />
          <BottomTabs.Screen 
            name="Logout"
            children={() => <LogoutButton logout={logoutAuth0} />}
          />
        </BottomTabs.Navigator>
      </NavigationContainer>
      :
      <LoginButton />
     }
    </>
  );
};

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
