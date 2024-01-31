enum STATUS {
  PENDING,
  FULFILLED,
  REJECTED,
}

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
  public catch() {}
  public finally() {}
}

new myPromise((resolve, reject) => {
  setTimeout(() => resolve(1), 1000); // (*)
}).then(console.log); // 1;
