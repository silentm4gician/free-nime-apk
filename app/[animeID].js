import { Link, Stack, useLocalSearchParams } from 'expo-router';
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  ScrollView,
  Pressable,
  FlatList,
  StatusBar,
} from 'react-native';
import { useEffect, useState } from 'react';
import { Screen } from 'components/Screen';
import { getAnimeInfo } from 'utils/requests';

function reconstruirIDParaURL(id) {
  if (id.endsWith('-latino')) {
    const baseID = id.replace(/-latino$/, '');
    return `latino/${baseID}`;
  }
  return id;
}

const Details = () => {
  const { animeID } = useLocalSearchParams();
  const [animeData, setAnimeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (animeID) {
      const fixedID = reconstruirIDParaURL(animeID);
      const url = `https://monoschino2.com/${fixedID}`;
      console.log(url);
      getAnimeInfo(url).then((data) => {
        setAnimeData(data);
        setLoading(false);
      });
    }
  }, [animeID]);

  if (loading) {
    return (
      <Screen>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <View className="flex-1 items-center justify-center bg-black">
          <ActivityIndicator size="large" color="#CF9FFF" />
        </View>
      </Screen>
    );
  }

  if (!animeData) {
    return (
      <Screen>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <View className="flex-1 items-center justify-center bg-black">
          <Text className="text-lg font-medium text-white">
            No se encontró información del anime.
          </Text>
        </View>
      </Screen>
    );
  }

  const { title, image, description, genres, extraInfo, episodes } = animeData;

  return (
    <Screen>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: '#000' },
          headerTintColor: '#CF9FFF',
          headerTitle: title.length > 20 ? title.slice(0, 20) + '...' : title,
          headerShadowVisible: false,
        }}
      />

      <ScrollView className="flex-1 bg-black">
        <View className="px-4 pb-16">
          {/* Hero Section with Image and Title */}
          <View className="mb-6 mt-4 items-center">
            <Image
              source={{ uri: image }}
              className="h-80 w-56 rounded-xl shadow-lg"
              resizeMode="cover"
            />
            <Text className="mt-6 text-center text-2xl font-bold text-[#CF9FFF]">{title}</Text>
          </View>

          {/* Géneros */}
          <View className="mb-6 flex-row flex-wrap justify-center gap-2">
            {genres.map((genre, index) => (
              <View
                key={index}
                className="rounded-full border border-[#CF9FFF] bg-[#CF9FFF]/20 px-4 py-1.5">
                <Text className="text-sm font-medium text-[#CF9FFF]">{genre}</Text>
              </View>
            ))}
          </View>

          {/* Info Extra */}
          <View className="mb-8 rounded-xl bg-[#121212] p-4 shadow-sm">
            <Text className="mb-3 text-xl font-bold text-[#CF9FFF]">Información</Text>
            <View className="space-y-2">
              <Text className="text-base text-white">
                🎞 <Text className="font-medium">Formato:</Text> {extraInfo.format}
              </Text>
              <Text className="text-base text-white">
                📺 <Text className="font-medium">Estado:</Text> {extraInfo.status}
              </Text>
              <Text className="text-base text-white">
                🗓 <Text className="font-medium">Año:</Text> {extraInfo.year}
              </Text>
              <Text className="text-base text-white">
                📌 <Text className="font-medium">Total de Episodios:</Text>{' '}
                {extraInfo.totalEpisodes}
              </Text>
            </View>
          </View>

          {/* Descripción */}
          <View className="mb-8">
            <Text className="mb-3 text-xl font-bold text-[#CF9FFF]">Sinopsis</Text>
            <Text className="text-base leading-6 text-white/90">{description}</Text>
          </View>

          {/* Episodios */}
          <View className="mb-12">
            <Text className="mb-4 text-xl font-bold text-[#CF9FFF]">Episodios</Text>
            {episodes.length > 0 ? (
              <FlatList
                data={episodes}
                keyExtractor={(ep) => ep.url}
                numColumns={2}
                scrollEnabled={false}
                columnWrapperStyle={{ gap: 8 }}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                renderItem={({ item }) => (
                  <View className="flex-1">
                    <Link asChild href={`/watch/${item.id}`}>
                      <Pressable>
                        {({ pressed }) => (
                          <View
                            className={`rounded-lg p-4 ${
                              pressed ? 'bg-[#CF9FFF]' : 'border border-[#CF9FFF]/30 bg-[#121212]'
                            }`}>
                            <Text
                              className={`text-center font-semibold ${pressed ? 'text-black' : 'text-[#CF9FFF]'}`}
                              numberOfLines={1}>
                              {item.title || `Episodio ${item.number}`}
                            </Text>
                          </View>
                        )}
                      </Pressable>
                    </Link>
                  </View>
                )}
              />
            ) : (
              <View className="items-center rounded-lg bg-[#121212] p-4">
                <Text className="text-white/80">No hay episodios disponibles aún.</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
};

export default Details;
