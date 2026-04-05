import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, ActivityIndicator, StyleSheet, BackHandler, View, Platform, StatusBar, Text } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const webViewRef = useRef(null);

  // Link to the laptop's exposed Vite IP address
  const LOCAL_URI = "http://10.164.41.102:5173";

  useEffect(() => {
    // Handle Android hardware back button
    const onBackPress = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true; // prevent default behavior
      }
      return false; // exit app if can't go back
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, [canGoBack]);

  const onNavigationStateChange = (navState) => {
    setCanGoBack(navState.canGoBack);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00A9F2" />
        </View>
      )}
      <WebView
        ref={webViewRef}
        source={{ uri: LOCAL_URI }}
        onLoadStart={() => { setLoading(true); setError(false); }}
        onLoadEnd={() => setLoading(false)}
        onError={() => { setLoading(false); setError(true); }}
        renderError={() => (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Unable to connect to the Vite development server.
            </Text>
            <Text style={styles.errorSubText}>
              Make sure `npm run dev` is running on your laptop at {LOCAL_URI}.
            </Text>
          </View>
        )}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        pullToRefreshEnabled={true}
        onNavigationStateChange={onNavigationStateChange}
        style={styles.webview}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    zIndex: 10, // Ensures spinner is on top of WebView rendering
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorSubText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  }
});
