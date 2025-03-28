import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { getResults } from 'utils/requests';
import { AnimatedCards } from './LastEpCards';

const Results = ({ query }) => {
  const [page, setPage] = useState(1);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getResults(query, page).then((data) => {
      setResults(data.data.animes);
      setLoading(false);
    });
  }, [query, page]);

  return (
    <View>
      {results?.length < 0 ? (
        <ActivityIndicator size="large" color="white" />
      ) : (
        <View className={`mx-6 mb-32 flex`}>
          <FlatList
            data={results}
            keyExtractor={(anime) => anime.id.toString()}
            numColumns={2}
            renderItem={({ item, index }) => (
              <View className="flex-1 p-1">
                <AnimatedCards anime={item} index={index} />
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default Results;
