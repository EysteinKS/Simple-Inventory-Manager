import React, {useState, useEffect} from "react"
import { useSelector } from "react-redux"
import Names from "./Names"
import { IProduct, RootState, IOrderedProduct } from "../redux/types";

interface ISelectProduct {
  style: any,
  onSelect: (id: number) => void,
  selected: IOrderedProduct[]
}

export default function SelectProduct({style = {}, onSelect, selected}: ISelectProduct) {
  const products = useSelector((state: RootState) => state.products.products)
  const activeProducts = products.filter(product => product.active)
  const [list, setList] = useState(activeProducts)
  const [search, setSearch] = useState("")

  let styling = {
    width: "100%",
    display: "grid",
    ...style
  }

  const filterBySelected = (listToFilter: any[]) => {
    //https://stackoverflow.com/questions/34901593/how-to-filter-an-array-from-all-elements-of-another-array/51598249#51598249
    if(Array.isArray(selected)){
      let selectedIDs = selected.map(sel => sel.productID)
      let withoutSelected = listToFilter.filter(product => !selectedIDs.includes(product.productID))
      return withoutSelected
    } else {
      return listToFilter
    }
  }

  const filterBySearched = (listToFilter: any[]) => {
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
      {list.map((prod: IProduct, index: number) => <Product product={prod} key={"product_" + index} onSelect={onSelect}/>)}
    </section>
  )
}

interface ProductProps {
  product: IProduct,
  onSelect: (id: number) => void
}
const Product = ({product, onSelect}: ProductProps) => {
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