## 과제

Promise 객체를 라이브러리 없이 구현해보세요.

- pending, fulfilled, reject 상태를 내부에서 관리
- then, catch, resolve, reject, finally 메서드 구현
- promise chaning 구현

## 목적

Promise 시그니처를 학습하고 내부 동작 파악
class 문법, scope, closure, this, 비동기 개념 학습

---

## 구현 방법

## Promise에 대하여

`Promise`는 미래의 어떤 시점에 결과를 제공하겠다는 '약속'(프로미스)를 반환합니다.
`Promise`는 다음 중 하나의 상태를 가지게 됩니다.

- 대기(pending): 이행하지도, 거부하지도 않은 초기 상태.
- 이행(fulfilled): 연산이 성공적으로 완료됨.
- 거부(rejected): 연산이 실패함.

promise의 then이나 catch 메서드의 반환 값은 항상 프로미스이므로 서로 연결할 수 있습니다.

![promise-image](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise/promises.png)

> 그림 출처 : <https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise>

## Promise의 대표적인 메서드

### 생성자

- new Promise() : 새로운 Promise 객체를 생성합니다. 주로 프로미스를 지원하지 않는 함수를 감쌀 때 사용합니다.

### 정적 메서드

- Promise.all(iterable) : 주어진 모든 프로미스가 이행하거나, 한 프로미스가 거부될 때까지 대기하는 새로운 프로미스를 반환합니다.
- Promise.allSettled(iterable) : 주어진 모든 프로미스가 처리(이행 또는 거부)될 때까지 대기하는 새로운 프로미스를 반환합니다.
- Promise.reject(reason) : 주어진 사유로 거부하는 Promise 객체를 반환합니다.
- Promise.resolve() : 주어진 값으로 이행하는 Promise 객체를 반환합니다.

### 인스턴스 메서드

- catch() : 프로미스에 거부 처리기 콜백을 추가하고, 콜백이 호출될 경우 그 반환값으로 이행하며 호출되지 않을 경우, 즉 이전 프로미스가 이행하는 경우 이행한 값을 그대로 사용해 이행하는 새로운 프로미스를 반환합니다.
- then() : 프로미스에 이행과 거부 처리기 콜백을 추가하고, 콜백이 호출될 경우 그 반환값으로 이행하며 호출되지 않을 경우(onFulfilled, onRejected 중 상태에 맞는 콜백이 함수가 아닐 경우) 처리된 값과 상태 그대로 처리되는 새로운 프로미스를 반환합니다
- finally() : 프로미스의 이행과 거부 여부에 상관없이 처리될 경우 항상 호출되는 처리기 콜백을 추가하고, 이행한 값 그대로 이행하는 새로운 프로미스를 반환합니다.

## Promise 코드 예시

보통 프로미스를 사용할 때 다음과 같이 코드를 작성합니다.

```javascript
//1.
new Promise((resolve, reject) => {
  setTimeout(() => resolve(1), 1000); // (*)
}).then(console.log); // 1;
//2.
new Promise((resolve, reject) => {
  setTimeout(() => resolve(1), 1000); // (*)
})
  .then((result) => result + 1)
  .then((result) => result + 2)
  .then(console.log); // 4;
//3.
new Promise((resolve, reject) => {
  setTimeout(() => reject("error occurred"), 1000); // (*)
})
  .then(console.log)
  .catch(console.error); // error occurred;
```

약속(프로미스)을 반환하기 위해 `new Promise`를 통해 약속 시점을 정하고 이행과 거부 상태일 경우에 대한 처리를 해줍니다.

- 이행(fulfilled)상태 : 할 일을 then 핸들러로 받아서 처리를 합니다.
- 거부(rejected)상태 : catch 핸들러를 통해 처리를 합니다.

2번 코드를 살펴보면 체이닝 형태로 사용을 하기도 하는걸 확인할 수 있습니다.
then과 catch 그리고 예시코드에서는 작성하지 않은 finally의 경우엔 프로미스 객체를 반환하기 때문에 가능한 코드 입니다.

## Promise 직접 구현하기

> 위에서 설명한 Promise의 메서드들을 전부 구현하고 예시 코드가 모두 정상적으로 동작하게끔 구현을 할 것입니다.

### 기본 구조 잡기

프로미스에는 세가지 상태(대기,이행,거부)가 있다고 했습니다.
이를 위한 enum을 하나 만들어주도록 하겠습니다.

```typescript
enum STATUS {
  PENDING,
  FULFILLED,
  REJECTED,
}
```

myPromise라는 클래스에 구현할 메서드들 일부를 정의해서 간단하게 구조를 잡아보겠습니다.

```typescript
class myPromise {
  private status: STATUS;
  private value: any;
  constructor(
    executor: (
      resolve: (value: any) => void,
      reject: (reason?: any) => void
    ) => void
  ) {
    this.status = STATUS.PENDING;
    executor(this.resolve.bind(this), this.reject.bind(this));
  }
  private reject(reason?: any) {
    this.status = STATUS.REJECTED;
  }
  private resolve(value: any) {
    this.status = STATUS.FULFILLED;
    this.value = value;
  }
  public then(onfulfilled?: (value: any) => any) {
    if (onfulfilled) {
      return new myPromise((resolve) => resolve(onfulfilled(this.value)));
    }
    return this;
  }
}

new myPromise((resolve, reject) => {
  resolve(1);
})
  .then((value) => value + 1)
  .then((value) => value * 2)
  .then()
  .then(console.log); // 4
```

- myPromise인스턴스 생성시(프로미스를 처음 생성시) 프로미스의 상태는 pending입니다.
- 프로미스 이행시 상태를 fulfilled로 바꿔줍니다.
- 프로미스 이행시 할 일을 then핸들러로 처리를 해줍니다.
- then핸들러 실행시 콜백 함수를 넘겨줬을 경우 새로운 프로미스를 반환하고 콜 함수를 넘기지 않았을 경우 이전에 처리된 값과 상태 그대로 처리되는 새로운 프로미스를 반환합니다.

### catch 메서드 및 조건 추가

then메서드에 현재 상태를 판단하는 조건문을 추가해줍니다.
catch 메서드는 try catch를 이용하여 구현을 해줍니다.

```typescript
 then(onfulfilled?: (value: any) => any) {
    if (onfulfilled && this.status === STATUS.FULFILLED) {
      return new myPromise((resolve) => resolve(onfulfilled(this.value)));
    }
    return this;
  }
  catch(onrejected?: (reason: any) => any) {
    if (onrejected && this.status === STATUS.REJECTED) {
      try {
        const value = onrejected(this.error);
        return new myPromise((resolve) => resolve(value));
      } catch (e) {
        return new myPromise((_, reject) => reject(e));
      }
    }
    return this;
```

- catch의 경우에도 콜백이 호출될 경우 그 반환값으로 이행하며 호출되지 않을 경우, 즉 이전 프로미스가 이행하는 경우 이행한 값을 그대로 사용해 이행하는 새로운 프로미스를 반환합니다.

Promise와 비슷하게 catch 체이닝도 동작하는걸 확인할 수 있습니다.

```typescript
new myPromise((res, rej) => rej(1))
  .then((res) => res + 1)
  .catch((error) => {
    console.log("****Error**** :  ", error); // ****Error**** : 1
    throw new Error("2");
  })
  .catch((error) => {
    console.log("****Error**** : ", error.message); // ****Error**** : 2
    return "success";
  })
  .then((result) => {
    console.log("after catch:", result); // after catch: success
  });
```

얼추 동작 과정은 기존 프로미스와 비슷한 거 같습니다.
그런데, 문제점이 아직 남아있습니다.
만약 비동기 코드를 통해 `resolve`를 실행시키면 기대와 다른 동작을 하는걸 확인할 수 있습니다.

```typescript
new myPromise((resolve, reject) => {
  setTimeout(() => resolve(1), 1000);
}).then(console.log); // then 핸들러가 불리지 않음
```

이유는 status를 바꾸기 이전에 then핸들러가 실행이 되어버리기 때문입니다.
어떻게 해야 status가 대기(pending)상태일땐 then 핸들러를 실행하지 않고, 이행(fulfilled)상태로 변경이 되었을때 실행을 시킬수가 있을까요?
