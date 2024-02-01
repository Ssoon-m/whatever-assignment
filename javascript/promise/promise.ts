enum STATUS {
  PENDING,
  FULFILLED,
  REJECTED,
}

export class myPromise {
  private status: STATUS;
  private value: any;
  private error: any;
  private callbacks: any[];

  constructor(
    executor: (
      resolve: (value: any) => void,
      reject: (reason?: any) => void
    ) => void
  ) {
    this.status = STATUS.PENDING;
    this.callbacks = [];
    executor(this.resolve.bind(this), this.reject.bind(this));
  }
  private reject(reason?: any) {
    this.status = STATUS.REJECTED;
    this.error = reason;
    this.excuteCallback();
  }
  private resolve(value?: any) {
    this.status = STATUS.FULFILLED;
    if (value instanceof myPromise) {
      return value.then(this.resolve.bind(this));
    }
    this.value = value;
    this.excuteCallback();
  }
  private excuteCallback() {
    for (const [_status, callback] of this.callbacks) {
      if (_status === STATUS.FULFILLED) {
        callback(this.value);
      } else if (_status === STATUS.REJECTED) {
        callback(this.error);
      } else {
        callback();
      }
    }
  }
  public then(onfulfilled?: (value: any) => any) {
    if (!onfulfilled || this.status === STATUS.REJECTED) return this;

    if (this.status === STATUS.PENDING) {
      return new myPromise((resolve, reject) => {
        this.callbacks.push([
          STATUS.FULFILLED,
          (value: any) => {
            if (this.status === STATUS.FULFILLED) {
              try {
                const result = onfulfilled(value);
                resolve(result);
              } catch (error) {
                reject(error);
              }
            } else {
              reject(this.error);
            }
          },
        ]);
      });
    }
    if (this.status === STATUS.FULFILLED) {
      return new myPromise((resolve) => resolve(onfulfilled(this.value)));
    }
  }
  public catch(onrejected?: (reason: any) => any) {
    if (!onrejected) return this;
    if (this.status === STATUS.PENDING) {
      return new myPromise((resolve, reject) => {
        this.callbacks.push([
          STATUS.REJECTED,
          (error: any) => {
            try {
              if (this.status !== STATUS.FULFILLED) {
                onrejected(error);
              }
              resolve(this.value);
            } catch (e) {
              reject(e);
            }
          },
        ]);
      });
    }
    if (this.status === STATUS.FULFILLED) {
      return this;
    }
  }
  finally(onfinally?: () => void) {
    if (!onfinally) return this;
    if (this.status === STATUS.PENDING) {
      return new myPromise((resolve, reject) => {
        this.callbacks.push([
          undefined,
          () => {
            onfinally();
            if (this.status === STATUS.REJECTED) {
              reject(this.error);
            } else if (this.status === STATUS.FULFILLED) {
              resolve(this.value);
            }
          },
        ]);
      });
    }
  }
}

// new myPromise((res, rej) => setTimeout(() => res(1), 1000))
//   .then((result) => result + 1)
//   .then((result) => result + 1)
//   .catch((error) => console.log(error))
//   .then(console.log);

// new myPromise((res, rej) => setTimeout(() => res(1), 1000))
//   .then((result) => result + 1)
//   .then((result) => {
//     throw result + 1;
//   })
//   .catch((error) => console.error(error + 2))
//   .then(console.log);

// new myPromise((res, rej) => setTimeout(() => rej(100), 1000))
//   .then((result) => result + 1)
//   .then((result) => console.log("sdfds"))
//   .catch((error) => console.log(error))
//   .then(console.log);

// new myPromise((res, rej) => setTimeout(() => rej(1), 1000))
//   .then((result) => result + 1)
//   .then((result) => console.log("sdf"))
//   .catch((error) => {
//     throw new Error("11111");
//   })
//   .catch((error) => console.log(error.message))
//   .catch((error) => {
//     return new myPromise((res, rej) => setTimeout(() => res(100), 1000));
//   })
//   .catch((error) => console.log(error))
//   .then(console.log);

// new myPromise((res, rej) => setTimeout(() => res(1), 1000))
//   .then((result) => {
//     return new myPromise((res) => res(100));
//   })
//   .then((res) => res + 10)
//   .then(
//     (value) =>
//       new myPromise((res, rej) => setTimeout(() => res(value + 10), 1000))
//   )
//   .then(console.log);

// new myPromise((res, rej) => setTimeout(() => rej("error occurred"), 1000))
//   .catch((error) => {
//     throw new Error(error);
//   })
//   .catch((e) => console.log(e.message))
//   .catch((error) => {
//     return new myPromise((res, rej) => setTimeout(() => rej(100), 1000));
//   })
//   .catch(() => console.log("sdf"));
new myPromise((res, rej) => setTimeout(() => rej(1), 1000))
  .then((result) => result + 1)
  .catch((error) => {
    throw new Error("11111");
  })
  .finally(() => console.log("finally"));
