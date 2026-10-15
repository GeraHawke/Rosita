import { Text, View, StyleSheet } from 'react-native';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>¡Hola, soy Rosita! 🌹</Text>
      <Text style={styles.subtitulo}>Hay que acomodarle la matriz a esa imitadora cabrona</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff0f5', // Un fondo rosado claro
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#c71585',
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 16,
    color: '#444',
  },
});