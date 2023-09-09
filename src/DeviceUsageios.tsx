import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenTime from 'react-native-screen-time';

const DeviceUsageiOSScreen = () => {
  const [screenTimeData, setScreenTimeData] = useState(null);

  useEffect(() => {
    // Fetch screen time data (for iOS)
    const fetchScreenTimeData = async () => {
      try {
        const data = await ScreenTime.getScreenTimeData();
        setScreenTimeData(data);
      } catch (error) {
        console.error('Error fetching screen time data:', error);
      }
    };

    fetchScreenTimeData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Device Usage Data (iOS)</Text>
      {screenTimeData && (
        <Text style={styles.usageText}>
          Total screen time: {screenTimeData.totalScreenTime} minutes
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  usageText: {
    fontSize: 16,
  },
});

export default DeviceUsageiOSScreen;
