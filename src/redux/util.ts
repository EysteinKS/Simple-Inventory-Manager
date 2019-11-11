export const getIndexToInsert = (
  array: any[],
  obj: any,
  key: string
): number => {
  const foundIndex = array.findIndex(item => item[key] > obj[key]);
  return foundIndex === -1 ? array.length - 1 : foundIndex;
};

export function insertIntoArray<T, K extends keyof T>(
  array: T[],
  obj: T,
  key: K
): T[] {
  const foundIndex = array.findIndex(item => item[key] > obj[key]);
  const indexToInsert = foundIndex === -1 ? array.length - 1 : foundIndex;
  const newArray = [...array];
  newArray.splice(indexToInsert, 0, obj);
  return newArray;
}
