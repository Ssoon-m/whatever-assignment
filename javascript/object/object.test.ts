import { MusicClass, MusicFunc, musicLiteral, musicNewObject } from "./object";

describe("create object", () => {
  test("1. 객체 리터럴 방식", () => {
    expect(musicLiteral.title).toBe("title");
    expect(musicLiteral.artist).toBe("artist");
    expect(musicLiteral.genre).toBe("genre");
  });
  test("2. 객체 생성자 방식", () => {
    expect(musicNewObject.title).toBe("title");
    expect(musicNewObject.artist).toBe("artist");
    expect(musicNewObject.genre).toBe("genre");
  });
  test("3. new 연산자 사용", () => {
    const musicClass = new MusicClass({
      title: "title",
      artist: "artist",
      genre: "genre",
    });
    expect(musicClass.title).toBe("title");
    expect(musicClass.artist).toBe("artist");
    expect(musicClass.genre).toBe("genre");

    const musicFunc = new MusicFunc({
      title: "title",
      artist: "artist",
      genre: "genre",
    });
    expect(musicFunc.title).toBe("title");
    expect(musicFunc.artist).toBe("artist");
    expect(musicFunc.genre).toBe("genre");
  });
});
