enum STATUS {
  PENDING,
  FULFILLED,
  REJECTED,
}

class myPromise<T> {
  state: STATUS;
  value: T;
  error: any;
  fulfilledCallback?: () => void;
  rejectedCallback?: () => void;
  constructor(
    excute: (
      resolve: (value: T | myPromise<T>) => void,
      reject: (error: any) => void
    ) => void
  ) {
    this.state = STATUS.PENDING;
    excute(this.resolve.bind(this), this.reject.bind(this));
  }
  resolve(value: T | myPromise<T>) {
    if (value instanceof myPromise) {
      value.then(this.resolve.bind(this));
      return;
    }
    queueMicrotask(() => {
      this.state = STATUS.FULFILLED;
      this.value = value;
      this.fulfilledCallback?.();
    });
  }
  reject(error: any) {
    queueMicrotask(() => {
      this.state = STATUS.REJECTED;
      this.error = error;
      this.rejectedCallback?.();
    });
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: (value: T) => TResult1 | myPromise<TResult1>,
    onrejected?: (error: any) => TResult2 | myPromise<TResult2>
  ): myPromise<TResult1 | TResult2> {
    return new myPromise((resolve, reject) => {
      this.fulfilledCallback = () => {
        if (onfulfilled) {
          try {
            resolve(onfulfilled(this.value));
          } catch (e) {
            reject(e);
          }
          return;
        }
      };

      this.rejectedCallback = () => {
        if (onrejected) {
          reject(onrejected(this.error));
          return;
        }
        reject(this.error);
      };
    });
  }
  catch<TResult = never>(
    onrejected?: (reason: any) => TResult | myPromise<TResult>
  ): myPromise<T | TResult> {
    return new myPromise((resolve, reject) => {
      this.fulfilledCallback = () => {
        try {
          resolve(onrejected(this.value));
        } catch (e) {
          reject(e);
        }
      };
      this.rejectedCallback = () => {
        try {
          resolve(onrejected(this.error));
        } catch (e) {
          reject(e);
        }
      };
    });
  }
  finally(onfinally?: () => void): myPromise<T> {
    return new myPromise((resolve, reject) => {
      this.fulfilledCallback = () => {
        try {
          onfinally();
          resolve(this.value);
        } catch (e) {
          reject(e);
        }
      };
      this.rejectedCallback = () => {
        try {
          onfinally();
          resolve(this.error);
        } catch (e) {
          reject(e);
        }
      };
    });
  }
}

export { myPromise };
