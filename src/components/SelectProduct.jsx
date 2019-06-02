import React, {useState, useEffect} from "react"
import { useSelector } from "react-redux"
import Names from "./Names"

export default ({style = {}, onSelect, selected}) => {
  const products = useSelector(state => state.products.products)
  const activeProducts = products.filter(product => product.active)
  const [list, setList] = useState(activeProducts)
  const [search, setSearch] = useState("")

  let styling = {
    width: "100%",
    display: "grid",
    ...style
  }

  const filterBySelected = (listToFilter) => {
    //https://stackoverflow.com/questions/34901593/how-to-filter-an-array-from-all-elements-of-another-array/51598249#51598249
    if(Array.isArray(selected)){
      let selectedIDs = selected.map(sel => sel.productID)
      let withoutSelected = listToFilter.filter(product => !selectedIDs.includes(product.productID))
      return withoutSelected
    } else {
      return listToFilter
    }
  }

  const filterBySearched = (listToFilter) => {
    let searched = listToFilter.filter(item => item.name.includes(search))
    return searched
  }

  useEffect(() => {
    setList(filterBySelected(activeProducts))
    // eslint-disable-next-line
  }, [selected])

  useEffect(() => {
    setList(filterBySearched(filterBySelected(activeProducts)))
    // eslint-disable-next-line
  }, [search])

  return(
    <section 
      style={styling}
    >
      <input type="text" value={search} onChange={e => setSearch(e.target.value)}/>
      {list.map((prod, index) => <Product product={prod} key={index} onSelect={onSelect}/>)}
    </section>
  )
}

const Product = ({product, onSelect}) => {
  const { productID, name, categoryID } = product
  return(
    <div style={{display: "grid", gridTemplateColumns: "40% 40% 20%"}}>
      <p>{name}</p>
      <p><Names target="categories" id={categoryID}/></p>
      <button onClick={(e) => {
        e.preventDefault()
        onSelect(productID)
      }}>Velg</button>
    </div>
  )
}