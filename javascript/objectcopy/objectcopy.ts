const arrayClone = <T extends any[]>(arr: T): T[] => {
  let result = [] as T[];
  for (const el of arr) {
    if (typeof el === "object") {
      result.push(cloneDeep(el));
    } else {
      result.push(el);
    }
  }
  return result;
};

const cloneDeep = <T>(obj: T) => {
  let result = {} as any;
  const isArr = Array.isArray(obj);

  if (isArr) {
    return arrayClone(obj);
  }

  if (typeof obj === "object" && obj !== null) {
    for (const key in obj) {
      result[key] = cloneDeep(obj[key]);
    }
  } else {
    result = obj;
  }

  return result;
};

export { cloneDeep };
