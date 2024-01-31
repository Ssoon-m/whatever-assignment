enum STATUS {
  PENDING,
  FULFILLED,
  REJECTED,
}

class myPromise {
  private status: STATUS;
  private value: any;
  private error: any;
  private fulfilledCallback?: (value: any) => void;
  private rejectCallback?: (error: any) => void;

  constructor(
    executor: (
      resolve: (value: any) => void,
      reject: (reason?: any) => void
    ) => void
  ) {
    this.status = STATUS.PENDING;
    this.fulfilledCallback = null;
    this.rejectCallback = null;
    executor(this.resolve.bind(this), this.reject.bind(this));
  }
  private reject(reason?: any) {
    this.status = STATUS.REJECTED;
    this.error = reason;
    this.rejectCallback?.(reason);
  }
  private resolve(value: any) {
    if (this.value instanceof myPromise) {
    }
    this.status = STATUS.FULFILLED;
    this.value = value;
    this.fulfilledCallback?.(value);
  }
  public then(onfulfilled?: (value: any) => any) {
    if (!onfulfilled || this.status === STATUS.REJECTED) return this;

    if (this.status === STATUS.PENDING) {
      return new myPromise((resolve) => {
        // 클로저 이용
        this.fulfilledCallback = (value: any) => {
          resolve(onfulfilled(value));
        };
      });
    }
    if (this.status === STATUS.FULFILLED) {
      return new myPromise((resolve) => resolve(onfulfilled(this.value)));
    }
  }
  public catch(onrejected?: (reason: any) => any) {
    let self = this;
    if (!onrejected) return self;
    if (this.status === STATUS.PENDING) {
      return new myPromise((resolve, reject) => {
        this.rejectCallback = (error: any) => {
          if (this.status === STATUS.FULFILLED) {
            return self;
          }
          if (this.status === STATUS.REJECTED) {
            try {
              const value = onrejected(error);
              resolve(value);
            } catch (e) {
              reject(e);
            }
          }
        };
      });
    }
    if (this.status === STATUS.FULFILLED) {
      return self;
    }
    if (this.status === STATUS.REJECTED) {
      try {
        const value = onrejected(this.error);
        return new myPromise((resolve) => resolve(value));
      } catch (e) {
        return new myPromise((_, reject) => reject(e));
      }
    }
  }
}

// new myPromise((res, rej) => setTimeout(() => res(1), 1000))
//   .then((result) => result + 1)
//   .then((result) => result + 1)
//   .catch((error) => console.error(error))
//   .then(console.log);

new myPromise((res, rej) => setTimeout(() => res(1), 1000))
  .then((result) => result + 1)
  .then((result) => result + 2)
  .then(console.log);
