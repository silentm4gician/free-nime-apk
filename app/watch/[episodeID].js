import { useState, useEffect, useRef } from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import {
  View,
  ActivityIndicator,
  Text,
  Alert,
  Animated,
  Easing,
  Dimensions,
  StatusBar,
  Platform,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Video } from 'expo-av';
import { Screen } from '../../components/Screen';
import * as ScreenOrientation from 'expo-screen-orientation';
import { getEpisodeURL } from 'utils/requests';
import { VideoPlayer } from 'components/VideoPlayer';

const WatchEpisode = () => {
  const { episodeID } = useLocalSearchParams();
  const completeURL = `https://monoschino2.com/ver/${episodeID}`;
  const [episodeData, setEpisodeData] = useState([]);
  const [status, setStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [urlTested, setUrlTested] = useState(false);

  useEffect(() => {
    console.log(episodeID);
  }, []);

  useEffect(() => {
    if ((!urlTested && episodeData?.iframe?.clean) || episodeData?.videoUrl) {
      const sourceUrl = episodeData?.iframe?.clean || episodeData?.videoUrl;
      const fixedUrl = fixMalformedUrl(sourceUrl);

      if (fixedUrl) {
        testVideoSource(fixedUrl);
        setUrlTested(true);
      }
    }
  }, [episodeData, urlTested]);

  // Add this function at the beginning of your component
  useEffect(() => {
    if (episodeData?.iframe?.clean || episodeData?.videoUrl) {
      const sourceUrl = episodeData?.iframe?.clean || episodeData?.videoUrl;
      const fixedUrl = fixMalformedUrl(sourceUrl);

      // Test if URL is accessible
      fetch(fixedUrl, { method: 'HEAD' })
        .then((response) => {
          console.log('URL test status:', response.status, response.statusText);
          if (!response.ok) {
            console.error('URL not accessible:', fixedUrl);
          }
        })
        .catch((error) => {
          console.error('Fetch error:', error);
        });
    }
  }, [episodeData]);

  // For debugging CORS and network issues
  const testVideoSource = async (url) => {
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        // headers: {
        //   'User-Agent': 'Mozilla/5.0',
        //   Referer: 'https://monoschino2.com',
        // },
      });
      console.log('Video source test response:', response.status, response.statusText);
      return response.ok;
    } catch (error) {
      console.error('Video source test error:', error);
      return false;
    }
  };

  useEffect(() => {
    const lockOrientation = async () => {
      try {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      } catch (e) {
        console.warn('⚠️ Orientación no soportada en este dispositivo.');
      }
    };

    lockOrientation();

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  useEffect(() => {
    console.log('completeURL:', completeURL);
    getEpisodeURL(completeURL).then((data) => {
      console.log('DATOS:', data);
      setEpisodeData(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    // Fade in animation
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Progress bar animation (40s)
    Animated.timing(progressAnim, {
      toValue: 100,
      duration: 40000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const fixMalformedUrl = (url) => {
    if (!url) return null;

    // Remove any wrapping embed URLs
    const embedMatch = url.match(/embed2\/\?id=(.+)/);
    if (embedMatch) {
      url = embedMatch[1];
    }

    // Check for the specific malformed pattern with commas
    if (url.includes('/hls/,') && url.includes(',.urlset/')) {
      // Extract the ID part and restructure the URL
      const matches = url.match(/\/hls\/,(.+?),.urlset\//);
      if (matches && matches[1]) {
        const id = matches[1];
        url = url.replace(/\/hls\/,.+?,.urlset\//, `/hls/${id}/urlset/`);
      }
    }

    // Ensure the URL is a direct m3u8 link
    if (!url.endsWith('.m3u8')) {
      console.warn('Warning: URL does not end with .m3u8');
    }

    // Additional cleaning
    url = url.trim().replace(/\s/g, '');

    return url;
  };

  const renderVideoPlayer = () => {
    const sourceUrl =
      episodeData?.videoUrl?.includes('.m3u8') || episodeData?.iframe?.clean?.includes('.m3u8')
        ? episodeData?.iframe?.clean || episodeData?.videoUrl
        : episodeData?.videoUrl || episodeData?.iframe?.clean || episodeData?.urlFetch;

    console.log('🎥 Fuente del video:', sourceUrl);
    const cleanSourceUrl = sourceUrl ? fixMalformedUrl(sourceUrl.trim()) : null;

    if (!cleanSourceUrl) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'black',
          }}>
          <View className="items-center">
            <Text className="my-6 text-center text-white">No se encontro el episodio</Text>
          </View>
        </View>
      );
    }

    console.log('🎥 Fixed video source:', cleanSourceUrl);

    if (cleanSourceUrl.includes('mega.nz')) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'black',
          }}>
          <View className="items-center">
            <Text className="text-center text-white">EPISODIO ALOJADO EN MEGA</Text>
            <Text className="my-4 text-center text-white">
              Actualmente no podemos reproducir mega en nuestra app pero puedes verlo en este link:
            </Text>
            <View className="items-center">
              <TouchableOpacity
                onPress={() => Linking.openURL(cleanSourceUrl)}
                className="absolute my-3 flex-1 p-8">
                <Text className="font-bold text-[#CF9FFF]">VER EN MEGA</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    // Different implementations by platform
    if (Platform.OS === 'web') {
      // For web platform - use the VideoPlayer component with HLS.js
      return (
        <VideoPlayer
          url={cleanSourceUrl}
          onError={(error) => console.error('Error en la reproducción:', error)}
        />
      );
    } else {
      // For mobile platforms - use Expo AV Video
      return (
        <Video
          ref={videoRef}
          source={{
            uri: cleanSourceUrl,
            overrideFileExtensionAndroid: cleanSourceUrl.includes('.m3u8') ? 'm3u8' : undefined,
          }}
          style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            backgroundColor: '#000',
          }}
          useNativeControls
          resizeMode="contain"
          shouldPlay
          isLooping={false}
          // onPlaybackStatusUpdate={(newStatus) => {
          //   console.log('Playback status:', newStatus);
          //   setStatus(newStatus);
          // }}
          onLoadStart={() => {
            console.log('Video load started');
          }}
          onLoad={() => {
            console.log('Video loaded successfully');
          }}
          onError={(error) => {
            console.error('Error en la reproducción:', error);
            Alert.alert(
              'Error de Reproducción',
              `No se pudo reproducir el video. Detalles: ${JSON.stringify(error)}`,
              [{ text: 'OK' }]
            );
          }}
        />
      );
    }
  };

  return (
    <Screen>
      <StatusBar hidden />
      <Stack.Screen
        options={{
          headerLeft: () => {},
          headerRight: () => {},
          headerTitle: `Reproduciendo episodio`,
          headerTransparent: true,
          statusBarHidden: true,
        }}
      />

      {(() => {
        if (loading) {
          return (
            // Pantalla de carga mientras no hay source
            <View className="flex-1 items-center justify-center bg-black p-6">
              <View className="absolute inset-0 bg-black opacity-90" />
              <View className="absolute bottom-[-100px] h-[300px] w-[300px] rounded-full bg-[#CF9FFF]/10 opacity-50" />

              <Animated.View
                style={{ opacity: opacityAnim }}
                className="w-full max-w-[500px] items-center">
                <Text className="mb-6 text-center text-2xl font-bold text-white">
                  Preparando tu episodio
                </Text>

                <View className="relative mb-8 h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <Animated.View
                    style={{ width: progressWidth }}
                    className="h-full rounded-full bg-[#CF9FFF]"
                  />
                  <View className="absolute right-0 top-[-4px] h-4 w-4 rounded-full bg-white shadow-lg shadow-[#CF9FFF]" />
                </View>

                <Animated.View
                  style={{ transform: [{ scale: pulseAnim }] }}
                  className="mt-2 items-center">
                  <ActivityIndicator size="large" color="#CF9FFF" />
                </Animated.View>

                <Text className="mt-3 text-sm text-white/70">
                  Esto puede tardar hasta 40 segundos
                </Text>

                <View className="mt-10 w-full rounded-xl border-l-4 border-[#CF9FFF] bg-[#CF9FFF]/10 p-4">
                  <Text className="mb-2 text-base font-bold text-[#CF9FFF]">Mientras esperas:</Text>
                  <Text className="mb-1.5 text-sm text-white/80">
                    • Asegúrate de tener una buena conexión a internet
                  </Text>
                  <Text className="mb-1.5 text-sm text-white/80">
                    • El primer episodio puede tardar más en cargar
                  </Text>
                  <Text className="mb-1.5 text-sm text-white/80">
                    • Gira tu dispositivo para una mejor experiencia
                  </Text>
                </View>

                <View className="mt-6 items-center">
                  <Text className="text-sm font-medium text-[#CF9FFF]">
                    Episodio: {episodeID.split('-').pop()}
                  </Text>
                </View>
              </Animated.View>
            </View>
          );
        }

        return renderVideoPlayer();
      })()}
    </Screen>
  );
};

export default WatchEpisode;
