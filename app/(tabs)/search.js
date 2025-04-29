import { useState } from 'react';
import {
  TextInput,
  View,
  TouchableOpacity,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Screen>
        <View className="p-4 flex-1">
          <TextInput
            className="w-full rounded-lg border border-[#CF9FFF] bg-black/90 p-2 text-[#CF9FFF]"
            onChangeText={setQuery}
            value={query}
            placeholder="yugioh..."
            placeholderTextColor="#CF9FFF"
            cursorColor="#CF9FFF"
            selectionColor="#CF9FFF"
          />

          <TouchableOpacity
            className="mt-4 items-center rounded-lg bg-[#CF9FFF] p-2"
            onPress={handleSearch}>
            <Text className="font-bold text-black">Buscar</Text>
          </TouchableOpacity>

          <Results query={searchTerm} />
        </View>
      </Screen>
    </TouchableWithoutFeedback>
  );
};

export default Search;
