const arrayClone = <T extends any[]>(arr: T): T[] => {
  let result: T[] = [];
  for (const el of arr) {
    if (typeof el === "object") {
      result.push(cloneDeep(el));
    } else {
      result.push(el);
    }
  }
  return result;
};

const cloneDeep = <T>(obj: T): T => {
  let result: T;
  const isArr = Array.isArray(obj);

  if (isArr) {
    return arrayClone(obj) as any;
  }

  if (typeof obj === "object" && obj !== null) {
    result = {} as T;
    for (const key in obj) {
      result[key] = cloneDeep(obj[key]);
    }
  } else {
    result = obj;
  }

  return result;
};

export { cloneDeep };
