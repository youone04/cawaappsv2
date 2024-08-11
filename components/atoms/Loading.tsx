import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

const Loading = ({ message = "Loading..." }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  message: {
    marginTop: 10,
    fontSize: 16,
    color: '#000',
  },
});

export default Loading;
