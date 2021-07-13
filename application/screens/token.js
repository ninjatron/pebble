import React from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

const Token = (props) => {
    console.log(props);
  return (
    <View style={styles.tokenContainer}>
      <Text style={styles.tokenIntro}>Token is:</Text>
      <Text style={styles.tokenText}>{props.token}</Text>
    </View>
  )
}
  
const styles = StyleSheet.create({
    tokenContainer: {
        fontSize: 30,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'    
    },
    tokenIntro: {
        marginTop: 60,
    },
    tokenText: {
        fontSize: 30,
    }
});

export default Token;