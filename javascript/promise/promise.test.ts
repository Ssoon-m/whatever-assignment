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
    test("1-1. [비동기] then 핸들러에서 에러가 발생한 경우 catch가 정상적으로 동작한다.", async () => {
      await new myPromise((resolve, reject) =>
        setTimeout(() => resolve(1), 100)
      )
        .then((value) => value + 1)
        .then((value) => {
          throw value + 1;
        })
        .catch((error) => expect(error).toBe(3));
    });
    test("1-2. [동기] then 핸들러에서 에러가 발생한 경우 catch가 정상적으로 동작한다.", async () => {
      await new myPromise((resolve, reject) => resolve(1))
        .then((value) => value + 1)
        .then((value) => {
          throw value + 1;
        })
        .catch((error) => expect(error).toBe(3));
    });
    test("2-1. [비동기] finally가 정상적으로 동작한다.", async () => {
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
    test("2-2. [동기] finally가 정상적으로 동작한다.", async () => {
      let finallyBlockExecuted = false;
      await new myPromise((resolve, reject) => reject(1))
        .then((value) => value + 1)
        .catch((error) => {})
        .finally(() => {
          finallyBlockExecuted = true;
          expect(finallyBlockExecuted).toBe(true);
        });
    });
    test("3-1. [비동기] promise가 reject상태일 경우 catch 이전 then핸들러의 콜백 함수를 실행시키지 않는다.", async () => {
      let resolveCallbackCount = 0;
      await new myPromise((resolve, reject) =>
        setTimeout(() => reject(1), 1000)
      )
        .then(() => resolveCallbackCount++)
        .then(() => resolveCallbackCount++)
        .catch((error) => {
          throw new Error("error occurred");
        })
        .catch((error) => expect(error.message).toBe("error occurred"))
        .then((value) => {
          expect(value).toBe(undefined);
          expect(resolveCallbackCount).toBe(0);
        });
    });
    test("3-2. [동기] promise가 reject상태일 경우 catch 이전 then핸들러의 콜백 함수를 실행시키지 않는다.", async () => {
      let resolveCallbackCount = 0;
      await new myPromise((resolve, reject) => reject(1))
        .then(() => resolveCallbackCount++)
        .then(() => resolveCallbackCount++)
        .catch((error) => {
          throw new Error("error occurred");
        })
        .catch((error) => expect(error.message).toBe("error occurred"))
        .then((value) => {
          expect(value).toBe(undefined);
          expect(resolveCallbackCount).toBe(0);
        });
    });
    test("3-3. [비동기] promise가 reject상태일 경우 catch 이전 then핸들러의 콜백 함수를 실행시키지 않는다.", async () => {
      let resolveCallbackCount = 0;
      await new myPromise((resolve, reject) => setTimeout(() => reject(1), 100))
        .then((value) => {
          resolveCallbackCount++;
          return value + 1;
        })
        .then((value) => {
          resolveCallbackCount++;
          throw value + 1;
        })
        .catch((e) => e + 1)
        .then((value) => {
          expect(resolveCallbackCount).toBe(0);
          expect(value).toBe(2);
        });
    });
    test("3-4. [동기] promise가 reject상태일 경우 catch 이전 then핸들러의 콜백 함수를 실행시키지 않는다.", async () => {
      let resolveCallbackCount = 0;
      await new myPromise((resolve, reject) => reject(1))
        .then((value) => {
          resolveCallbackCount++;
          return value + 1;
        })
        .then((value) => {
          resolveCallbackCount++;
          throw value + 1;
        })
        .catch((e) => e + 1)
        .then((value) => {
          expect(resolveCallbackCount).toBe(0);
          expect(value).toBe(2);
        });
    });
    test("4-1. [비동기] finally가 정상적으로 세 번 호출이 되고, finally이전 프로미스의 이행,거부에 대한 값이 유지가 된다.", async () => {
      let finallyCallbackCount = 0;
      await new myPromise((resolve, reject) =>
        setTimeout(() => resolve(1), 1000)
      )
        .then((value) => value + 1)
        .then((value) => value + 2)
        .finally(() => finallyCallbackCount++)
        .then((value) => expect(value).toBe(4))
        .catch((error) => {
          throw new Error("error occurred");
        })
        .finally(() => finallyCallbackCount++)
        .catch((error) => expect(error.message).toBe("error occurred"))
        .finally(() => finallyCallbackCount++)
        .then((value) => {
          expect(value).toBe(undefined);
          expect(finallyCallbackCount).toBe(3);
        });
    });
    test("4-2. [동기] finally가 정상적으로 세 번 호출이 되고, finally이전 프로미스의 이행,거부에 대한 값이 유지가 된다.", async () => {
      let finallyCallbackCount = 0;
      await new myPromise((resolve, reject) => resolve(1))
        .then((value) => value + 1)
        .then((value) => value + 2)
        .finally(() => finallyCallbackCount++)
        .then((value) => expect(value).toBe(4))
        .catch((error) => {
          throw new Error("error occurred");
        })
        .finally(() => finallyCallbackCount++)
        .catch((error) => expect(error.message).toBe("error occurred"))
        .finally(() => finallyCallbackCount++)
        .then((value) => {
          expect(value).toBe(undefined);
          expect(finallyCallbackCount).toBe(3);
        });
    });
  });
});
