import * as React from 'react';
import { SafeAreaView, View, Text } from 'react-native';

interface GarlicListPageProps {
  theme: any;
  styles: any;
}

export class GarlicListPage extends React.Component<GarlicListPageProps> {
  render(): React.ReactElement {
    const { theme, styles } = this.props;

    return React.createElement(
      SafeAreaView,
      { style: { flex: 1, backgroundColor: theme.background } },
      React.createElement(
        View,
        { style: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 } },
        React.createElement(
          Text,
          { style: { ...styles.title, color: theme.text } },
          '🧄 Garlic List'
        ),
        React.createElement(
          Text,
          { style: { ...styles.description, color: theme.text } },
          'Manage your garlic varieties and crops'
        )
      )
    );
  }
}