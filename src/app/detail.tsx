import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function Detail() {
  const params = useLocalSearchParams<{
    id: string;
    name: string;
    image: string;
  }>();

  // useLocalSearchParams a veces devuelve string | string[]
  const name = Array.isArray(params.name) ? params.name[0] : params.name ?? 'Sin nombre';
  const image = Array.isArray(params.image) ? params.image[0] : params.image ?? '';
  const id = Array.isArray(params.id) ? params.id[0] : params.id ?? '';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        {image ? (
          <Image
            source={{ uri: image }}
            style={styles.image}
            resizeMode="cover"
            testID="detail-image"
          />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <Text style={styles.placeholderText}>Sin imagen</Text>
          </View>
        )}

        <Text style={styles.name} testID="detail-name">
          {name}
        </Text>

        {id ? (
          <Text style={styles.id} testID="detail-id">
            ID: {id}
          </Text>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#E8E6E3',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  image: {
    width: 220,
    height: 220,
    borderRadius: 12,
    backgroundColor: '#ddd',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#888',
    fontSize: 14,
  },
  name: {
    marginTop: 20,
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0A0A0F',
    textAlign: 'center',
  },
  id: {
    marginTop: 8,
    fontSize: 12,
    color: '#888',
  },
});