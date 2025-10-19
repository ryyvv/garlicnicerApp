import * as React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NetworkStatus from './NetworkStatus';

const NetworkStatusWrapper: React.FC = () => {
  const insets = useSafeAreaInsets();
  
  return React.createElement(NetworkStatus, {
    safeAreaTop: insets.top || 1300
  });
};

export default NetworkStatusWrapper;