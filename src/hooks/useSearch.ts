import { useState, useEffect } from "react";
import { shouldLog } from "../constants/util";

const valuesToLowercase = (obj: any = {}) =>
  Object.keys(obj).reduce((result: any, key: string) => {
    if (typeof obj[key] === "string") {
      shouldLog(result);
      result[key] = obj[key].toLowerCase();
    } else {
      result[key] = obj[key];
    }
    return result;
  }, {});

type TFilter = (item: string | any, search: string) => boolean;
type TUseSearchReturn = [
  any[],
  (search: string) => void,
  (list: any[]) => void
];

/**
 * Hook that filters a list based on a callback function
 *
 * @param {array} list
 * @param {TFilter} filters
 * @returns {TUseSearchReturn} An array with the filtered array and a function to change search string
 *
 * @example
 * let anyArray = []
 * let callback = (item, search) => (item.includes(search))
 * const [filtered, setSearch] = useSearch(anyArray, callback)
 */
export default function useSearch(
  list: any[],
  filters: TFilter
): TUseSearchReturn {
  const [filtered, setFiltered] = useState(list);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (filters && search.length) {
      let filteredList = list.filter(item =>
        filters(valuesToLowercase(item), search)
      );
      setFiltered(filteredList);
    } else {
      setFiltered(list);
    }
  }, [search, filters, list]);

  return [filtered, setSearch, setFiltered];
}
