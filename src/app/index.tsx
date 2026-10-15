import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Switch, Button, Alert } from 'react-native';

export default function Home() {
  // Estado para guardar el texto del TextInput
  const [texto, setTexto] = useState("");
  
  // Estado para el Switch
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  // Función para mostrar la alerta
  const mostrarAlerta = () => {
    Alert.alert(
      texto || 'Rosita dice:',
      'Es lo que se escribió'
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>¡Hola, soy Rosita! 🌹</Text>
      <Text style={styles.subtitulo}>Hay que acomodarle la matriz a esa imitadora cabrona</Text>

      {/* 1. TextInput arriba del switch */}
      <TextInput
        style={styles.input}
        placeholder="Escribe algo aquí..."
        placeholderTextColor="#6B2D5C"
        value={texto}
        onChangeText={(value) => setTexto(value)} // 2. Actualizar el valor en useState
      />

      {/* Switch */}
      <Switch
        trackColor={{ false: '#D61F3A', true: '#4FA9C6'}}
        thumbColor={isSwitchOn ? '#E8E6E3' : '#6B2D5C'}
        onValueChange={(val) => setIsSwitchOn(val)}
        value={isSwitchOn}
        style={styles.switch}
      />

      {/* 3. Botón para lanzar el Alert */}
      <View style={styles.buttonContainer}>
        <Button
          title="LEARN MORE"
          color="#6B2D5C" // Esencia (Púrpura)
          onPress={mostrarAlerta}
        />
      </View>

      {/* Vista previa en pantalla */}
      <Text style={styles.previewText}>
        {texto ? `Texto actual: ${texto}` : 'Escribe arriba para ver la magia'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8E6E3', // Interfaz (Gris claro cómodo)
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#D61F3A', // Rojísima
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 14,
    color: '#0A0A0F', // Abismo (Negro)
    marginBottom: 25,
    textAlign: 'center',
  },
  input: {
    width: '80%',
    height: 45,
    borderColor: '#D61F3A', // Rojísima
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#E8E6E3',
    color: '#0A0A0F',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
  },
  switch: {
    marginBottom: 20,
  },
  buttonContainer: {
    width: '60%',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 15,
  },
  previewText: {
    fontSize: 14,
    color: '#6B2D5C', // Esencia
    fontStyle: 'italic',
  },
});