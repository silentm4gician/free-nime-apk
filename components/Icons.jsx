import { Entypo } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';

export const AboutIcon = ({ color }) => {
  return (
    <Link asChild href={'/about'} className="">
      <Pressable className={``}>
        {({ pressed }) => (
          <Entypo
            name="info-with-circle"
            size={24}
            color={color}
            style={{ opacity: pressed ? 0.5 : 1 }}
          />
        )}
      </Pressable>
    </Link>
  );
};

export const HomeIcon = ({ color }) => {
  return (
    <Link asChild href={'/'} className="">
      <Pressable className={``}>
        {({ pressed }) => (
          <Entypo name="home" size={24} color={color} style={{ opacity: pressed ? 0.5 : 1 }} />
        )}
      </Pressable>
    </Link>
  );
};

export const SearchIcon = ({ color }) => {
  return (
    <Link asChild href={'/search'} className="">
      <Pressable className={``}>
        {({ pressed }) => (
          <FontAwesome
            name="search"
            size={24}
            color={color}
            style={{ opacity: pressed ? 0.5 : 1 }}
          />
        )}
      </Pressable>
    </Link>
  );
};

export const PLayIcon = ({ color }) => {
  return <Entypo name="controller-play" size={20} color="black" />;
};

export const GitHubIcon = ({ color }) => {
  return <AntDesign name="github" size={24} color="black" />;
};
