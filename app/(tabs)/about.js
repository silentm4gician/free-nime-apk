import { Screen } from 'components/Screen';
import { ScrollView, Text, View, Linking, TouchableOpacity } from 'react-native';
import { GitHubIcon } from 'components/Icons';

export default function About() {
  const handleOpenGitHub = () => {
    Linking.openURL('https://github.com/silentM4gician'); // Cambiá por tu repo si querés
  };

  return (
    <Screen>
      <ScrollView className="p-4">
        <View className="mb-6">
          <Text className="text-center text-3xl font-bold text-[#CF9FFF]">Sobre la app</Text>
        </View>

        <Text className="mb-4 text-base leading-relaxed text-white">
          Esta aplicación fue creada con el objetivo de ofrecer una forma rápida, cómoda y
          visualmente atractiva de explorar contenido de anime. Utiliza datos extraídos directamente
          desde <Text className="font-bold text-[#CF9FFF]">MonosChino2</Text> mediante scraping
          personalizado. (a veces demora en cargar el episodio por que le quita los anuncios)
        </Text>

        <Text className="mb-4 text-base leading-relaxed text-white">
          Fue desarrollada con <Text className="font-semibold text-[#CF9FFF]">React Native</Text> y{' '}
          <Text className="font-semibold text-[#CF9FFF]">NativeWind</Text>, con foco en una
          experiencia fluida y moderna en dispositivos móviles.
        </Text>

        <View className="mb-4 ml-4">
          <Text className="text-white">• UI con Tailwind adaptado a móvil</Text>
          <Text className="text-white">• Scraper personalizado con Playwright y Cheerio</Text>
          <Text className="text-white">• API propia para consulta de episodios y detalles</Text>
          <Text className="text-white">• Despliegue modular para performance</Text>
        </View>

        <Text className="mb-6 text-base leading-relaxed text-white">
          Esta es la primera version, La app está en constante evolución. Si tenés ideas, feedback o
          querés colaborar, ¡bienvenido seas!
        </Text>

        <Text className="mb-4 text-center text-sm text-white/60">silentM4gician</Text>

        <TouchableOpacity
          onPress={handleOpenGitHub}
          className="mx-auto mt-4 flex-row items-center gap-2 rounded-full bg-[#CF9FFF] px-6 py-2">
          <GitHubIcon />
          <Text className="font-bold text-black">GitHub</Text>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
}
