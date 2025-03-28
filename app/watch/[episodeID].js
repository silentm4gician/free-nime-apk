import { useState, useEffect, useRef } from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import {
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { Video } from 'expo-av';
import { Screen } from '../../components/Screen';
import * as ScreenOrientation from 'expo-screen-orientation';
import { getLinks } from 'utils/requests';

const WatchEpisode = () => {
  const episodeID = useLocalSearchParams();
  const ID = `${episodeID.episodeID}?ep=${episodeID.ep}`;
  const [episodeData, setEpisodeData] = useState([]);
  const [selectedSubtitle, setSelectedSubtitle] = useState(null);
  const [showSubtitleMenu, setShowSubtitleMenu] = useState(false);
  const [status, setStatus] = useState({});
  const [subtitleContent, setSubtitleContent] = useState(null);
  const [currentSubtitleText, setCurrentSubtitleText] = useState('');
  const videoRef = useRef(null);
  const [authHeaders, setAuthHeaders] = useState({});
  const [videoUrl, setVideoUrl] = useState(null);

  //orientation
  useEffect(() => {
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    };

    lockOrientation();

    return () => {
      // Restaurar la orientación automática cuando el usuario salga de esta pantalla
      ScreenOrientation.unlockAsync();
    };
  }, []);

  //links
  useEffect(() => {
    const fetchEpisodeData = async () => {
      try {
        const data = await getLinks(ID);
        setEpisodeData(data.data);

      } catch (error) {
        console.error('Error fetching episode data:', error);
        Alert.alert('Error', 'Failed to fetch episode data. Please try again later.');
      }
    };

    fetchEpisodeData();
  }, [ID]);

  // Inicializar con el subtítulo por defecto

  useEffect(() => {
    if (episodeData && episodeData.tracks) {
      const defaultSubtitle = episodeData.tracks.find(
        (track) => track.kind === 'captions' && track.default === true
      );
      if (defaultSubtitle) {
        console.log('Subtítulo por defecto encontrado:', defaultSubtitle.label);
        setSelectedSubtitle(defaultSubtitle);
      } else if (episodeData.tracks.length > 0) {
        console.log('Usando el primer subtítulo disponible');
        setSelectedSubtitle(episodeData.tracks[0]);
      }
    }
  }, [episodeData]);

  // Cargar contenido de subtítulos cuando cambia la selección
  useEffect(() => {
    const loadSubtitleContent = async () => {
      if (!selectedSubtitle) {
        setSubtitleContent(null);
        setCurrentSubtitleText('');
        return;
      }

      try {
        console.log('Cargando subtítulos desde:', selectedSubtitle.file);
        const response = await fetch(selectedSubtitle.file);

        if (!response.ok) {
          throw new Error(`Error al cargar subtítulos: ${response.status}`);
        }

        const text = await response.text();
        console.log('Subtítulos cargados correctamente');
        console.log('Muestra de subtítulos:', text.slice(0, 200) + '...');

        // Procesar subtítulos VTT/SRT
        const parsedSubtitles = parseSubtitles(text);
        setSubtitleContent(parsedSubtitles);
      } catch (error) {
        console.error('Error al cargar subtítulos:', error);
        setSubtitleContent(null);
      }
    };

    loadSubtitleContent();
  }, [selectedSubtitle]);

  // Actualizar subtítulo actual basado en tiempo de reproducción
  useEffect(() => {
    if (!subtitleContent || !status.isLoaded || !status.positionMillis) {
      return;
    }

    const currentTime = status.positionMillis / 1000; // convertir a segundos
    const currentSubtitle = subtitleContent.find(
      (sub) => currentTime >= sub.start && currentTime <= sub.end
    );

    if (currentSubtitle) {
      setCurrentSubtitleText(currentSubtitle.text);
    } else {
      setCurrentSubtitleText('');
    }
  }, [subtitleContent, status.positionMillis]);

  // Función para analizar subtítulos VTT o SRT
  const parseSubtitles = (content) => {
    const isVTT = content.trim().startsWith('WEBVTT');
    const lines = content.trim().split('\n');
    const subtitles = [];

    let i = isVTT ? 1 : 0; // Saltamos la cabecera "WEBVTT" si está presente

    const parseTime = (timeStr) => {
      // Regex mejorado para manejar formatos con o sin horas
      const match = timeStr.match(/(?:(\d{1,2}):)?(\d{2}):(\d{2}).(\d{3})/);
      if (!match) return null;

      const [, hours, minutes, seconds, milliseconds] = match.map((n) => Number(n) || 0);
      return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
    };

    while (i < lines.length) {
      if (!lines[i].trim()) {
        i++;
        continue;
      }

      if (/^\d+$/.test(lines[i].trim())) {
        i++; // Saltamos número de ID si está presente
      }

      const timeLine = lines[i].trim();
      if (!timeLine.includes(' --> ')) {
        console.warn(`Línea inesperada (saltada): "${timeLine}"`);
        i++;
        continue;
      }

      const timeParts = timeLine.split(' --> ');
      if (timeParts.length !== 2) {
        console.error(`Error al dividir la línea de tiempo: "${timeLine}"`);
        i++;
        continue;
      }

      const startTime = parseTime(timeParts[0]);
      const endTime = parseTime(timeParts[1]);

      if (startTime === null || endTime === null) {
        console.error(`Error al procesar tiempos en la línea: "${timeLine}"`);
        i++;
        continue;
      }

      i++; // Avanzamos a la línea de texto

      let subtitleText = '';
      while (i < lines.length && lines[i].trim() !== '') {
        if (subtitleText) subtitleText += '\n';
        subtitleText += lines[i].trim();
        i++;
      }

      if (subtitleText) {
        subtitles.push({ start: startTime, end: endTime, text: subtitleText });
      }
    }

    console.log(`✅ Subtítulos parseados: ${subtitles.length} entradas`);
    return subtitles;
  };

  const handleSubtitleChange = (subtitle) => {
    console.log('Cambiando subtítulos a:', subtitle ? subtitle.label : 'desactivados');
    setSelectedSubtitle(subtitle);
    setShowSubtitleMenu(false);
  };

  // const handleSkipIntro = async () => {
  //   if (videoRef.current && episodeData.intro) {
  //     try {
  //       await videoRef.current.setPositionAsync(episodeData.intro.end * 1000);
  //       console.log('Saltando a:', episodeData.intro.end);
  //     } catch (error) {
  //       console.error('Error al saltar intro:', error);
  //     }
  //   }
  // };

  const renderSubtitleMenu = () => {
    if (!episodeData) return null;

    const subtitles = episodeData.tracks.filter((track) => track.kind === 'captions');

    return (
      <View className="absolute right-5 top-2 z-50 w-52 rounded bg-black/80 p-2.5">
        <Text className="mb-2.5 text-center text-base font-bold text-white">Subtítulos</Text>
        <TouchableOpacity onPress={() => handleSubtitleChange(null)}>
          <Text
            className={`my-0.5 rounded p-2 text-white ${
              selectedSubtitle === null ? 'bg-white/20 font-bold' : ''
            }`}>
            Desactivados
          </Text>
        </TouchableOpacity>
        <FlatList
          data={subtitles}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSubtitleChange(item)}>
              <Text
                className={`my-0.5 rounded p-2 text-white ${
                  selectedSubtitle && selectedSubtitle.file === item.file
                    ? 'bg-white/20 font-bold'
                    : ''
                }`}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          style={{ maxHeight: 200 }} // Limita la altura para permitir el scroll
          contentContainerStyle={{ paddingBottom: 10 }} // Espacio extra al final
          showsVerticalScrollIndicator={false} // Oculta la barra de scroll
        />
      </View>
    );
  };

  return (
    <Screen>
      <Stack.Screen
        options={{
          headerLeft: () => {},
          headerRight: () => (
            <TouchableOpacity onPress={() => setShowSubtitleMenu(!showSubtitleMenu)}>
              <Text className="mr-2.5 text-base text-white">CC</Text>
            </TouchableOpacity>
          ),
          headerTitle: `watching episode`,
          headerTransparent: true,
          statusBarHidden: true,
        }}
      />
      <View className="flex-1 bg-black">
        {episodeData && episodeData?.sources && episodeData?.sources[0] ? (
          <View className="relative flex-1">
            <Video
              style={{ flex: 1 }}
              ref={videoRef}
              source={{
                uri: episodeData?.sources[0].url,
              }}
              className="h-full w-full flex-1"
              useNativeControls={true}
              resizeMode="contain"
              shouldPlay
              isLooping={false}
              onPlaybackStatusUpdate={(status) => setStatus(() => status)}
              onError={(error) => {
                console.error('Error en la reproducción:', error);
                Alert.alert('Error', `Error en la reproducción: ${error}`);
              }}
            />
            {selectedSubtitle && currentSubtitleText && (
              <View className="absolute bottom-16 left-0 right-0 z-30 flex items-center px-4">
                <View className="max-w-lg rounded-lg bg-black/70 px-4 py-2">
                  <Text className="text-center text-lg font-medium text-white">
                    {currentSubtitleText}
                  </Text>
                </View>
              </View>
            )}
            {selectedSubtitle && (
              <View className="absolute left-5 top-5 z-20 rounded bg-purple-700/70 px-2 py-1">
                <Text className="text-xs font-bold text-white">
                  Subtítulos: {selectedSubtitle?.label}
                </Text>
              </View>
            )}
            {showSubtitleMenu && renderSubtitleMenu()}
          </View>
        ) : (
          <ActivityIndicator size="large" color="purple" />
        )}
      </View>
    </Screen>
  );
};

export default WatchEpisode;
