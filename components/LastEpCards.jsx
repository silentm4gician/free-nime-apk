import { Link } from 'expo-router';
import { useEffect, useRef } from 'react';
import { View, Text, Image, Animated, Pressable } from 'react-native';
import { extractContentName } from 'utils/helpers';

export function LastEpCards({ anime, isEp }) {
  const image = anime.image;
  const epID = extractContentName(anime.url);
  const title = anime.title;
  const epNumber = anime.episodeNumber;

  return (
    <Link asChild href={isEp ? `watch/${epID}` : `/${epID}`}>
      <Pressable className="my-2 w-full">
        {({ pressed }) => (
          <Animated.View
            className={`overflow-hidden rounded-xl ${pressed ? 'scale-95' : 'scale-100'}`}
            style={{
              transform: [{ scale: pressed ? 0.98 : 1 }],
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 5,
              opacity: pressed ? 0.9 : 1,
              transition: 'all 0.2s',
            }}>
            {/* Card Container */}
            <View className="relative w-full">
              {/* Image */}
              <Image source={{ uri: image }} className="h-36 w-full" resizeMode="cover" />

              {/* Black Overlay for better text legibility */}
              <View className="absolute left-0 top-0 h-full w-full bg-black opacity-20" />

              {/* Gradient Overlay on top of black overlay */}
              <View className="absolute left-0 top-0 h-full w-full bg-gradient-to-t from-black via-black/50 to-transparent" />

              {/* Episode Badge */}
              <View className="absolute right-2 top-2 rounded-lg bg-black/80 px-2.5 py-1 shadow-md">
                <Text className="text-sm font-bold text-[#CF9FFF]">{epNumber}</Text>
              </View>

              {/* Content Container */}
              <View className="absolute bottom-0 left-0 w-full p-3">
                {/* Title with improved background for legibility */}
                <View className="flex-row items-center">
                  {/* <View className="rounded-lg bg-black/60 px-2.5 py-1"> */}
                    <Text
                      className="text-sm font-bold text-white"
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      {title}
                    </Text>
                  {/* </View> */}
                </View>
              </View>

              <View className="absolute left-0 top-0 w-full p-3">
                <View className="flex-row items-center">
                  <View className="rounded-full bg-black/60 px-2.5 py-0.5">
                    <Text className="text-xs font-medium text-[#CF9FFF]">
                      {isEp ? 'Episodio' : 'Serie'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Play Indicator */}
              {isEp && (
                <View className="absolute left-1/2 top-1/2 -ml-6 -mt-6 h-12 w-12 items-center justify-center rounded-full bg-black/60">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-[#CF9FFF]">
                    <Text className="ml-1 text-lg font-bold text-black">▶</Text>
                  </View>
                </View>
              )}
            </View>
          </Animated.View>
        )}
      </Pressable>
    </Link>
  );
}

export function AnimatedCards({ anime, index, isEp }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 600,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY, index]);

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateY }],
      }}>
      <LastEpCards anime={anime} isEp={isEp} />
    </Animated.View>
  );
}
