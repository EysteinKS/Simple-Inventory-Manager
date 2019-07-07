import { useState, Dispatch, SetStateAction } from "react";

const isFunction = (input: any) => typeof input === "function";
export type TSetList = Dispatch<SetStateAction<any[]>>

export default function useSortableList(arr: any[] = []) {
  const [sortedList, updateList] = useState(arr);

  const setList = (arr: any[]) => {
    updateList(arr)
  }

  const setSortingFuncs = (funcArray: any[]) => {
    if (funcArray.length) {
      if (!funcArray.some(isFunction)) {
        setList(arr);
      } else {
        updateList(cur => {
          let newList = [...cur]
          funcArray.forEach(func => {
            if (isFunction(func)) {
              newList.sort(func);
            }
          });
          return newList
        }
        );
      }
    }
  };

  return { sortedList, setList, setSortingFuncs }
}
