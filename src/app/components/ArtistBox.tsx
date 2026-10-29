import { Artist } from "../types/artist";
import React from "react";
import { StyleSheet, Text, View , Image} from 'react-native';

export default function ArtistBox({ artist }: { artist: Artist }) {
  return (
    <View style={styles.artistBox}>
    <Image style={styles.image} source={{uri: artist.image}} testID="artist-image"/>
    <View style={styles.info}>
      <Text style={styles.name}>{artist.name}</Text>
    </View>
  </View>
  );
}

const styles = StyleSheet.create({
  artistBox: {
    margin: 5,
    backgroundColor: 'white',
    flexDirection: 'row',
    shadowColor: 'black',
    shadowOpacity: .1,
    shadowOffset: {
      height: 1,
      width: -2
    },
    elevation: 2
},
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  info: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 20,
    marginTop: 10,
    color: '#333'
  }
});