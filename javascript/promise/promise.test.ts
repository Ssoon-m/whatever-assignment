// import { cloneDeep } from "./objectcopy";
import { myPromise } from "./promise";

describe("myPromise", () => {
  describe("promise 기본 동작 테스트", () => {
    test("1. then 체이닝이 정상적으로 동작한다.", async () => {
      await new myPromise((resolve) => resolve(1))
        .then((value) => value + 1)
        .then((value) => expect(value).toBe(2));
    });
    test("2. catch 체이닝이 정상적으로 동작한다.", async () => {
      await new myPromise((reject) => reject("error occurred"))
        .catch((error) => {
          throw error;
        })
        .catch((error) => expect(error).toBe("error occurred"));
    });
    test("3. 비동기로 resolve 콜백을 실행시켜도 정상 동작을 한다.", async () => {
      await new myPromise((resolve) => setTimeout(() => resolve(1), 100))
        .then((value) => {
          return new myPromise((resolve) => resolve(value + 1));
        })
        .then((value) => {
          return new myPromise((resolve) =>
            setTimeout(() => resolve(value + 1), 100)
          );
        })
        .then((value) => expect(value).toBe(3));
    });
    test("4. 비동기로 reject 콜백을 실행시켜도 정상 동작을 한다.", async () => {
      await new myPromise((resolve, reject) =>
        setTimeout(() => reject("error occurred"), 100)
      )
        .catch((error) => {
          throw new Error(error);
        })
        .catch((error) => expect(error.message).toBe("error occurred"));
    });
  });
  describe("체이닝 형태로 then,catch,finally를 연속적으로 실행", () => {
    test("1. then 핸들러에서 에러가 발생한 경우 catch가 정상적으로 동작한다.", async () => {
      await new myPromise((resolve, reject) =>
        setTimeout(() => resolve(1), 100)
      )
        .then((value) => value + 1)
        .then((value) => {
          throw value + 1;
        })
        .catch((error) => expect(error).toBe(3));
    });
    test("2. finally가 정상적으로 동작한다.", async () => {
      let finallyBlockExecuted = false;
      await new myPromise((resolve, reject) =>
        setTimeout(() => reject(1), 1000)
      )
        .then((value) => value + 1)
        .catch((error) => {})
        .finally(() => {
          finallyBlockExecuted = true;
          expect(finallyBlockExecuted).toBe(true);
        });
    });
  });
});
