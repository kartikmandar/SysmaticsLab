import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Platform } from 'react-native';
import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';

const DataScreen = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [error, setError] = useState('');
  const [isSendingData, setIsSendingData] = useState(false);

  useEffect(() => {
    // Check if the roll number is saved in local storage (you can use AsyncStorage for this)
    // If it's saved, set it as the initial value
    // If not, do nothing and let the user enter it manually
  }, []);

  const saveRollNumberToStorage = async () => {
    // Save the roll number to local storage for future use
    // You can use AsyncStorage to achieve this
    // Example: await AsyncStorage.setItem('rollNumber', rollNumber);
  };

  const sendFolderToServer = async () => {
    if (rollNumber.trim() === '') {
      setError('Roll number is required');
      return;
    }

    try {
      let folderPath;

      // Determine the folder path based on the platform (Android or iOS)
      if (Platform.OS === 'android') {
        folderPath = `${RNFetchBlob.fs.dirs.SDCardApplicationDir}/SixthSense`;
      } else if (Platform.OS === 'ios') {
        folderPath = `${RNFetchBlob.fs.dirs.DocumentDir}/SixthSense`;
      } else {
        console.error('Unsupported platform');
        return;
      }

      // Create a FormData object to send the folder as a zip file
      const formData = new FormData();
      formData.append('rollNumber', rollNumber); // Append roll number to formData
      formData.append('dataFolder', {
        uri: `file://${folderPath}`,
        name: 'SixthSense.zip', // Zip file name on the server
        type: 'application/zip', // Content type
      });

      // Send the FormData to the server
      const response = await axios.post('http://172.28.129.22:3000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Folder sent to server:', response.data);
      setError(''); // Clear any previous error
      saveRollNumberToStorage(); // Save the roll number for future use
    } catch (error) {
      console.error('Error sending folder to server:', error);
      // Add your error handling logic here
      // For example, you can set an error message to display to the user
      setError('Error sending data to the server. Please try again.');
    }
  };

  const toggleSendingData = () => {
    setIsSendingData(!isSendingData);
  };

  useEffect(() => {
    let intervalId;

    if (isSendingData) {
      intervalId = setInterval(sendFolderToServer, 1 * 5 * 1000); // Send data every 30 minutes
    } else {
      clearInterval(intervalId);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isSendingData]);

  return (
    <View style={styles.container}>
      <Text>Data Screen</Text>
      {/* Input field to collect roll number */}
      <TextInput
        style={styles.input}
        placeholder="Enter Roll Number"
        value={rollNumber}
        onChangeText={(text) => setRollNumber(text)}
        editable={!isSendingData} // Disable editing if data sending is active
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity onPress={toggleSendingData} style={styles.button}>
        <Text style={styles.buttonText}>
          {isSendingData ? 'Stop Sending Data' : 'Start Sending Data'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    width: '80%',
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default DataScreen;
