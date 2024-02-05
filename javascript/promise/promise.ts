enum STATUS {
  PENDING,
  FULFILLED,
  REJECTED,
}

export class myPromise<T> {
  private status: STATUS;
  private value: T;
  private error: any;
  private callbacks: [STATUS, (v?: any) => void][];

  constructor(
    executor: (
      resolve: (value: T | myPromise<T>) => void,
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
    queueMicrotask(() => {
      this.excuteCallback();
    });
  }
  private resolve(value?: any) {
    if (value instanceof myPromise) {
      return value.then(this.resolve.bind(this));
    }
    this.status = STATUS.FULFILLED;
    this.value = value;

    queueMicrotask(() => {
      this.excuteCallback();
    });
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
  public then<TResult1 = T, TResult2 = never>(
    onfulfilled?: (
      value: T
    ) => TResult1 | myPromise<TResult1> | undefined | null
  ): myPromise<TResult1 | TResult2> {
    if (!onfulfilled || this.status === STATUS.REJECTED)
      return this as myPromise<TResult1 | TResult2>;

    if (this.status === STATUS.PENDING) {
      return new myPromise((resolve, reject) => {
        this.callbacks.push([
          STATUS.FULFILLED,
          (value: T) => {
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
      return new myPromise((resolve, reject) => {
        queueMicrotask(() => {
          try {
            const result = onfulfilled(this.value);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
      });
    }
  }
  public catch<TResult = never>(
    onrejected?: (
      reason: any
    ) => TResult | myPromise<TResult> | undefined | null
  ): myPromise<T | TResult> {
    if (!onrejected) return this;
    if (this.status === STATUS.PENDING) {
      return new myPromise((resolve, reject) => {
        this.callbacks.push([
          STATUS.REJECTED,
          (error: any) => {
            try {
              if (this.status !== STATUS.FULFILLED) {
                const result = onrejected(error);
                resolve(result);
              } else {
                resolve(this.value);
              }
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

    return new myPromise((resolve, reject) => {
      queueMicrotask(() => {
        try {
          const result = onrejected(this.error);
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    });
  }
  finally(onfinally?: () => void): myPromise<T> {
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
    } else {
      queueMicrotask(() => {
        onfinally();
      });
      return new myPromise((resolve, reject) => {
        if (this.status === STATUS.REJECTED) {
          reject(this.error);
        } else if (this.status === STATUS.FULFILLED) {
          resolve(this.value);
        }
      });
    }
  }
}
