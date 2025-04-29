import { Image, Pressable, Text, View } from 'react-native';
import icon from '../assets/icon.png';
import { Link } from 'expo-router';

const NavBar = () => {
  return (
    <View className={`flex-row items-center justify-center`}>
      <Link asChild href={'/'} className="">
        <Pressable>
          {({ pressed }) => (
            <Image
              source={icon}
              style={{
                opacity: pressed ? 0.5 : 1,
                width: 50,
                height: 50,
                borderRadius: 100,
                marginHorizontal: 6,
              }}
              className='border-2 border-[#CF9FFF] bg-[#121212] p-1'
            />
          )}
        </Pressable>
      </Link>
    </View>
  );
};

export default NavBar;
