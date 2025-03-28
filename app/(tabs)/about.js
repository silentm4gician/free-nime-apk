import { Screen } from 'components/Screen';
import { ScrollView, Text } from 'react-native';


export default function about() {
  return (
    <Screen>
      <ScrollView>
        <Text className="text-center text-white">About</Text>
        <Text className="my-1 text-4xl text-white">
          JOSEFINA MI AMOR TE AMO HOLA MIRA ESTOY PROGRAMANDO
        </Text>
        <Text className="my-1 text-4xl text-white">
          This is a simple app to demonstrate how to use Tailwind CSS with React Native.
        </Text>
        <Text className="text-6xl text-white">
          This is a simple app to demonstrate how to use Tailwind CSS with React Native.
        </Text>
        <Text className="my-1 text-4xl text-white">
          This is a simple app to demonstrate how to use Tailwind CSS with React Native.
        </Text>
        <Text className="my-1 text-4xl text-white">
          This is a simple app to demonstrate how to use Tailwind CSS with React Native.
        </Text>
      </ScrollView>
    </Screen>
  );
}
