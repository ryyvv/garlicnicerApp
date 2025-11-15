import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, Switch, Modal, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import NetInfo from '@react-native-community/netinfo';
import { SafeContainer } from '../components/SafeContainer';
import { GarlicCamera } from '../components/GarlicCamera';
import { Calendar } from 'react-native-calendars';
import { LocationStorage, SavedLocation } from '../utils/LocationStorage';
import { GarlicPlantStorage } from '../utils/GarlicPlantStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetworkStatus from '../components/NetworkStatus';
import { CustomDropdown } from '../components/CustomDropdown';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const API_BASE_URL = process.env.API_BASE_URL || 'http://192.168.8.132:8000';


interface CreateGarlicPageProps {
  theme: any;
  styles: any;
  onBack: () => void;
  onSave?: (garlicData: any) => void;
  savedLocations?: string[];
  onCameraStateChange?: (isActive: boolean) => void;
  useruid?: string;
}

interface CreateGarlicPageState {
  title: string;
  varietyName: string;
  dateSetup: string;
  alreadyPlanted: boolean;
  datePlanted: string;
  showDateSetupPicker: boolean;
  showDatePlantedPicker: boolean;
  selectedLocation: SavedLocation | null;
  savedLocations: SavedLocation[];
  showLocationDropdown: boolean;
  imageUri: string;
  showCustomCamera: boolean;
  selectedVariety: any;
  varieties: any[];
  userData: any;
  isLoading: boolean;
}

export class CreateGarlicPage extends Component<CreateGarlicPageProps, CreateGarlicPageState> {
  constructor(props: CreateGarlicPageProps) {
    super(props);
    this.state = {
      title: '',
      varietyName: '',
      dateSetup: '',
      alreadyPlanted: false,
      datePlanted: '',
      showDateSetupPicker: false,
      showDatePlantedPicker: false,
      selectedLocation: null,
      savedLocations: [],
      showLocationDropdown: false,
      imageUri: '',
      showCustomCamera: false,
      selectedVariety: null,
      varieties: [],
      userData: null,
      isLoading: false
    };
  }

  async componentDidMount() {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const userResponse = await fetch(`${API_BASE_URL}/api/v1/users/users/firebase_id/${user?.uid}`);
      const userData = await userResponse.json();
      
      const userLocation = await fetch(`${API_BASE_URL}/api/v1/users/plant_location/${userData.id}`);
      const userLocationData = await userLocation.json();
      console.log('userLocation:', userLocationData);
      
      const savedLocations: SavedLocation[] = userLocationData.map((loc: any) => ({
        id: loc.id,
        city: loc.city,
        province: loc.province,
        region: loc.region,
        coords: { latitude: loc.latitude, longitude: loc.longitude },
        savedAt: new Date().toISOString(),
        user_id: userData.id
      }));
      
      // Fetch varieties
      const varietiesResponse = await fetch(`${API_BASE_URL}/api/v1/garlic-variety/`);
      const varieties = await varietiesResponse.json();
      
      this.setState({ savedLocations, varieties, userData });
    } catch (error) {
      console.error('Failed to load data:', error);
      this.setState({ savedLocations: [], varieties: [] });
    }
  }

  private handleVarietySelect = (variety: any): void => {
    console.log('Selected variety:', variety);
    this.setState({ selectedVariety: variety, varietyName: variety.variety_name });
  };

  private handleLocationSelect = (location: SavedLocation): void => {
    console.log('Selected location:', location);
    this.setState({ selectedLocation: location });
  };

  private logSavedLocationsList = (): void => {
    
  };

  private formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  private handleDateSetupSelect = (date: Date): void => {
    this.setState({ 
      dateSetup: this.formatDate(date),
      showDateSetupPicker: false 
    });
  };

  private handleDatePlantedSelect = (date: Date): void => {
    this.setState({ 
      datePlanted: this.formatDate(date),
      showDatePlantedPicker: false 
    });
  };

  private validateForm = (): boolean => {
    const { title, varietyName, selectedLocation, dateSetup, alreadyPlanted, datePlanted, imageUri } = this.state;
    
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Title is required');
      return false;
    }
    if (!varietyName.trim()) {
      Alert.alert('Validation Error', 'Variety name is required');
      return false;
    }
    if (!imageUri) {
      Alert.alert('Validation Error', 'Plant image is required');
      return false;
    }
    if (!selectedLocation) {
      Alert.alert('Validation Error', 'Location is required');
      return false;
    }
    if (!dateSetup) {
      Alert.alert('Validation Error', 'Date setup is required');
      return false;
    }
    if (alreadyPlanted && !datePlanted) {
      Alert.alert('Validation Error', 'Date planted is required when already planted is selected');
      return false;
    }
    
    return true;
  };



  private handleImagePicker = (): void => {
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => this.openCamera() },
        { text: 'Photo Library', onPress: () => this.openLibrary() },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  private openCamera = async (): Promise<void> => {
    this.setState({ showCustomCamera: true });
    this.props.onCameraStateChange?.(true);
  };

  private launchNativeCamera = async (): Promise<void> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera permission is required to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    this.setState({ showCustomCamera: false });
    
    if (!result.canceled && result.assets[0]) {
      this.setState({ imageUri: result.assets[0].uri });
    }
  };

  private handleCameraClose = (): void => {
    this.setState({ showCustomCamera: false });
    this.props.onCameraStateChange?.(false);
  };

  private openLibrary = async (): Promise<void> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Photo library permission is required to select photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      this.setState({ imageUri: result.assets[0].uri });
    }
  };

  private getImageFilename = (uri: string): string => {
    return uri.split('/').pop() || '';
  };



  private handleSave = async (): Promise<void> => {
    if (!this.validateForm()) {
      return;
    }

    this.setState({ isLoading: true });
    const netInfo = await NetInfo.fetch();
    console.log('Network Status:', netInfo.isConnected ? 'Online' : 'Offline');
    
    const { onBack } = this.props;
    const { title, dateSetup, alreadyPlanted, datePlanted, imageUri } = this.state;

    if (netInfo.isConnected) {
      try {
        // Check Firebase auth
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          throw new Error('User not authenticated');
        }

        // Upload image to Firebase Storage
        let imageUploadUrl = '';
        if (imageUri) {
          const response = await fetch(imageUri);
          const blob = await response.blob();
          const storage = getStorage();
          const imageRef = ref(storage, `garlic_images/${this.getImageFilename(imageUri)}`);
          await uploadBytes(imageRef, blob);
          imageUploadUrl = await getDownloadURL(imageRef);
          console.log('Image uploaded to Firebase:', imageUploadUrl);
        }

        // Save garlic plant
        const garlicPlantData = {
          garlic_title: title,
          user_id: this.state.userData?.id,
          variety_id: this.state.selectedVariety?.id,
          plant_location_id: this.state.selectedLocation?.id, 
          status: 'Pending',
          date_setup: new Date(dateSetup).toISOString(),
          date_planted: alreadyPlanted ? new Date(datePlanted).toISOString() : new Date(dateSetup).toISOString(),
          is_active: true
        };
  
        console.log('Sending data:', JSON.stringify(garlicPlantData, null, 2));

        const plantResponse = await fetch(`${API_BASE_URL}/api/v1/garlic-plant/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(garlicPlantData)
        });

        console.log('Response status:', plantResponse.status);
        console.log('Response headers:', plantResponse.headers);

        if (!plantResponse.ok) {
          const errorText = await plantResponse.text();
          console.log('Error response:', errorText);
          throw new Error(`API Error ${plantResponse.status}: ${errorText}`);
        }
        const plantResult = await plantResponse.json();
        console.log('Garlic plant saved:', plantResult);

        // Save garlic image
        const imageData = {
          garlic_plant_id: plantResult.id,
          images_name: `${user.uid}_${Date.now()}.jpg`,
          images_bucket: 'garlic_images',
          images_url: imageUploadUrl,
          image_result: 'uploaded',
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const imageResponse = await fetch(`${API_BASE_URL}/api/v1/users/garlic_images/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(imageData)
        });

        if (!imageResponse.ok) {
          const errorData = await imageResponse.json();
          throw new Error(`Garlic Image API Error: ${JSON.stringify(errorData)}`);
        }
        console.log('Garlic image saved successfully');
        
        onBack();
      } catch (error) {
        console.error('API Error:', error);
        Alert.alert('Error', 'Failed to save data online');
      } finally {
        this.setState({ isLoading: false });
      }
    } else {
      // Save offline
      const { varietyName, selectedLocation } = this.state;
      const garlicData = {
        id: Date.now().toString(),
        title,
        userUid: this.props.useruid || 'temp_user',
        varietyName,
        location: selectedLocation ? `${selectedLocation.city}, ${selectedLocation.province}` : '',
        status: 'Pending',
        dateSetup,
        alreadyPlanted,
        datePlanted,
        imageFilename: this.getImageFilename(imageUri),
        imageUri,
        synced: false
      };
      
      try {
        await GarlicPlantStorage.saveGarlicPlant(garlicData);
        console.log('Garlic data saved offline');
        onBack();
      } catch (error) {
        console.error('Failed to save garlic data offline:', error);
        Alert.alert('Error', 'Failed to save garlic plant data');
      } finally {
        this.setState({ isLoading: false });
      }
    }
  };

  render() {
    const { theme, styles, onBack } = this.props;
    const { title, varietyName, dateSetup, alreadyPlanted, datePlanted, showDateSetupPicker, showDatePlantedPicker, selectedLocation, savedLocations, showLocationDropdown, imageUri, showCustomCamera, selectedVariety, varieties, isLoading } = this.state;
    


    if (showCustomCamera) {
      return (
        <GarlicCamera
          theme={theme}
          onCapture={(imageUri) => {
            this.setState({ imageUri, showCustomCamera: false });
            this.props.onCameraStateChange?.(false);
          }}
          onClose={() => {
            this.setState({ showCustomCamera: false });
            this.props.onCameraStateChange?.(false);
          }}
        />
      );
    }

    return (
      <SafeContainer style={{ backgroundColor: theme.background }}>
        <ScrollView 
          style={{ flex: 1, padding: 20 }}
          contentContainerStyle={{ paddingBottom: 100 }}
        >

          

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <TouchableOpacity onPress={onBack} style={{ marginRight: 15 }}>
              <Text style={{ fontSize: 24, color: theme.text }}>←</Text>
            </TouchableOpacity>
            <Text style={{ ...styles.title, color: theme.text, flex: 1 }}>
              Add New Garlic
            </Text>
          </View>

          <View style={createStyles.formContainer}>

            <Text style={[createStyles.label, { color: theme.text }]}>Plant Image</Text>
            <TouchableOpacity
              style={[createStyles.imageUpload, { borderColor: theme.primary }]}
              onPress={this.handleImagePicker}
            >
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={createStyles.uploadedImage} />
              ) : (
                <View style={createStyles.imagePlaceholder}>
                  <Text style={[createStyles.imagePlaceholderText, { color: theme.text + '80' }]}>📷 Add Photo</Text>
                </View>
              )}
            </TouchableOpacity>
            <Text style={[createStyles.label, { color: theme.text }]}>Title of Garlic Plant</Text>
            <TextInput
              style={[createStyles.input, { borderColor: theme.primary, color: theme.text }]}
              value={title}
              onChangeText={(text) => this.setState({ title: text })}
              placeholder="Enter garlic plant title"
              placeholderTextColor={theme.text + '80'}
            />

            <CustomDropdown
              theme={theme}
              label="Variety Name"
              data={varieties.map(variety => ({
                id: variety.id,
                label: variety.variety_name,
                value: variety
              }))}
              selectedValue={selectedVariety ? selectedVariety.variety_name : ''}
              placeholder="Select variety"
              onSelect={(item) => this.handleVarietySelect(item.value)}
            />

           

            <CustomDropdown
              theme={theme}
              label="Saved Location"
              data={savedLocations.map(location => ({
                id: location.id,
                label: `${location.city}, ${location.province}`,
                value: location
              }))}
              selectedValue={selectedLocation ? `${selectedLocation.city}, ${selectedLocation.province}` : ''}
              placeholder="Select location"
              onSelect={(item) => this.handleLocationSelect(item.value)}
            />

            <Text style={[createStyles.label, { color: theme.text }]}>Date Setup</Text>
            <TouchableOpacity
              style={[createStyles.dateInput, { borderColor: theme.primary }]}
              onPress={() => this.setState({ showDateSetupPicker: true })}
            >
              <Text style={[createStyles.dateText, { color: dateSetup ? theme.text : theme.text + '80' }]}>
                {dateSetup || 'Select date'}
              </Text>
              <Text style={[createStyles.dateIcon, { color: theme.text }]}>📅</Text>
            </TouchableOpacity>

            <View style={createStyles.switchContainer}>
              <Text style={[createStyles.label, { color: theme.text, marginTop: 0 }]}>Already Planted</Text>
              <Switch
                value={alreadyPlanted}
                onValueChange={(value) => this.setState({ alreadyPlanted: value })}
                trackColor={{ false: theme.text + '40', true: theme.primary }}
                thumbColor={alreadyPlanted ? theme.background : theme.text + '60'}
              />
            </View>

            {alreadyPlanted && (
              <>
                <Text style={[createStyles.label, { color: theme.text }]}>Date Planted</Text>
                <TouchableOpacity
                  style={[createStyles.dateInput, { borderColor: theme.primary }]}
                  onPress={() => this.setState({ showDatePlantedPicker: true })}
                >
                  <Text style={[createStyles.dateText, { color: datePlanted ? theme.text : theme.text + '80' }]}>
                    {datePlanted || 'Select date'}
                  </Text>
                  <Text style={[createStyles.dateIcon, { color: theme.text }]}>📅</Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity 
              style={[createStyles.saveButton, { backgroundColor: theme.primary }]}
              onPress={this.handleSave}
            >
              <Text style={[createStyles.saveButtonText, { color: theme.background }]}>Save Garlic Plant</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        
        <Modal visible={showDateSetupPicker} transparent animationType="fade">
          <View style={createStyles.datePickerOverlay}>
            <View style={[createStyles.calendarModal, { backgroundColor: theme.background }]}>
              <Text style={[createStyles.datePickerTitle, { color: theme.text }]}>Select Setup Date</Text>
              <Calendar
                onDayPress={(day) => {
                  this.handleDateSetupSelect(new Date(day.dateString));
                }}
                theme={{
                  backgroundColor: theme.background,
                  calendarBackground: theme.background,
                  textSectionTitleColor: theme.text,
                  selectedDayBackgroundColor: theme.primary,
                  selectedDayTextColor: '#ffffff',
                  todayTextColor: theme.primary,
                  dayTextColor: theme.text,
                  textDisabledColor: theme.text + '40',
                  dotColor: theme.primary,
                  selectedDotColor: '#ffffff',
                  arrowColor: theme.primary,
                  monthTextColor: theme.text,
                  indicatorColor: theme.primary,
                  textDayFontWeight: '300',
                  textMonthFontWeight: 'bold',
                  textDayHeaderFontWeight: '300',
                  textDayFontSize: 16,
                  textMonthFontSize: 16,
                  textDayHeaderFontSize: 13
                }}
              />
              <TouchableOpacity 
                style={[createStyles.datePickerButton, { backgroundColor: theme.text + '40', marginTop: 15 }]}
                onPress={() => this.setState({ showDateSetupPicker: false })}
              >
                <Text style={[createStyles.datePickerButtonText, { color: theme.text }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        
        <Modal visible={showDatePlantedPicker} transparent animationType="fade">
          <View style={createStyles.datePickerOverlay}>
            <View style={[createStyles.calendarModal, { backgroundColor: theme.background }]}>
              <Text style={[createStyles.datePickerTitle, { color: theme.text }]}>Select Planted Date</Text>
              <Calendar
                onDayPress={(day) => {
                  this.handleDatePlantedSelect(new Date(day.dateString));
                }}
                theme={{
                  backgroundColor: theme.background,
                  calendarBackground: theme.background,
                  textSectionTitleColor: theme.text,
                  selectedDayBackgroundColor: theme.primary,
                  selectedDayTextColor: '#ffffff',
                  todayTextColor: theme.primary,
                  dayTextColor: theme.text,
                  textDisabledColor: theme.text + '40',
                  dotColor: theme.primary,
                  selectedDotColor: '#ffffff',
                  arrowColor: theme.primary,
                  monthTextColor: theme.text,
                  indicatorColor: theme.primary,
                  textDayFontWeight: '300',
                  textMonthFontWeight: 'bold',
                  textDayHeaderFontWeight: '300',
                  textDayFontSize: 16,
                  textMonthFontSize: 16,
                  textDayHeaderFontSize: 13
                }}
              />
              <TouchableOpacity 
                style={[createStyles.datePickerButton, { backgroundColor: theme.text + '40', marginTop: 15 }]}
                onPress={() => this.setState({ showDatePlantedPicker: false })}
              >
                <Text style={[createStyles.datePickerButtonText, { color: theme.text }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        


        <Modal visible={showCustomCamera} transparent animationType="fade">
          <View style={createStyles.cameraOverlay}>
            <View style={[createStyles.cameraModal, { backgroundColor: theme.background, borderColor: theme.primary }]}>
              <Text style={[createStyles.cameraTitle, { color: theme.text }]}>📷 Camera Guide</Text>
              
              <View style={createStyles.focusSquare}>
                <View style={[createStyles.corner, createStyles.topLeft, { borderColor: theme.primary }]} />
                <View style={[createStyles.corner, createStyles.topRight, { borderColor: theme.primary }]} />
                <View style={[createStyles.corner, createStyles.bottomLeft, { borderColor: theme.primary }]} />
                <View style={[createStyles.corner, createStyles.bottomRight, { borderColor: theme.primary }]} />
              </View>
              
              <Text style={[createStyles.instructionText, { color: theme.text }]}>
                🧄 Position garlic plant in the square when camera opens
              </Text>
              
              <View style={createStyles.cameraButtons}>
                <TouchableOpacity 
                  style={[createStyles.cancelButton, { backgroundColor: theme.text + '20' }]}
                  onPress={this.handleCameraClose}
                >
                  <Text style={[createStyles.cancelButtonText, { color: theme.text }]}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[createStyles.openCameraButton, { backgroundColor: theme.primary }]}
                  onPress={this.launchNativeCamera}
                >
                  <Text style={[createStyles.openCameraButtonText, { color: theme.background }]}>Open Camera</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={isLoading} transparent animationType="fade">
          <View style={createStyles.loadingOverlay}>
            <View style={[createStyles.loadingModal, { backgroundColor: theme.background }]}>
              <Text style={[createStyles.loadingText, { color: theme.text }]}>Saving...</Text>
              <Text style={[createStyles.loadingSubtext, { color: theme.text + '80' }]}>Please wait while we save your garlic plant</Text>
            </View>
          </View>
        </Modal>

      </SafeContainer>
    );
  }
}

const createStyles = StyleSheet.create({
  formContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  dateInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 16,
    flex: 1,
  },
  dateIcon: {
    fontSize: 18,
  },
  datePickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarModal: {
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxWidth: 400,
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  datePickerButton: {
    width: '100%',
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  datePickerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: {
    fontSize: 16,
    flex: 1,
  },
  dropdownIcon: {
    fontSize: 12,
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownModal: {
    width: '80%',
    borderRadius: 8,
    borderWidth: 1,
    padding: 20,
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  dropdownOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownOptionText: {
    fontSize: 16,
  },
  imageUpload: {
    height: 320,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 16,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraModal: {
    width: '85%',
    borderRadius: 12,
    borderWidth: 2,
    padding: 25,
    alignItems: 'center',
  },
  cameraTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  focusSquare: {
    width: 150,
    height: 150,
    position: 'relative',
    marginBottom: 20,
  },
  corner: {
    position: 'absolute',
    width: 25,
    height: 25,
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  instructionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  cameraButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  openCameraButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  openCameraButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingModal: {
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 200,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  loadingSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});