import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import AudioRecord from 'react-native-audio-record';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const MicrophoneSensor = () => {
  const [isRecording, setIsRecording] = useState(false);

  const audioConfig = {
    sampleRate: 16000, // You can adjust this based on your requirements
    channels: 1,
    audioEncoding: 'wav',
    outputFormat: 'mpeg_4',
  };

  useEffect(() => {
    requestMicrophonePermission();
    AudioRecord.init(audioConfig);
  }, []);

  const requestMicrophonePermission = async () => {
    try {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.MICROPHONE
          : PERMISSIONS.ANDROID.RECORD_AUDIO;

      const result = await request(permission);

      if (result === RESULTS.GRANTED) {
        // Permission granted, you can now access the microphone
      } else {
        // Permission denied
      }
    } catch (error) {
      console.error('Error requesting microphone permission:', error);
    }
  };

  const startRecording = async () => {
    try {
      await AudioRecord.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = async () => {
    try {
      const audioFile = await AudioRecord.stop();
      setIsRecording(false);
      console.log('Audio file saved at:', audioFile);
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  return (
    <View>
      <Text>Microphone Data Collection</Text>
      {isRecording ? (
        <Button title="Stop Recording" onPress={stopRecording} />
      ) : (
        <Button title="Start Recording" onPress={startRecording} />
      )}
    </View>
  );
};

export default MicrophoneSensor;
