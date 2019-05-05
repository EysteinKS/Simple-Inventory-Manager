import React, { useState, useCallback } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { sortProducts } from "../../redux/actions/productsActions"
import { getCategoryName } from "../../constants/util"
import "./Products.css"

export default () => {
  const products = useSelector(state => state.products.products)
  console.log(products)

  return (
    <div>
      <h3 style={{display: "flex", justifyContent: "center"}}>Produkter</h3>
      <ProductsHeader/>
      {products.map(product => <Product product={product}/>)}
    </div>
  )
}

const ProductsHeader = ({  }) => {
  const dispatch = useDispatch()
  const [ currentDirection, setDirection ] = useState("desc")
  return(
    <div className="products-header">
      <p onClick={() => {
        let dir = changeDirection(currentDirection, setDirection)
        setDirection(dir)
        dispatch(sortProducts("name", dir))
      }}>Navn</p>
      <p>Kategori</p>
    </div>
  )
}

const changeDirection = (current) => {
  let dir
  if (current === "desc"){
    dir = "asc"
  } else if (current === "asc"){
    dir = "desc"
  }
  return dir
}

const Product = ({product}) => {
  const categories = useSelector(state => state.categories.categories)
  console.log(categories)
  const category = getCategoryName(categories, product.categoryID)
  console.log(product)
  return(
    <div className="product">
      <p>{product.name}</p>
      <p>{category}</p>
    </div>
  )
}