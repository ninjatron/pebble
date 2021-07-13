// openWeather here
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

const clientId = '5a52ec73f9d4de59720295838d965cca';

const Weather = (props) => {
  const [weather, setWeather] = useState(null);
  const [geoData, setGeoData] = useState(props.geoData);

  useEffect(() => {
    loadForecast();
  }, [geoData]);

  const isGeoDataValid = (geo) => {
    return geo.latitude !== '' && geo.longitude !== '';
  } 

  const loadForecast = async () => {
    if (!weather && isGeoDataValid(geoData)) {
      try {
        console.log(geoData);
        let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${geoData.latitude}&lon=${geoData.longitude}&units=imperial&appid=${clientId}`);
        let weatherData = await res.json();
        setWeather(weatherData.main.feels_like);
        console.log("weather:", weatherData.main.feels_like);
      } catch (err) {
        console.log("here:", err);
      }
    }
  }

  return (
    <View style={styles.weatherContainer}>
      <Text style={styles.weatherIntro}>Weather feels like:</Text>
      <Text style={styles.weatherText}>&#8457; {weather}</Text>
    </View>
  )
};

const styles = StyleSheet.create({
  weatherContainer: {
    fontSize: 30,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'    
  },
  weatherIntro: {
    marginTop: 60,
  },
  weatherText: {
    fontSize: 30,
  }
});

export default Weather;