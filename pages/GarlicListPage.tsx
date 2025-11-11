import React, { Component } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeContainer } from '../components/SafeContainer';
import { CreateGarlicPage } from './CreateGarlicPage';

interface GarlicListPageProps {
  theme: any;
  styles: any;
  onCameraStateChange?: (isActive: boolean) => void;
}

interface GarlicListPageState {
  loading: boolean;
  showCreatePage: boolean;
}

export class GarlicListPage extends Component<GarlicListPageProps, GarlicListPageState> {
  constructor(props: GarlicListPageProps) {
    super(props);
    this.state = {
      loading: false,
      showCreatePage: false
    };
  }

  private handleCreatePress = (): void => {
    this.setState({ showCreatePage: true });
  };

  private handleBackFromCreate = (): void => {
    this.setState({ showCreatePage: false });
  };

  render() {
    const { theme, styles } = this.props;
    const { showCreatePage } = this.state;

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

    return (
      <SafeContainer style={{ backgroundColor: theme.background }}>
        <ScrollView style={{ flex: 1, padding: 20 }}>
          <Text style={{ ...styles.title, color: theme.text }}>
            🧄 Garlic List
          </Text>
          <Text style={{ ...styles.description, color: theme.text }}>
            Manage your garlic varieties and crops
          </Text>
        </ScrollView>
        
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

const floatingButtonStyles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 100,
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
});