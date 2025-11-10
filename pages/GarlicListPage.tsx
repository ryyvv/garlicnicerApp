import React, { Component } from 'react';
import { SafeAreaView, ScrollView, View, Text } from 'react-native';

interface GarlicListPageProps {
  theme: any;
  styles: any;
}

export class GarlicListPage extends Component<GarlicListPageProps> {
  render() {
    const { theme, styles } = this.props;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <ScrollView style={{ flex: 1, padding: 20 }}>
          <Text style={{ ...styles.title, color: theme.text }}>
            🧄 Garlic List
          </Text>
          <Text style={{ ...styles.description, color: theme.text }}>
            Manage your garlic varieties and crops
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }
}