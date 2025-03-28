import { useEffect, useState } from 'react';
import { Text, View, FlatList, ActivityIndicator } from 'react-native';
import { Screen } from './Screen';
import { getHomePage } from 'utils/requests';
import { AnimatedCards } from './LastEpCards';

export default function Main() {
  const [latestEP, setLatestEP] = useState([]);
  const [trending, setTrending] = useState([]);
  const [topAiring, setTopAiring] = useState([]);

  useEffect(() => {
    getHomePage().then((data) => {
      setLatestEP(data.data.latestEpisodeAnimes);
      setTrending(data.data.trendingAnimes);
      setTopAiring(data.data.topAiringAnimes);
    });
  }, []);

  return (
    <Screen>
      <View>
        <View>
          <Text className=" py-2 text-center text-4xl text-white ">Latest Episodes</Text>
        </View>
        {latestEP?.length === 0 ? (
          <ActivityIndicator size={'large'} />
        ) : (
          <View className={`mx-6 mb-32 flex`}>
            <FlatList
              data={latestEP}
              keyExtractor={(anime) => anime.id.toString()}
              numColumns={2} // ✅ Configura la grilla con 2 columnas
              renderItem={({ item, index }) => (
                <View className="flex-1 p-1">
                  <AnimatedCards anime={item} index={index} isEp={true} />
                </View>
              )}
            />
          </View>
        )}
      </View>
    </Screen>
  );
}
