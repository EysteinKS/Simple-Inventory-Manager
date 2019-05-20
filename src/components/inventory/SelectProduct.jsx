import React from "react"
import { useSelector } from "react-redux"
import Names from "../Names"

export default ({style = {}, onSelect}) => {
  let styling = {
    width: "100%",
    display: "grid",
    ...style
  }

  const products = useSelector(state => state.products.products)
  const activeProducts = products.filter(product => product.active)

  return(
    <section 
      style={styling}
    >
      {activeProducts.map((prod, index) => <Product product={prod} key={index} onSelect={onSelect}/>)}
    </section>
  )
}

const Product = ({product, onSelect}) => {
  const { productID, name, categoryID } = product
  //console.log(product)
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