import { Link } from 'expo-router';
import { useEffect, useRef } from 'react';
import { View, Text, Image, Animated, Pressable } from 'react-native';

export function LastEpCards({ anime, isEp }) {
  return (
    <Link asChild href={isEp ? `/watch/${anime.id}?ep=${anime.episodes.sub}` : `/${anime.id}`}>
      <Pressable>
        {({ pressed }) => (
          <View className="my-2 w-full rounded-lg" style={{ opacity: pressed ? 0.5 : 1 }}>
            <View className="relative w-full">
              <Image source={{ uri: anime.poster }} className="h-28 w-full rounded" />

              <View className="absolute left-0 top-0 h-full w-full rounded bg-black opacity-30" />

              <Text className="absolute bottom-1 right-2 w-full p-2 text-center font-bold text-white">
                {anime.jname.slice(0, 20)}...
              </Text>

              <Text className="absolute right-2 top-1 rounded-lg p-2 text-3xl font-bold text-white">
                {anime.episodes.sub}
              </Text>

              <Text className="absolute left-2 top-1 rounded-lg p-2 text-3xl font-bold text-white">
                {anime.type}
              </Text>
            </View>
          </View>
        )}
      </Pressable>
    </Link>
  );
}

export function AnimatedCards({ anime, index, isEp }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, [opacity, index]);

  return (
    <Animated.View style={{ opacity }}>
      <LastEpCards anime={anime} isEp={isEp} />
    </Animated.View>
  );
}
