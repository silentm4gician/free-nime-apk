import { Tabs } from 'expo-router';
import { AboutIcon, HomeIcon, SearchIcon } from '../../components/Icons';

export default function TabsLayout({ children }) {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: 'black' },
        tabBarActiveTintColor: '#CF9FFF',
        tabBarInactiveTintColor: 'white',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'Info',
          tabBarIcon: ({ color }) => <AboutIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Buscar',
          tabBarIcon: ({ color }) => <SearchIcon color={color} />,
        }}
      />
    </Tabs>
  );
}
