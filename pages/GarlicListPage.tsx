import React, { Component } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { SafeContainer } from '../components/SafeContainer';
import { CreateGarlicPage } from './CreateGarlicPage';
import { GarlicDetailPage } from './GarlicDetailPage';
import { GarlicPlantData } from '../utils/GarlicPlantStorage';
import { ENV } from '../config/env'; 

interface GarlicListPageProps {
  theme: any;
  styles: any;
  onCameraStateChange?: (isActive: boolean) => void;
}

interface GarlicListPageState {
  loading: boolean;
  showCreatePage: boolean;
  showDetailPage: boolean;
  selectedPlant: GarlicPlantData | null;
  garlicPlants: GarlicPlantData[];
}

export class GarlicListPage extends Component<GarlicListPageProps, GarlicListPageState> {
  constructor(props: GarlicListPageProps) {
    super(props);
    this.state = {
      loading: false,
      showCreatePage: false,
      showDetailPage: false,
      selectedPlant: null,
      garlicPlants: []
    };
  }

  private handleCreatePress = (): void => {
    this.setState({ showCreatePage: true });
  };

  private handleBackFromCreate = (): void => {
    this.setState({ showCreatePage: false });
    this.loadGarlicPlants();
  };

  private handlePlantPress = (plant: GarlicPlantData): void => {
    this.setState({ selectedPlant: plant, showDetailPage: true });
  };

  private handleBackFromDetail = (): void => {
    this.setState({ showDetailPage: false, selectedPlant: null });
  };

  async componentDidMount() {
    this.loadGarlicPlants();
  }

  private loadGarlicPlants = async (): Promise<void> => {
    try {
      const data = await AsyncStorage.getItem('garlicPlants');
      if (data) {
        const garlicPlants = JSON.parse(data);
        this.setState({ garlicPlants });
      }
    } catch (error) {
      console.error('Failed to load garlic plants:', error);
    }
  };

  private deleteGarlicPlant = async (id: string): Promise<void> => {
    Alert.alert(
      'Delete Garlic Plant',
      'Are you sure you want to delete this garlic plant?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedPlants = this.state.garlicPlants.filter(plant => plant.id !== id);
              await AsyncStorage.setItem('garlicPlants', JSON.stringify(updatedPlants));
              this.setState({ garlicPlants: updatedPlants });
            } catch (error) {
              console.error('Failed to delete garlic plant:', error);
            }
          }
        }
      ]
    );
  };

  private reuploadOfflineData = async (): Promise<void> => {
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      Alert.alert('No Internet', 'Please connect to internet to reupload data');
      return;
    }

    const offlinePlants = this.state.garlicPlants.filter(plant => !plant.synced);
    if (offlinePlants.length === 0) {
      Alert.alert('No Data', 'No offline data to upload');
      return;
    }

    try {
      const updatedPlants = this.state.garlicPlants.map(plant => 
        plant.synced ? plant : { ...plant, synced: true }
      );
      await AsyncStorage.setItem('garlicPlants', JSON.stringify(updatedPlants));
      this.setState({ garlicPlants: updatedPlants });
      Alert.alert('Success', `${offlinePlants.length} items uploaded successfully`);
    } catch (error) {
      Alert.alert('Error', 'Failed to upload offline data');
    }
  };

  render() {
    const { theme, styles } = this.props;
    const { showCreatePage, showDetailPage, selectedPlant } = this.state;

    if (showCreatePage) {
      return (
        <CreateGarlicPage
          theme={theme}
          styles={styles}
          onBack={this.handleBackFromCreate}
          onCameraStateChange={this.props.onCameraStateChange}
        />
      );
    }

    if (showDetailPage && selectedPlant) {
      return (
        <GarlicDetailPage
          theme={theme}
          styles={styles}
          plant={selectedPlant}
          onBack={this.handleBackFromDetail}
        />
      );
    }

    return (
      <SafeContainer style={{ backgroundColor: theme.background }}>
        <ScrollView style={{ flex: 1, padding: 20 }}>
          <Text style={{ ...styles.title, color: theme.text }}>
            🧄 Garlic List
          </Text>
          <Text style={{ ...styles.description, color: theme.text }}>
            Manage your garlic varieties and crops
          </Text>
          
          {this.state.garlicPlants.map((plant) => (
            <TouchableOpacity 
              key={plant.id} 
              style={[garlicCardStyles.card, { backgroundColor: theme.tertiary }]}
              onPress={() => this.handlePlantPress(plant)}
            >
              <View style={garlicCardStyles.imageContainer}>
                {plant.imageUri ? (
                  <Image source={{ uri: plant.imageUri }} style={garlicCardStyles.plantImage} />
                ) : (
                  <View style={[garlicCardStyles.imagePlaceholder, { backgroundColor: theme.primary + '20' }]}>
                    <Text style={{ fontSize: 30 }}>🧄</Text>
                  </View>
                )}
              </View>
              
              <View style={garlicCardStyles.titleContainer}>
                <Text style={[garlicCardStyles.title, { color: theme.text }]}>{plant.title}</Text>
                <Text style={[garlicCardStyles.variety, { color: theme.text + '80' }]}>{plant.varietyName}</Text>
                <Text style={[garlicCardStyles.statusText, { color: plant.synced ? '#4CAF50' : '#FF9800' }]}>
                  {plant.synced ? 'Online' : 'Offline'}
                </Text>
              </View>
              
          
              
              <TouchableOpacity 
                style={garlicCardStyles.deleteButton}
                onPress={(e) => {
                  e.stopPropagation();
                  this.deleteGarlicPlant(plant.id);
                }}
              >
                <Text style={garlicCardStyles.deleteIcon}>🗑️</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        {this.state.garlicPlants.some(plant => !plant.synced) && (
          <TouchableOpacity 
            style={[floatingButtonStyles.reuploadButton, { backgroundColor: '#FF9800' }]}
            onPress={this.reuploadOfflineData}
          >
            <Text style={floatingButtonStyles.reuploadText}>↑</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[floatingButtonStyles.fab, { backgroundColor: theme.primary }]}
          onPress={this.handleCreatePress}
        >
          <Text style={floatingButtonStyles.fabText}>+</Text>
        </TouchableOpacity>
      </SafeContainer>
    );
  }
}

const garlicCardStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    marginRight: 15,
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plantImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  variety: {
    fontSize: 14,
  },
  statusContainer: {
    alignItems: 'center',
    marginRight: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  statusIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 8,
  },
  deleteIcon: {
    fontSize: 20,
  },
});

const floatingButtonStyles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 200,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  fabText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  reuploadButton: {
    position: 'absolute',
    bottom: 270,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  reuploadText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});