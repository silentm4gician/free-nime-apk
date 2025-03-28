import { useState } from 'react';
import { TextInput, View, TouchableOpacity, Text } from 'react-native';
import Results from '../../components/Results';
import { Screen } from '../../components/Screen';

const Search = () => {
  const [query, setQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    setSearchTerm(query);
    setQuery('');
  };

  return (
    <Screen>
      <View className="p-4">
        <TextInput
          className="w-full rounded-lg bg-purple-700 p-2 text-white"
          onChangeText={setQuery}
          value={query}
          placeholder="Search for anime"
          placeholderTextColor="#ccc"
          cursorColor="white"
          selectionColor="purple"
        />

        <TouchableOpacity
          className="mt-4 items-center rounded-lg bg-purple-600 p-2"
          onPress={handleSearch}>
          <Text className="font-bold text-white">search</Text>
        </TouchableOpacity>

        <Results query={searchTerm} />
      </View>
    </Screen>
  );
};

export default Search;
