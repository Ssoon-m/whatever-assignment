import { cloneDeep } from "./objectcopy";

describe("cloneDeep", () => {
  test("1. 객체의 깊은 복사가 정상적으로 동작한다.", () => {
    const obj = {
      a: 1,
      b: {
        c: 2,
      },
    };

    const cloneObj = cloneDeep(obj);
    cloneObj.b.c = 3;

    expect(obj).not.toEqual(cloneObj);
    expect(obj.b.c).not.toBe(cloneObj.b.c);
  });

  test("2. 객체에 null값이 존재해도 에러가 나지 않는다.", () => {
    const obj = {
      a: 1,
      b: {
        c: null,
      },
    };

    const cloneObj = cloneDeep(obj);
    expect(obj).toEqual(cloneObj);
  });

  test("3. 배열의 깊은 복사가 정상적으로 동작한다.", () => {
    const obj = [1, 2, 3, [4, 5, { 6: 7 }]];

    const cloneObj = cloneDeep(obj);
    cloneObj[3][2][6] = 8;

    expect(obj).not.toEqual(cloneObj);
    expect(obj[3][2][6]).not.toBe(cloneObj[3][2][6]);
  });

  test("4. 기본형 데이터를 넣었을 경우 그 값을 그대로 반환한다.", () => {
    const value = 1;

    const cloneValue = cloneDeep(value);

    expect(value).toBe(cloneValue);
  });
});
