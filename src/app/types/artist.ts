export interface Artist {
  id: number
  name: string
  image: string
}

export interface ArtistResource {
  id: number
  name: string
  mbid: string
  image: [
    ImageUrl
  ]
}

interface ImageUrl {
  '#text': string
}