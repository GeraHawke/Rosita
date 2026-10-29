import React, { useEffect, useState } from "react";
import { View,StyleSheet } from "react-native";
import {getMusicData} from './api-client'
import ArtistList from './components/ArtistList';
import { Artist } from "./types/artist";

export default function Home() {
  const [artists, setArtists] = useState<Artist[]>([]);

  useEffect(() => {
    getMusicData().then(data => setArtists(data))
  }, []);

  return (
    <View style={styles.container}>
      {artists && <ArtistList artists={artists} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});