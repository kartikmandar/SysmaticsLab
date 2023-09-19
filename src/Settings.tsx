import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
//comment to check commit
const SettingsScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <Text style={styles.heading}>About the App</Text>
        <Text style={styles.description}>
          The SixthSense mobile app is developed by the Systems and Informatics Research Laboratory (SIRL) under the guidance of Dr. Haroon Rashid Loone.
        </Text>
        <Text style={styles.description}>
          This app is designed to collect sensor data from your mobile device, including accelerometer, gyroscope, magnetometer, barometer, and location data.
        </Text>
        <Text style={styles.description}>
          The collected data is used for research and analysis in the field of informatics and system research, contributing to various projects and studies.
        </Text>
        <Text style={styles.description}>
          Your privacy and data security are important to us. The app ensures that your data is collected and stored securely, and it is not shared with any third parties.
        </Text>
        <Text style={styles.description}>
          For more information or inquiries, please visit the official SIRL website: {' '}
          <Text style={styles.link}>https://sites.google.com/iiserb.ac.in/sirl</Text>
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default SettingsScreen;
