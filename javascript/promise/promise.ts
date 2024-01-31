enum STATUS {
  PENDING,
  FULFILLED,
  REJECTED,
}

class myPromise {
  private status: STATUS;
  private value: any;
  private error: any;
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
    this.error = reason;
  }
  private resolve(value: any) {
    this.status = STATUS.FULFILLED;
    this.value = value;
  }
  public then(onfulfilled?: (value: any) => any) {
    if (onfulfilled && this.status === STATUS.FULFILLED) {
      return new myPromise((resolve) => resolve(onfulfilled(this.value)));
    }
    return this;
  }
  public catch(onrejected?: (reason: any) => any) {
    if (onrejected && this.status === STATUS.REJECTED) {
      try {
        const value = onrejected(this.error);
        return new myPromise((resolve) => resolve(value));
      } catch (e) {
        return new myPromise((_, reject) => reject(e));
      }
    }
    return this;
  }
}

// new myPromise((res, rej) => rej(1))
//   .then((res) => res + 1)
//   .catch((error) => {
//     console.log("****Error**** :  ", error);
//     throw new Error("2");
//   })
//   .catch((error) => {
//     console.log("****Error**** : ", error.message);
//     return "success";
//   })
//   .then((result) => {
//     console.log("after catch:", result);
//   });

new myPromise((res, rej) => res(1))
  .then(() => {
    return new myPromise((res) => res(100));
  })
  .then((res) => res + 1)
  .catch((error) => {
    console.log("****Error**** :  ", error);
    throw new Error("2");
  })
  .catch((error) => {
    console.log("****Error**** : ", error.message);
    return "success";
  })
  .then((result) => {
    console.log("after catch:", result);
  });
