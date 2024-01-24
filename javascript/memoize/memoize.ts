type MemoizeFn<T> = (...args: any[]) => T;

const memoize = <T>(fn: MemoizeFn<T>): MemoizeFn<T> => {
  const memo = new Map();
  return (...args: any[]) => {
    const key = JSON.stringify(args);

    if (memo.has(key)) {
      console.log("Cache hit!");
      return memo.get(key);
    }

    console.log("Cache miss!");
    const result = fn(...args);
    memo.set(key, result);
    return result;
  };
};

export { memoize };
