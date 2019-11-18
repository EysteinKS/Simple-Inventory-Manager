import { useState, Dispatch, SetStateAction } from "react";
import { TDirections } from "../components/util/SectionHeader";
import produce from "immer";

const isFunction = (input: any) => typeof input === "function";
export type TSetList = Dispatch<SetStateAction<any[]>>;

export default function useSortableList<T>(arr: T[] = []) {
  const [sortedList, updateList] = useState(arr);

  const setList = (arr: T[]) => {
    updateList(arr);
  };

  const setSortingFuncs = (funcArray: any[]) => {
    if (funcArray.length) {
      if (!funcArray.some(isFunction)) {
        setList(arr);
      } else {
        updateList(cur => {
          let newList = [...cur];
          funcArray.forEach(func => {
            if (isFunction(func)) {
              newList.sort(func);
            }
          });
          return newList;
        });
      }
    }
  };

  const sortFunc = (setSorting: (sorting: any[]) => void) => (
    dir: TDirections,
    index: number,
    func: Function,
    sorting: any[]
  ) => {
    if (dir !== null) {
      let newSorting = produce(sorting, draft => {
        draft[index] = func;
      });
      setSorting(newSorting);
      setSortingFuncs(newSorting);
    } else {
      let newSorting = produce(sorting, draft => {
        draft[index] = null;
      });
      setSorting(newSorting);
      setSortingFuncs(newSorting);
    }
  };

  return { sortedList, setList, sortFunc };
}
