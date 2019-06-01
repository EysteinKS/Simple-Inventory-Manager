import { useState } from "react";
import produce from "immer";

const isFunction = input => typeof input === "function";

export default function useSortableList(arr = []) {
  const [sortedList, setList] = useState(arr);

  const setSorting = (funcArray = []) => {
    if (funcArray.length) {
      if (!funcArray.some(isFunction)) {
        setList(arr);
      } else {
        setList(cur =>
          produce(cur, draft => {
            funcArray.forEach(func => {
              if (isFunction(func)) {
                draft.sort(func);
              }
            });
          })
        );
      }
    }
  };

  /* useEffect(() => {
    if(sortingFuncs.length){
      setList(cur => produce(cur, draft => {
        sortingFuncs.forEach(func => {
          if(isFunction(func)){
            draft.sort(func)
          }
        })
      })
      )
    }
    if(!sortingFuncs.some(isFunction)){
      setList(arr)
    }
  }, [sortedList, setList, sortingFuncs, arr]) */

  return [sortedList, setList, setSorting];
}
