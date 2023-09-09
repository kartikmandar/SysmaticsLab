import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { startCounter, stopCounter } from 'react-native-accurate-step-counter';
import RNFetchBlob from 'rn-fetch-blob';

const PedometerSensor = () => {
  const [isCollecting, setIsCollecting] = useState(false);
  const [pedometerData, setPedometerData] = useState([]);
  const [sensorAvailable, setSensorAvailable] = useState(true);

  useEffect(() => {
    let pedometerSubscription;

    const startDataCollection = () => {
      pedometerSubscription = startCounter({
        default_threshold: 15.0,
        default_delay: 150000000,
        cheatInterval: 3000,
        onStepCountChange: (stepCount) => {
          const timestamp = new Date().toISOString();
          const newData = { timestamp, steps: stepCount };

          setPedometerData((prevData) => [...prevData, newData]);

          writeDataToFile(newData);
        },
        onCheat: () => {
          console.log('User is Cheating');
        },
      });
    };

    const stopDataCollection = () => {
      stopCounter();
      if (pedometerSubscription) {
        pedometerSubscription.remove();
      }
    };

    if (isCollecting) {
      setPedometerData([]); // Clear existing data when starting again
      startDataCollection();
    } else {
      stopDataCollection();
    }

    return () => {
      stopDataCollection();
    };
  }, [isCollecting]);

  const writeDataToFile = (data) => {
    const filePath = `${RNFetchBlob.fs.dirs.SDCardApplicationDir}/SixthSense/PedometerData.json`;

    RNFetchBlob.fs
      .appendFile(filePath, JSON.stringify(data, null, 4) + '\n', 'utf8')
      .then(() => {
        console.log('Data written to PedometerData.json');
      })
      .catch((error) => {
        console.error('Error writing data to file:', error);
      });
  };

  return (
    <View style={styles.container}>
      {sensorAvailable ? (
        <>
          <Text style={styles.title}>Pedometer Data:</Text>
          <ScrollView style={styles.scrollView}>
            <Text style={styles.columnHeader}>Timestamp   Steps</Text>
            {pedometerData.map((data, index) => (
              <Text key={index}>
                {`${data.timestamp}   ${data.steps}`}
              </Text>
            ))}
          </ScrollView>
        </>
      ) : (
        <Text style={styles.unavailable}>
          Pedometer is not available on this device.
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

export default PedometerSensor;
