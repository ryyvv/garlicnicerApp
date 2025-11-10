import React, { useState, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  FlatList, 
  Text, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import { LocationSearchService, SearchResult } from '../services/LocationSearchService';

interface LocationSearchInputProps {
  onLocationSelect: (location: SearchResult) => void;
  placeholder?: string;
  theme: any;
}

const LocationSearchInput: React.FC<LocationSearchInputProps> = ({
  onLocationSelect,
  placeholder = "Search city, province, or region...",
  theme
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (query.length > 1) {
      const searchResults = LocationSearchService.searchLocations(query);
      setResults(searchResults);
      setShowResults(true);
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, [query]);

  const handleLocationSelect = (location: SearchResult) => {
    setQuery(`${location.city}, ${location.province}`);
    setShowResults(false);
    onLocationSelect(location);
  };

  const renderResultItem = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity
      style={[styles.resultItem, { borderBottomColor: theme.border }]}
      onPress={() => handleLocationSelect(item)}
    >
      <Text style={[styles.cityText, { color: theme.text }]}>
        {item.city}
      </Text>
      <Text style={[styles.provinceText, { color: theme.textSecondary }]}>
        {item.province}, {item.regionCode}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBackground,
            borderColor: theme.border,
            color: theme.text
          }
        ]}
        value={query}
        onChangeText={setQuery}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
      />
      
      {showResults && results.length > 0 && (
        <View style={[styles.resultsContainer, { backgroundColor: theme.background }]}>
          <FlatList
            data={results}
            renderItem={renderResultItem}
            keyExtractor={(item, index) => `${item.city}-${item.province}-${index}`}
            style={styles.resultsList}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  resultsContainer: {
    position: 'absolute',
    top: 55,
    left: 0,
    right: 0,
    maxHeight: 200,
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  resultsList: {
    borderRadius: 8,
  },
  resultItem: {
    padding: 15,
    borderBottomWidth: 1,
  },
  cityText: {
    fontSize: 16,
    fontWeight: '600',
  },
  provinceText: {
    fontSize: 14,
    marginTop: 2,
  },
});

export default LocationSearchInput;