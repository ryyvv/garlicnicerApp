import * as React from 'react';
import { Text, View, StyleSheet, ViewStyle, TextStyle, Animated, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NetInfo from '@react-native-community/netinfo';

interface NetworkStatusState {
  isConnected: boolean | null;
  showStatus: boolean;
}

interface NetworkStatusStyles {
  container: ViewStyle;
  onlineText: TextStyle;
  offlineText: TextStyle;
}

interface NetworkStatusProps {
  safeAreaTop?: number;
}

class NetworkStatus extends React.Component<NetworkStatusProps, NetworkStatusState> {
  private readonly styles: NetworkStatusStyles;
  private fadeAnim: Animated.Value;
  private hideTimeout: NodeJS.Timeout | null = null;
  private unsubscribe: (() => void) | null = null;

  constructor(props: NetworkStatusProps) {
    super(props);
    this.state = {
      isConnected: null,
      showStatus: false,
    };

    this.fadeAnim = new Animated.Value(0);

    this.styles = StyleSheet.create({
      container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignItems: 'center',
      } as ViewStyle,
      onlineText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
      } as TextStyle,
      offlineText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
      } as TextStyle,
    });
  }

  public componentDidMount(): void {
    this.unsubscribe = NetInfo.addEventListener(state => {
      const wasConnected = this.state.isConnected;
      const isConnected = state.isConnected;

      if (wasConnected !== null && wasConnected !== isConnected) {
        this.setState({ isConnected, showStatus: true });
        this.showStatusMessage();
      } else {
        this.setState({ isConnected });
      }
    });
  }

  public componentWillUnmount(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
  }

  private showStatusMessage = (): void => {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }

    Animated.timing(this.fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    this.hideTimeout = setTimeout(() => {
      Animated.timing(this.fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        this.setState({ showStatus: false });
      });
    }, 5000);
  };

  public render(): React.ReactElement | null {
    const { isConnected, showStatus } = this.state;

    if (!showStatus || isConnected === null) {
      return null;
    }

    const topMargin = this.props.safeAreaTop || 20;
    
    return React.createElement(
      Animated.View,
      {
        style: {
          ...this.styles.container,
          backgroundColor: isConnected ? '#4CAF50' : '#F44336',
          opacity: this.fadeAnim,
          paddingTop: topMargin + 8,
        },
      },
      React.createElement(
        Text,
        { style: isConnected ? this.styles.onlineText : this.styles.offlineText },
        isConnected ? 'Back Online' : 'No Internet Connection'
      )
    );
  }
}

export default NetworkStatus;