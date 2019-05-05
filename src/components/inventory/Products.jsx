import React, { useState, useCallback } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { sortProducts, filterProducts } from "../../redux/actions/productsActions"
import { sortByName, filterByActive, sortByCategory, getOrderedAmount } from "../../constants/util"
import { productCategories } from "../../constants/mock"
import "./Products.css"

export default () => {
  const products = useSelector(state => state.products)
  let productList = products.sortedProducts
  //disp(filterProducts(filterByActive))
  let productInventory = useSelector(state => state.inventory.inventory)

  return (
    <div>
      <h3 style={{display: "flex", justifyContent: "center"}}>Produkter</h3>
      <ProductsHeader/>
      {productList.map((product, key) => <Product product={product} amount={productInventory[key].amount}/>)}
    </div>
  )
}

const ProductsHeader = ({  }) => {
  const dispatch = useDispatch()
  const [ isFiltered, setFiltered ] = useState(true)
  const filter = useCallback(() => {
    setFiltered(!isFiltered)
    dispatch(filterProducts(filterByActive(isFiltered)))
  })
  return(
    <div className="products-header">
      <HeaderButton name="Navn" sort={dir => sortByName(dir)}/>
      <HeaderButton name="Kategori" sort={dir => sortByCategory(productCategories, dir)}/>
      <p>På lager</p>
      <p>Bestilt</p>
      <p>Reservert</p>
      <p>Sum</p>
      <button onClick={filter}>Filter</button>
    </div>
  )
}

const HeaderButton = ({ name, sort }) => {
  const dispatch = useDispatch()
  const [ currentDirection, setDirection ] = useState("asc")
  return(
    <button onClick={() => {
      setDirection(currentDirection === "asc" ? "desc" : "asc" )
      console.log(currentDirection)
      dispatch(sortProducts(sort(currentDirection)))
    }}>
      {name} {currentDirection === "desc" ? "↓" : "↑"}
    </button>
  )
}

const Product = ({product, amount, reserved}) => {
  const categories = useSelector(state => state.categories.categories)
  const category = categories[product.categoryID - 1].name
  //const category = getCategoryName(categories, product.categoryID)
  let orders = useSelector(state => state.orders.orders)
  let ordered = getOrderedAmount(orders, product.productID)

  const total = amount + (ordered || 0) - (reserved || 0)

  return(
    <div className="product">
      <p>{product.name}</p>
      <p>{category}</p>
      <p>{amount || 0}</p>
      <p>{ordered || 0}</p>
      <p>{reserved || 0}</p>
      <p>{total}</p>
    </div>
  )
}