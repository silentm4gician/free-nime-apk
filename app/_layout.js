import { Stack } from 'expo-router';
import { View } from 'react-native';
import NavBar from '../components/NavBar';
import "../global.css";
import { AboutIcon } from '../components/Icons';

const layout = () => {
  return (
    <View className={`flex-1`}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: 'black',
          },
          headerTintColor: 'white',
          headerTitle: 'FreeNime',
          headerLeft: () => <NavBar />,
          headerRight: () => <AboutIcon />,
        }}
      />
    </View>
  );
};

export default layout;
