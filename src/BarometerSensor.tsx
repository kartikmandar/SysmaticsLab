import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';
import {
  barometer,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';
import RNFetchBlob from 'rn-fetch-blob';

const BarometerSensor = () => {
  const [isCollecting, setIsCollecting] = useState(false);
  const [barometerData, setBarometerData] = useState([]);
  const [sensorAvailable, setSensorAvailable] = useState(true);

  useEffect(() => {
    let barometerSubscription;

    const startDataCollection = async () => {
      setUpdateIntervalForType(SensorTypes.barometer, 100);

      barometerSubscription = barometer.subscribe(
        async ({ pressure }) => {
          const timestamp = new Date().toISOString();
          const newData = { timestamp, pressure };

          setBarometerData((prevData) => [...prevData, newData]);

          try {
            await writeDataToFile(newData);
          } catch (error) {
            console.error('Error writing data to file:', error);
          }
        },
        (error) => {
          console.error('Error subscribing to barometer:', error);
          setSensorAvailable(false);
        }
      );
    };

    const stopDataCollection = () => {
      if (barometerSubscription) {
        barometerSubscription.unsubscribe();
      }
    };

    if (isCollecting) {
      setBarometerData([]); // Clear existing data when starting again
      startDataCollection();
    } else {
      stopDataCollection();
    }

    return () => {
      stopDataCollection();
    };
  }, [isCollecting]);

  const writeDataToFile = async (data) => {
    let filePath;

    if (Platform.OS === 'android') {
      filePath = `${RNFetchBlob.fs.dirs.SDCardApplicationDir}/SixthSense/BarometerData.json`;
    } else if (Platform.OS === 'ios') {
      filePath = `${RNFetchBlob.fs.dirs.DocumentDir}/SixthSense/BarometerData.json`;
    } else {
      console.error('Unsupported platform');
      return;
    }

    try {
      await RNFetchBlob.fs.appendFile(
        filePath,
        JSON.stringify(data, null, 4) + '\n',
        'utf8'
      );
      console.log('Data written to BarometerData.json');
    } catch (error) {
      throw error;
    }
  };

  return (
    <View style={styles.container}>
      {sensorAvailable ? (
        <>
          <Text style={styles.title}>Barometer Data:</Text>
          <ScrollView style={styles.scrollView}>
            <Text style={styles.columnHeader}>Timestamp   Pressure (Pa)</Text>
            {barometerData.map((data, index) => (
              <Text key={index}>
                {`${data.timestamp}   ${data.pressure.toFixed(4)}`}
              </Text>
            ))}
          </ScrollView>
        </>
      ) : (
        <Text style={styles.unavailable}>
          Barometer is not available on this device.
        </Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsCollecting((prev) => !prev)}>
        <Text style={styles.buttonText}>
          {isCollecting ? 'Stop Sensor' : 'Start Sensor'}
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
  title: {
    fontSize: 18,
    marginTop: 20,
  },
  unavailable: {
    fontSize: 14,
    marginTop: 5,
    color: 'red',
  },
  scrollView: {
    maxHeight: 200,
    width: '100%',
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    marginTop: 10,
  },
  columnHeader: {
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default BarometerSensor;
