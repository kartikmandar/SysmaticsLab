import React, {useEffect, useState} from 'react';
import {View, Text, Button, PermissionsAndroid} from 'react-native';
import {UsageStatsManager} from 'react-native';

const DeviceUsageAndroid = () => {
  const [usageData, setUsageData] = useState([]);

  useEffect(() => {
    checkUsageStatsPermission();
  }, []);

  const checkUsageStatsPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.PACKAGE_USAGE_STATS,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Permission granted, proceed with data collection
        fetchDeviceUsageData();
      } else {
        // Permission denied
        console.warn('Usage stats permission denied');
      }
    } catch (err) {
      console.error('Error requesting permission:', err);
    }
  };

  const fetchDeviceUsageData = async () => {
    const endTime = Date.now();
    const startTime = endTime - 86400000; // 24 hours ago

    const stats = await UsageStatsManager.queryUsageStats(
      UsageStatsManager.INTERVAL_DAILY,
      startTime,
      endTime,
    );

    if (stats) {
      setUsageData(stats);
    } else {
      // Handle the case when usage stats are not available or permission is denied
    }
  };

  return (
    <View>
      <Text>Device Usage Data:</Text>
      {usageData.map((data, index) => (
        <Text key={index}>
          {`Package Name: ${data.packageName}, Usage Time: ${data.totalTimeInForeground} ms`}
        </Text>
      ))}
      <Button title="Fetch Usage Data" onPress={fetchDeviceUsageData} />
    </View>
  );
};

export default DeviceUsageAndroid;
