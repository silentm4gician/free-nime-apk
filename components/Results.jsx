import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { getResults } from 'utils/requests';
import { AnimatedCards } from './LastEpCards';

const Results = ({ query }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getResults(query).then((data) => {
      setResults(data);
      setLoading(false);
    });
  }, [query]);

  return (
    <View className="w-full">
      {loading ? (
        <ActivityIndicator size="large" color="white" />
      ) : results?.length > 0 ? (
        <View className={``}>
          <View className="flex-row items-center py-4">
            <View className="h-4 w-1 rounded-full bg-[#CF9FFF]" />
            <Text className="ml-2 text-2xl font-bold text-white">Resultados</Text>
          </View>

          <FlatList
            data={results}
            keyExtractor={(anime) => anime.id.toString()}
            numColumns={2}
            renderItem={({ item, index }) => (
              <View className="flex-1 p-1">
                <AnimatedCards anime={item} index={index} />
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 32 }}
          />
        </View>
      ) : (
        <Text>no hay resultados</Text>
      )}
    </View>
  );
};

export default Results;
