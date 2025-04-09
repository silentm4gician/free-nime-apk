import React, { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator, ScrollView } from 'react-native';
import { Screen } from './Screen';
import { getMainPage } from 'utils/requests';
import { AnimatedCards } from './LastEpCards';
import { Carousel } from './Carousel';
import { RecentSeries } from './RecentSeries'; // Importamos el nuevo componente

export default function Main() {
  const [latestEP, setLatestEP] = useState([]);
  const [carousel, setCarousel] = useState([]);
  const [recentSeries, setRecentSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getMainPage()
      .then((data) => {
        setLatestEP(data.lastetsEp);
        setCarousel(data.carousel);
        setRecentSeries(data.recentSeries);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      </Screen>
    );
  }

  // Renderizar cada episodio en una grilla de 2 columnas
  const renderEpisodeGrid = () => {
    return (
      <View className="mx-6 flex">
        <View className="flex-row flex-wrap">
          {latestEP.map((item, index) => (
            <View key={`anime-${index}`} className="w-1/2 p-1">
              <AnimatedCards anime={item} index={index} isEp={true} />
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <Screen>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Carousel Section */}
        {carousel && carousel.length > 0 && <Carousel data={carousel} />}

        {/* Recent Series Section - Ahora usando el componente separado */}
        <RecentSeries data={recentSeries} />

        <View className="mb-4 px-6">
          <View className="flex-row items-center">
            <View className="h-4 w-1 rounded-full bg-[#CF9FFF]" />
            <Text className="ml-2 text-2xl font-bold text-white">Últimos Episodios</Text>
          </View>
        </View>

        {/* Latest Episodes Section */}
        {!latestEP || latestEP.length === 0 ? (
          <ActivityIndicator size="large" color="#ffffff" />
        ) : (
          renderEpisodeGrid()
        )}
      </ScrollView>
    </Screen>
  );
}
