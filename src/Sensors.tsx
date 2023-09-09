import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import AccelerometerSensor from './AccelerometerSensor';
import GyroscopeSensor from './GyroscopeSensor';
import MagnetometerSensor from './MagnetometerSensor';
import BarometerSensor from './BarometerSensor';
// import DeviceUsageAndroid from './DeviceUsageAndroid';
// import DeviceUsageiOSScreen from './DeviceUsageios';
// import MicrophoneSensor from './MicrophoneSensor';
// import PedometerSensor from './PedometerSensor';
import LocationData from './LocationData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import PedometerSensor from './PedometerSensor';

const Sensors = () => {
  const [isCollecting, setIsCollecting] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isPromptVisible, setIsPromptVisible] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const startDataCollection = () => {
    if (userData) {
      setIsCollecting(true);
    } else {
      setIsPromptVisible(true);
    }
  };

  const stopDataCollection = () => {
    setIsCollecting(false);
  };

  const handleStartCollection = async () => {
    if (
      userData &&
      userData.name &&
      isValidEmail(userData.email) &&
      isValidAge(userData.age)
    ) {
      setIsPromptVisible(false);
      setIsCollecting(true);
      await saveUserData(userData);
      writeUserDataToFile(userData); // Write user data to a file
    } else {
      Alert.alert('Invalid Information', 'Please enter valid information.');
    }
  };

  const isValidEmail = email => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    return emailRegex.test(email);
  };

  const isValidAge = age => {
    return !isNaN(age) && parseInt(age) > 0;
  };

  const loadUserData = async () => {
    try {
      const userDataJSON = await AsyncStorage.getItem('userData');
      if (userDataJSON) {
        setUserData(JSON.parse(userDataJSON));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const saveUserData = async userData => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const writeUserDataToFile = userData => {
    let filePath;

    if (Platform.OS === 'ios') {
      filePath = `${RNFetchBlob.fs.dirs.DocumentDir}/SixthSense/UserData.json`;
    } else if (Platform.OS === 'android') {
      filePath = `${RNFetchBlob.fs.dirs.SDCardApplicationDir}/SixthSense/UserData.json`;
    } else {
      console.error('Unsupported platform');
      return;
    }

    RNFetchBlob.fs
      .writeFile(filePath, JSON.stringify(userData, null, 4), 'utf8')
      .then(() => {
        console.log('User data written to UserData.json');
      })
      .catch(error => {
        console.error('Error writing user data to file:', error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sensor Data Collection:</Text>
      <ScrollView>
        {isCollecting ? (
          <>
            <AccelerometerSensor />
            <GyroscopeSensor />
            <MagnetometerSensor />
            <BarometerSensor />
            <LocationData/>
            {/* <PedometerSensor/> */}
            {/* <MicrophoneSensor /> */}
            {/* Display Device Usage Info
      {Platform.OS === 'android' && (
        <DeviceUsageAndroid />
      )}
      {Platform.OS === 'ios' && (
        <DeviceUsageiOSScreen />
      )} */}
          </>
        ) : (
          <Text style={styles.message}>Press "Start Collection" to begin.</Text>
        )}
      </ScrollView>

      <TouchableOpacity
        style={[styles.button, {width: 200, height: 30}]}
        onPress={isCollecting ? stopDataCollection : startDataCollection}>
        <Text style={styles.buttonText}>
          {isCollecting ? 'Stop Collection' : 'Start Collection'}
        </Text>
      </TouchableOpacity>

      <Modal visible={isPromptVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>User Information</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              onChangeText={text => setUserData({...userData, name: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              onChangeText={text => setUserData({...userData, email: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Age"
              onChangeText={text => setUserData({...userData, age: text})}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleStartCollection}>
              <Text style={styles.buttonText}>Start Collection</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    marginTop: 10,
  },
  button: {
    backgroundColor: 'blue',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    borderRadius: 5,
  },
});

export default Sensors;
