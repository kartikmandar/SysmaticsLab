import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import RNFetchBlob from 'rn-fetch-blob';

const LocationData = () => {
  const [locationData, setLocationData] = useState(null);
  const [isCollecting, setIsCollecting] = useState(false);

  useEffect(() => {
    if (isCollecting) {
      startLocationCollection(); // Start collecting data when isCollecting becomes true
    } else {
      stopLocationCollection(); // Stop collecting data when isCollecting becomes false
    }

    return () => {
      stopLocationCollection(); // Clean up the interval when the component unmounts
    };
  }, [isCollecting]); // Run this effect when isCollecting changes

  let locationInterval;

  const startLocationCollection = () => {
    locationInterval = setInterval(fetchLocationData, 5000); // Collect data every 5 seconds
  };

  const stopLocationCollection = () => {
    clearInterval(locationInterval);
  };

  const fetchLocationData = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const timestamp = new Date(position.timestamp).toLocaleString();
        const newData = { latitude, longitude, timestamp };
        setLocationData(newData);

        // Append location data to the file
        appendLocationDataToFile(newData);
      },
      (error) => {
        console.error('Error getting location:', error);
      },
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 1000 }
    );
  };

  const toggleLocationCollection = () => {
    setIsCollecting((prevIsCollecting) => !prevIsCollecting);
  };

  const appendLocationDataToFile = (data) => {
    let filePath;
    let directoryPath;

    if (Platform.OS === 'android') {
      directoryPath = `${RNFetchBlob.fs.dirs.SDCardApplicationDir}/SixthSense`;
      filePath = `${directoryPath}/LocationData.json`;
    } else if (Platform.OS === 'ios') {
      directoryPath = `${RNFetchBlob.fs.dirs.DocumentDir}/SixthSense`;
      filePath = `${directoryPath}/LocationData.json`;
    }

    // Check if the directory exists, and create it if it doesn't
    RNFetchBlob.fs
      .isDir(directoryPath)
      .then((isDirectory) => {
        if (!isDirectory) {
          return RNFetchBlob.fs.mkdir(directoryPath);
        }
        return Promise.resolve();
      })
      .then(() => {
        // Append the location data to the file
        RNFetchBlob.fs
          .appendFile(filePath, JSON.stringify(data, null, 4) + '\n', 'utf8')
          .then(() => {
            console.log('Location data appended to LocationData.json');
          })
          .catch((error) => {
            console.error('Error appending location data to file:', error);
          });
      })
      .catch((error) => {
        console.error('Error checking/creating directory:', error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Location Data:</Text>
      {locationData && (
        <View>
          <Text>Latitude: {locationData.latitude}</Text>
          <Text>Longitude: {locationData.longitude}</Text>
          <Text>Timestamp: {locationData.timestamp}</Text>
        </View>
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={toggleLocationCollection}>
        <Text style={styles.buttonText}>
          {isCollecting ? 'Stop Collection' : 'Start Collection'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    marginTop: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LocationData;
