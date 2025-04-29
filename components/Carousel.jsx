import { Link } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Text, View, Image, Dimensions, TouchableOpacity, FlatList, Animated } from 'react-native';
import { PLayIcon } from './Icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = SCREEN_WIDTH * 0.85;
const ITEM_HEIGHT = ITEM_WIDTH * 0.55;
const SPACING = 10;

export function Carousel({ data }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Auto scroll
  useEffect(() => {
    const timer = setInterval(() => {
      if (data && data.length > 0) {
        const nextIndex = (currentIndex + 1) % data.length;
        if (flatListRef.current) {
          flatListRef.current.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
          setCurrentIndex(nextIndex);
        }
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex, data]);

  const handleViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0 && viewableItems[0].index !== null) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 50,
  };

  const handleScroll = Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
    useNativeDriver: false,
  });

  const renderItem = ({ item, index }) => {
    // Calculate input range for animations
    const inputRange = [
      (index - 1) * (ITEM_WIDTH + SPACING),
      index * (ITEM_WIDTH + SPACING),
      (index + 1) * (ITEM_WIDTH + SPACING),
    ];

    // Animate scale
    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
      extrapolate: 'clamp',
    });

    // Animate opacity
    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.7, 1, 0.7],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={{
          width: ITEM_WIDTH,
          height: ITEM_HEIGHT,
          marginRight: SPACING,
          opacity,
          transform: [{ scale }],
        }}>
        <Link asChild href={`/${item.id}`}>
          <TouchableOpacity
            activeOpacity={0.9}
            className="h-full w-full overflow-hidden rounded-2xl shadow-lg"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
            }}>
            {/* Background Image */}
            <Image source={{ uri: item.image }} className="h-full w-full" resizeMode="cover" />

            {/* Gradient Overlay */}
            <View className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

            {/* Content Container */}
            <View className="absolute bottom-0 left-0 right-0 p-4">
              {/* Featured Badge */}
              <View className="mb-2 self-start rounded-full bg-[#CF9FFF] px-3 py-1">
                <Text className="text-xs font-bold text-black">DESTACADO</Text>
              </View>

              {/* Title */}
              <Text className="text-xl font-bold text-white" numberOfLines={1}>
                {item.title}
              </Text>

              {/* Description */}
              {item.description && (
                <Text className="mt-1 text-sm text-white/90" numberOfLines={2}>
                  {item.description}
                </Text>
              )}

              {/* Watch Button */}
              <View className="mt-3 flex-row items-center">
                <View className="mr-2 h-8 w-8 items-center justify-center rounded-full bg-[#CF9FFF]">
                  {/* <Text className="font-bold text-black">▶</Text> */}
                  <PLayIcon />
                </View>
                <Text className="text-sm font-medium text-[#CF9FFF]">Ver ahora</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Link>
      </Animated.View>
    );
  };

  const renderPagination = () => {
    return (
      <View className="mt-4 flex-row items-center justify-center">
        {data.map((_, index) => {
          // Calculate input range for dot animations
          const inputRange = [
            (index - 1) * (ITEM_WIDTH + SPACING),
            index * (ITEM_WIDTH + SPACING),
            (index + 1) * (ITEM_WIDTH + SPACING),
          ];

          // Animate width
          const width = scrollX.interpolate({
            inputRange,
            outputRange: [8, 20, 8],
            extrapolate: 'clamp',
          });

          // Animate opacity
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.5, 1, 0.5],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={{
                width,
                opacity,
                height: 8,
                borderRadius: 4,
                backgroundColor: '#CF9FFF',
                marginHorizontal: 4,
              }}
            />
          );
        })}
      </View>
    );
  };

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <View className="my-6">
      <View className="mb-4 flex-row items-center justify-between px-4">
        <View className="flex-row items-center">
          <View className="mr-2 h-4 w-1 rounded-full bg-[#CF9FFF]" />
          <Text className="text-2xl font-bold text-white">Destacados</Text>
        </View>
        {/* <TouchableOpacity>
          <Text className="text-sm font-medium text-[#CF9FFF]">Ver todos</Text>
        </TouchableOpacity> */}
      </View>

      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(item, index) => `carousel-item-${index}`}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH + SPACING}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingLeft: (SCREEN_WIDTH - ITEM_WIDTH) / 2,
          paddingRight: (SCREEN_WIDTH - ITEM_WIDTH) / 2 - SPACING,
        }}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        getItemLayout={(data, index) => ({
          length: ITEM_WIDTH + SPACING,
          offset: (ITEM_WIDTH + SPACING) * index,
          index,
        })}
      />

      {renderPagination()}
    </View>
  );
}
