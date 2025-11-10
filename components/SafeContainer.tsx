import * as React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SafeContainerProps {
  children: React.ReactNode;
  style?: any;
}

export class SafeContainer extends React.Component<SafeContainerProps> {
  render() {
    const { children, style } = this.props;
    
    return React.createElement(
      SafeAreaView,
      { style: { flex: 1, ...style }, edges: ['top', 'left', 'right'] },
      children
    );
  }
}