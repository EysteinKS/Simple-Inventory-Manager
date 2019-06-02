import { useState } from "react";

const isFunction = input => typeof input === "function";

export default function useSortableList(arr = []) {
  const [sortedList, setList] = useState(arr);

  const setSorting = (funcArray = []) => {
    if (funcArray.length) {
      if (!funcArray.some(isFunction)) {
        setList(arr);
      } else {
        setList(cur => {
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

  return [sortedList, setList, setSorting];
}
