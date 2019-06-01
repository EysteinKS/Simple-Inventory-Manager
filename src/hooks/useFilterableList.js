export const useFilterableList = (arr = [], filter, isFiltered) => {
  const [list, setList] = useState(arr)

  return [list, setList]
}

/*
TODO:

Take input array
Return array filtered by array of filter functions

*/