type MemoizeFn<T, U = never> = (...args: U[]) => T;

const memoize = <T, U>(fn: MemoizeFn<T, U>): MemoizeFn<T, U> => {
  const memo = new Map();
  return (...args: Parameters<MemoizeFn<T, U>>) => {
    const key = JSON.stringify(args);
    console.log("key", key);

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
