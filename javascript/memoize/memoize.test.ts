import { memoize } from "./memoize";

describe("memoize", () => {
  test("1. 동일한 인자로 함수를 실행시킬 경우 이전 결과 값을 정상적으로 캐싱한다.", () => {
    const add = (a: number, b: number): number => {
      return a + b;
    };
    const addMock = jest.fn(add);

    const memoizedAdd = memoize(addMock);
    // 첫 번째 호출
    const result1 = memoizedAdd(1, 2);
    expect(result1).toBe(3);
    // expect(addMock).toHaveBeenCalledWith(1, 2); // Adding이 호출되어야 함

    // 두 번째 호출 (캐시된 결과를 사용하므로 add함수가 호출되지 않음)
    const result2 = memoizedAdd(1, 2);
    expect(result2).toBe(3);
    expect(addMock).toHaveBeenCalledTimes(1);
      // expect(addMock).not.toHaveBeenCalledWith(1, 2); 이렇게 테스트 하면 에러가 나옴

    // 다른 인자로 호출 (캐시된 결과가 없으므로 다시 add 함수 호출)
    const result3 = memoizedAdd(3, 4);
    expect(result3).toBe(7);
    // expect(addMock).toHaveBeenCalledWith(3, 4);
    expect(addMock).toHaveBeenCalledTimes(2);
  });
  test("2. memoize 함수의 인자는 무조건 순수 함수여야 한다.", () => {
    let externalState = 0;
    const add = (a: number, b: number): number => {
      return a + b + externalState;
    };

    const memoizedAdd = memoize(add);

    externalState = 1;
    const result1 = memoizedAdd(1, 2);
    expect(result1).toBe(4);

    // add함수 실행의 결과가 5가 나와야 하는데 캐시된 결과를 사용한다.
    externalState = 2;
    const result2 = memoizedAdd(1, 2);
    expect(result2).not.toBe(5);
  });
});
