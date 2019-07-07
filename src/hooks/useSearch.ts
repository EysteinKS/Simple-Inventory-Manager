import { useState, useEffect } from "react"

const valuesToLowercase = (obj: any = {}) => 
  Object.keys(obj).reduce((result: any, key: string) => {
    if(typeof obj[key] === "string"){
      console.log(result)
      result[key] = obj[key].toLowerCase()
    } else {
      result[key] = obj[key]
    }
    return result
  }, {})

type TFilter = (item: string | any, search: string) => boolean

/**
 * Hook that filters a list based on a callback function
 * 
 * @param {Array} list
 * @param {Function} filters
 * 
 * @example
 * let anyArray = []
 * let callback = (item, search) => (item.includes(search))
 * const [filtered, setSearch] = useSearch(anyArray, callback)
 */
export default function useSearch(list: any[] = [], filters: TFilter){
  const [filtered, setFiltered] = useState(list)
  const [search, setSearch] = useState("")

  useEffect(() => {
      if(filters && search.length){
        let filteredList = list.filter(item => filters(valuesToLowercase(item), search))
        setFiltered(filteredList)
      } else {
        setFiltered(list)
      }
  }, [search])

  return [filtered, setSearch]
}