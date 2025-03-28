import { Link, Stack, useLocalSearchParams } from 'expo-router';
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  ScrollView,
  Pressable,
  FlatList,
} from 'react-native';
import { useEffect, useState } from 'react';
import { Screen } from 'components/Screen';
import { getAnimeDetails, getEpisodes } from 'utils/requests';

const Details = () => {
  const { animeID } = useLocalSearchParams();
  const [animeData, setAnimeData] = useState([]);
  const [episodes, setEpisodes] = useState([]);

  useEffect(() => {
    getAnimeDetails(animeID).then((data) => {
      setAnimeData(data.data);
    });

    getEpisodes(animeID).then((data) => {
      setEpisodes(data.data.episodes);
    });
  }, []);

  return (
    <Screen>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: 'purple' },
          headerTintColor: 'white',
          headerLeft: () => {},
          headerRight: () => {},
          headerTitle: 'Anime Details',
        }}
      />
      <View className="items-center p-4">
        {animeData.length === 0 ? (
          <ActivityIndicator color={'purple'} size={'large'} />
        ) : (
          <View className="items-center justify-center">
            <Text className="my-2 text-2xl font-bold text-white">{animeData?.anime.info.name}</Text>
            <Image
              source={{ uri: animeData?.anime.info.poster }}
              className="my-2 size-48 rounded-md"
            />
            <ScrollView className="h-[300px] w-full">
              <Text className="p-4 text-white">{animeData?.anime.info.description}</Text>
            </ScrollView>
            <View className="h-1/2 w-full p-4">
              <Text className="my-2 text-lg text-white">Episodes</Text>
              <FlatList
                data={episodes}
                keyExtractor={(episode) => episode.episodeId.toString()}
                numColumns={4} // ✅ Configura la grilla
                renderItem={({ item }) => (
                  <View className="w-1/4 p-1">
                    <Link asChild href={`/watch/${item.episodeId}`}>
                      <Pressable>
                        {({ pressed }) => (
                          <View
                            className={`${
                              pressed ? 'bg-purple-400' : 'bg-purple-500'
                            } rounded-md p-2`}>
                            <Text className="text-center text-white">{item.number}</Text>
                          </View>
                        )}
                      </Pressable>
                    </Link>
                  </View>
                )}
              />
            </View>
          </View>
        )}
      </View>
    </Screen>
  );
};

export default Details;
