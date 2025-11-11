import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

const { width, height } = Dimensions.get('window');

interface GarlicCameraProps {
  theme: any;
  onCapture: (imageUri: string) => void;
  onClose: () => void;
}

export function GarlicCamera({ theme, onCapture, onClose }: GarlicCameraProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const takePicture = async (): Promise<void> => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
        });
        onCapture(photo.uri);
      } catch (error) {
        console.error('Failed to take picture:', error);
      }
    }
  };

  if (!permission) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.loadingText, { color: theme.text }]}>Loading...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <View style={[styles.permissionModal, { backgroundColor: theme.background, borderColor: theme.primary }]}>
          <Text style={[styles.permissionTitle, { color: theme.text }]}>📷 Camera Permission</Text>
          <Text style={[styles.permissionMessage, { color: theme.text }]}>
            We need camera access to take photos of your garlic plants
          </Text>
          <View style={styles.permissionButtons}>
            <TouchableOpacity 
              style={[styles.cancelButton, { backgroundColor: theme.text + '20' }]}
              onPress={onClose}
            >
              <Text style={[styles.cancelButtonText, { color: theme.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.allowButton, { backgroundColor: theme.primary }]}
              onPress={requestPermission}
            >
              <Text style={[styles.allowButtonText, { color: theme.background }]}>Allow Camera</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
      >
        {/* Live Camera Overlay */}
        <View style={styles.overlay}>
          <View style={styles.instructionsTop}>
            <Text style={styles.instructionTitle}>📷 Garlic Plant Photo</Text>
            <Text style={styles.instructionSubtitle}>Position your garlic plant in the square</Text>
          </View>
          
          <View style={styles.focusSquare}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
            {/* <Text style={styles.centerText}>🧄</Text> */}
          </View>
          
          <View style={styles.instructionsBottom}>
            <Text style={styles.tipText}>💡 Tips:</Text>
            <Text style={styles.tipItem}>• Fill the square with your garlic plant</Text>
            <Text style={styles.tipItem}>• Ensure good lighting</Text>
            <Text style={styles.tipItem}>• Keep the camera steady</Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.captureButton, { borderColor: theme.primary }]}
            onPress={takePicture}
          >
            <View style={[styles.captureInner, { backgroundColor: theme.primary }]} />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusSquare: {
    width: 320,
    height: 320,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderColor: '#fff',
    borderWidth: 4,
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
    color: '#fff',
    fontSize: 16,
    marginTop: 30,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  controls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  closeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },

  instructionsTop: {
    position: 'absolute',
    top: 80,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  instructionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  instructionSubtitle: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  centerText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -15 }, { translateY: -15 }],
    fontSize: 30,
  },
  instructionsBottom: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  tipText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  tipItem: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionModal: {
    width: '85%',
    borderRadius: 12,
    borderWidth: 2,
    padding: 25,
    alignItems: 'center',
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  permissionMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  permissionButtons: {
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
  allowButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  allowButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },

});