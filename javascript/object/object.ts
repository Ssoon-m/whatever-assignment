interface IMusic {
  title: string;
  artist: string;
  genre: string;
}

const musicLiteral: IMusic = {
  title: "title",
  artist: "artist",
  genre: "genre",
};

const musicNewObject = new Object() as IMusic;
musicNewObject.title = "title";
musicNewObject.artist = "artist";
musicNewObject.genre = "genre";

class MusicClass {
  title: string;
  artist: string;
  genre: string;
  constructor({ title, artist, genre }: IMusic) {
    this.title = title;
    this.artist = artist;
    this.genre = genre;
  }
}

function MusicFunc({ title, artist, genre }: IMusic) {
  this.title = title;
  this.artist = artist;
  this.genre = genre;
}

export { musicLiteral, musicNewObject, MusicClass, MusicFunc };
