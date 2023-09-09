import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faDatabase, faHammer } from '../FontAwesomeIcons.ts'; // Import the FontAwesome icons
import Sensors from './Sensors';
import Data from './Data';
import Settings from './Settings';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Sensors"
        component={Sensors}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faEye} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Data"
        component={Data}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faDatabase} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faHammer} color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
