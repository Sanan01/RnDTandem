/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import {MAPBOX_ACCESS_TOKEN} from '../../mapboxConfig';
interface SearchResult {
  id: string;
  place_name: string;
  geometry: {
    coordinates: [number, number];
  };
}

interface SearchBarProps {
  onSearchResultPress: (longitude: number, latitude: number) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({onSearchResultPress}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const searchLocation = async (query: string) => {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${MAPBOX_ACCESS_TOKEN}&autocomplete=true&limit=7`,
    );
    // `https://api.mapbox.com/search/geocode/v6/forward?q=${query}&access_token=${MAPBOX_ACCESS_TOKEN}&autocomplete=true&country=PK`,
    const data = await response.json();
    setSearchResults(data.features);
  };

  return (
    <View>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for a place"
        value={searchQuery}
        onChangeText={text => {
          setSearchQuery(text);
          searchLocation(text);
        }}
      />
      {searchResults.length > 0 && (
        <FlatList
          data={searchResults}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.searchResultItem}
              onPress={() => {
                const [longitude, latitude] = item.geometry.coordinates;
                onSearchResultPress(longitude, latitude);
                setSearchResults([]);
                setSearchQuery('');
              }}>
              {/* <Text>{item.properties.full_address}</Text> */}
              <Text>{item.place_name}</Text>
            </TouchableOpacity>
          )}
          style={styles.searchResultsContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  searchResultsContainer: {},
  searchResultItem: {
    backgroundColor: 'white',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default SearchBar;
