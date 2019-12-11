import { useState, useEffect } from "react";

export default function useEditableList<T>(arr: T[] = []) {
  const [list, setList] = useState(arr);

  useEffect(() => {
    setList(arr);
  }, [arr]);

  const add = (newListItem: T) => {
    setList(state => state.concat(newListItem));
  };

  const edit = (updated: T, index: number) => {
    let editedList = [...list] as any;
    editedList[index] = updated;
    setList(editedList);
  };

  const remove = (index: number) => {
    let withRemoved = [...list];
    withRemoved.splice(index, 1);
    setList(withRemoved);
  };

  const replace = setList;

  return { list, add, edit, remove, replace };
}
