import { useState, useEffect } from "react";

const useFilterableList = (arr = [], id: number) => {
  const [list, setList] = useState(arr);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [filterArray, setFilterArray] = useState([]);

  useEffect(() => {}, [filterArray]);

  const filterBySelected = (listToFilter: any[]) => {
    //https://stackoverflow.com/questions/34901593/how-to-filter-an-array-from-all-elements-of-another-array/51598249#51598249
    if (Array.isArray(selected)) {
      let selectedIDs = selected.map((sel: any) => sel.productID);
      return listToFilter.filter(
        product => !selectedIDs.includes(product.productID)
      );
    } else {
      return listToFilter;
    }
  };

  const filterBySearched = (listToFilter: any[]) => {
    return listToFilter.filter(item =>
      item.toLowerCase().name.includes(search.toLowerCase())
    );
  };

  const filter = {
    filterBySelected,
    filterBySearched
  };

  return [list, setList, setFilterArray, filter];
};

export default useFilterableList;

/*
TODO:

Take input array
Return array filtered by array of filter functions

*/
