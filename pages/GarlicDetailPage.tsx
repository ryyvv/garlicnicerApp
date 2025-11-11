import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeContainer } from '../components/SafeContainer';
import { GarlicPlantData } from '../utils/GarlicPlantStorage';

interface GarlicDetailPageProps {
  theme: any;
  styles: any;
  plant: GarlicPlantData;
  onBack: () => void;
}

export class GarlicDetailPage extends Component<GarlicDetailPageProps> {
  render() {
    const { theme, styles, plant, onBack } = this.props;

    return (
      <SafeContainer style={{ backgroundColor: theme.background }}>
        <ScrollView style={{ flex: 1, padding: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <TouchableOpacity onPress={onBack} style={{ marginRight: 15 }}>
              <Text style={{ fontSize: 24, color: theme.text }}>←</Text>
            </TouchableOpacity>
            <Text style={{ ...styles.title, color: theme.text, flex: 1 }}>
              Garlic Details
            </Text>
          </View>

          <View style={[detailStyles.card, { backgroundColor: theme.tertiary }]}>
            <View style={[detailStyles.imageContainer, { backgroundColor: theme.primary + '20' }]}>
              {plant.imageUri ? (
                <Image source={{ uri: plant.imageUri }} style={detailStyles.plantImage} />
              ) : (
                <Text style={{ fontSize: 80 }}>🧄</Text>
              )}
            </View>

            <View style={detailStyles.detailRow}>
              <Text style={[detailStyles.label, { color: theme.text }]}>Title:</Text>
              <Text style={[detailStyles.value, { color: theme.text }]}>{plant.title}</Text>
            </View>

            <View style={detailStyles.detailRow}>
              <Text style={[detailStyles.label, { color: theme.text }]}>Variety:</Text>
              <Text style={[detailStyles.value, { color: theme.text }]}>{plant.varietyName}</Text>
            </View>

            <View style={detailStyles.detailRow}>
              <Text style={[detailStyles.label, { color: theme.text }]}>Location:</Text>
              <Text style={[detailStyles.value, { color: theme.text }]}>{plant.location}</Text>
            </View>

            <View style={detailStyles.detailRow}>
              <Text style={[detailStyles.label, { color: theme.text }]}>Date Setup:</Text>
              <Text style={[detailStyles.value, { color: theme.text }]}>{plant.dateSetup}</Text>
            </View>

            <View style={detailStyles.detailRow}>
              <Text style={[detailStyles.label, { color: theme.text }]}>Already Planted:</Text>
              <Text style={[detailStyles.value, { color: theme.text }]}>{plant.alreadyPlanted ? 'Yes' : 'No'}</Text>
            </View>

            {plant.alreadyPlanted && (
              <View style={detailStyles.detailRow}>
                <Text style={[detailStyles.label, { color: theme.text }]}>Date Planted:</Text>
                <Text style={[detailStyles.value, { color: theme.text }]}>{plant.datePlanted}</Text>
              </View>
            )}

            <View style={detailStyles.detailRow}>
              <Text style={[detailStyles.label, { color: theme.text }]}>Status:</Text>
              <Text style={[detailStyles.value, { color: theme.text }]}>{plant.status}</Text>
            </View>

            <View style={detailStyles.detailRow}>
              <Text style={[detailStyles.label, { color: theme.text }]}>Sync Status:</Text>
              <Text style={[detailStyles.value, { color: plant.synced ? '#4CAF50' : '#FF9800' }]}>
                {plant.synced ? '☁️ Online' : '📱 Offline'}
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeContainer>
    );
  }
}

const detailStyles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  plantImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    flex: 1,
    textAlign: 'right',
  },
});