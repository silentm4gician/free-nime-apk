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
} from 'react-native';
import { Video } from 'expo-av';
import { Screen } from '../../components/Screen';
import * as ScreenOrientation from 'expo-screen-orientation';
import { getEpisodeURL } from 'utils/requests';

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

  useEffect(() => {
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    };

    lockOrientation();

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  useEffect(() => {
    getEpisodeURL(completeURL).then((data) => {
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

      {episodeData?.iframe?.clean ? (
        // ✅ Video player when ready
        <Video
          style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            backgroundColor: '#000',
          }}
          ref={videoRef}
          source={{ uri: episodeData.iframe.clean }}
          useNativeControls
          resizeMode="contain"
          shouldPlay
          isLooping={false}
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
          onError={(error) => {
            console.error('Error en la reproducción:', error);
            Alert.alert('Error', `Error en la reproducción: ${error}`);
          }}
        />
      ) : (
        // 🔄 Enhanced loading screen with Tailwind
        <View className="flex-1 items-center justify-center bg-black p-6">
          {/* Background overlay for depth */}
          <View className="absolute inset-0 bg-black opacity-90" />

          {/* Purple glow effect at bottom */}
          <View className="absolute bottom-[-100px] h-[300px] w-[300px] rounded-full bg-[#CF9FFF]/10 opacity-50" />

          <Animated.View
            style={{ opacity: opacityAnim }}
            className="w-full max-w-[500px] items-center">
            {/* Title */}
            <Text className="mb-6 text-center text-2xl font-bold text-white">
              Preparando tu episodio
            </Text>

            {/* Progress bar container */}
            <View className="relative mb-8 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <Animated.View
                style={{ width: progressWidth }}
                className="h-full rounded-full bg-[#CF9FFF]"
              />

              {/* Progress dot */}
              <View className="absolute right-0 top-[-4px] h-4 w-4 rounded-full bg-white shadow-lg shadow-[#CF9FFF]" />
            </View>

            {/* Loading indicator */}
            <Animated.View
              style={{ transform: [{ scale: pulseAnim }] }}
              className="mt-2 items-center">
              <ActivityIndicator size="large" color="#CF9FFF" />
            </Animated.View>

            <Text className="mt-3 text-sm text-white/70">Esto puede tardar hasta 40 segundos</Text>

            {/* Tips section */}
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

            {/* Episode info */}
            <View className="mt-6 items-center">
              <Text className="text-sm font-medium text-[#CF9FFF]">
                Episodio: {episodeID.split('-').pop()}
              </Text>
            </View>
          </Animated.View>
        </View>
      )}
    </Screen>
  );
};

export default WatchEpisode;
