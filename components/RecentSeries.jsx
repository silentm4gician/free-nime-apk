import { Link } from 'expo-router';
import { Text, View, Image, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useState } from 'react';

// Enhanced card component with fixed height
const RecentSeriesCard = ({ series }) => {
  const seriesID = series.id;
  const [pressed, setPressed] = useState(false);

  // Animation for card press
  const animatedScale = useState(new Animated.Value(1))[0];

  const handlePressIn = () => {
    setPressed(true);
    Animated.spring(animatedScale, {
      toValue: 0.95,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setPressed(false);
    Animated.spring(animatedScale, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Link asChild href={`/${seriesID}`}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className="mr-5 w-[150px]">
        <Animated.View
          style={{
            transform: [{ scale: animatedScale }],
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 5,
            height: 280, // Fixed total height
          }}>
          {/* Card Container - Fixed height */}
          <View className="h-full overflow-hidden rounded-xl bg-[#121212]">
            {/* Image Container - Fixed height */}
            <View className="relative h-[200px]">
              <Image source={{ uri: series.image }} className="h-full w-full" resizeMode="cover" />

              {/* Gradient Overlay */}
              <View className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

              {/* Status Badge */}
              <View
                className={`absolute right-0 top-0 rounded-bl-lg px-2.5 py-1.5 ${
                  series.status === 'En emision'
                    ? 'bg-[#CF9FFF]/90'
                    : series.status === 'Finalizado'
                      ? 'bg-green-500/90'
                      : 'bg-black/80'
                }`}>
                <Text
                  className={`text-xs font-bold ${
                    series.status === 'En emision' || series.status === 'Finalizado'
                      ? 'text-black'
                      : 'text-[#CF9FFF]'
                  }`}>
                  {series.status}
                </Text>
              </View>

              {/* New indicator */}
              <View className="absolute left-2 top-2 h-2 w-2 rounded-full bg-[#CF9FFF] shadow-sm shadow-[#CF9FFF]" />
            </View>

            {/* Content Container - Fixed height */}
            <View className="flex-1 justify-between p-3">
              {/* Title with fixed height */}
              <View className="h-[36px]">
                <Text
                  className="font-medium text-white"
                  numberOfLines={2}
                  style={{ lineHeight: 18 }}>
                  {series.title}
                </Text>
              </View>

              {/* Watch button */}
              <View className="mt-2 flex-row items-center">
                <View className="mr-1.5 h-5 w-5 items-center justify-center rounded-full bg-[#CF9FFF]/20">
                  <Text className="text-[10px] text-[#CF9FFF]">▶</Text>
                </View>
                <Text className="text-xs text-[#CF9FFF]">Ver serie</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Link>
  );
};

// Enhanced main component
export const RecentSeries = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <View className="mb-4 mt-6">
      <View className="mb-4 flex-row items-center justify-between px-6">
        <View className="flex-row items-center">
          <View className="mr-2 h-4 w-1 rounded-full bg-[#CF9FFF]" />
          <Text className="text-2xl font-bold text-white">En Emisión</Text>
        </View>
        {/* <TouchableOpacity className="rounded-full bg-[#CF9FFF]/10 px-3 py-1">
          <Text className="text-sm font-medium text-[#CF9FFF]">Ver todas</Text>
        </TouchableOpacity> */}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 24, paddingRight: 16 }}
        className="pb-2">
        {data.map((series, index) => (
          <RecentSeriesCard key={`recent-series-${index}`} series={series} />
        ))}
      </ScrollView>
    </View>
  );
};
