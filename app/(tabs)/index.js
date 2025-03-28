import Main from 'components/Main';
import 'expo-router/entry';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import '../../global.css';

export default function index() {
  return (
    <SafeAreaProvider>
      <View className={`flex-1 items-center justify-center bg-black w-full`}>
        <StatusBar style="light" />
        <Main />
      </View>
    </SafeAreaProvider>
  );
}
