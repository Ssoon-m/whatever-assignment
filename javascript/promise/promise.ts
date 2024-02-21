enum STATUS {
  PENDING,
  FULFILLED,
  REJECTED,
}

class myPromise<T> {
  state: STATUS;
  fulfilledCallback?: (value: T) => void;
  rejectedCallback?: (error: any) => void;
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
      this.fulfilledCallback?.(value);
    });
  }
  reject(error: any) {
    queueMicrotask(() => {
      this.state = STATUS.REJECTED;
      this.rejectedCallback?.(error);
    });
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: (value: T) => TResult1 | myPromise<TResult1>,
    onrejected?: (error: any) => TResult2 | myPromise<TResult2>
  ): myPromise<TResult1 | TResult2> {
    return new myPromise((resolve, reject) => {
      this.fulfilledCallback = (value) => {
        if (onfulfilled) {
          try {
            resolve(onfulfilled(value));
          } catch (e) {
            reject(e);
          }
          return;
        }
      };

      this.rejectedCallback = (error) => {
        if (onrejected) {
          reject(onrejected(error));
          return;
        }
        reject(error);
      };
    });
  }
  catch<TResult = never>(
    onrejected?: (reason: any) => TResult | myPromise<TResult>
  ): myPromise<T | TResult> {
    return new myPromise((resolve, reject) => {
      this.fulfilledCallback = (value) => {
        try {
          resolve(onrejected(value));
        } catch (e) {
          reject(e);
        }
      };
      this.rejectedCallback = (error) => {
        try {
          resolve(onrejected(error));
        } catch (e) {
          reject(e);
        }
      };
    });
  }
  finally(onfinally?: () => void): myPromise<T> {
    return new myPromise((resolve, reject) => {
      this.fulfilledCallback = (value) => {
        try {
          onfinally();
          resolve(value);
        } catch (e) {
          reject(e);
        }
      };
      this.rejectedCallback = (error) => {
        try {
          onfinally();
          resolve(error);
        } catch (e) {
          reject(e);
        }
      };
    });
  }
}

export { myPromise };
