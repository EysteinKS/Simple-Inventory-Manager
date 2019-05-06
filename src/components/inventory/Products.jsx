import React, { useState, useCallback } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { 
  sortProducts, 
  filterProducts, 
  createProduct,
  saveCreatedProduct,
  editProduct,
  saveEditedProduct,
  clearCurrentProduct } from "../../redux/actions/productsActions"
import { sortByName, filterByActive, sortByCategory, getOrderedAmount, newProduct } from "../../constants/util"
import { productCategories } from "../../constants/mock"
import "./Products.css"

import ReactModal from "react-modal"
ReactModal.setAppElement("#root")

export default () => {
  const dispatch = useDispatch()
  const products = useSelector(state => state.products)
  let productList = products.sortedProducts
  //disp(filterProducts(filterByActive))
  const [ isModalOpen, setModalOpen ] = useState(false)

  return (
    <div>
      <div style={{display: "grid", gridTemplateColumns: "20% 60% 20%", justifyItems: "center"}}>
        <button onClick={() => {
        dispatch(createProduct(newProduct(products.products.length + 1)))
        setModalOpen(true)
        }}>Legg til</button>
        <h3>Produkter</h3>
      </div>
      <ProductsHeader/>
      {productList.map((product, key) => <Product product={product} edit={(id) => {
        dispatch(editProduct(id))
        setModalOpen(true)
      }}/>)}
      <EditProduct isOpen={isModalOpen} close={() => {
        setModalOpen(false)
        dispatch(clearCurrentProduct())
      }}/>
    </div>
  )
}

const ProductsHeader = () => {
  const dispatch = useDispatch()
  const [ isFiltered, setFiltered ] = useState(true)
  const filter = useCallback(() => {
    setFiltered(!isFiltered)
    dispatch(filterProducts(filterByActive(isFiltered)))
  }, [isFiltered, dispatch])
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

const Product = ({product, reserved, edit}) => {
  const categories = useSelector(state => state.categories.categories)
  const category = categories[product.categoryID - 1].name
  //const category = getCategoryName(categories, product.categoryID)
  let orders = useSelector(state => state.orders.orders)
  let ordered = getOrderedAmount(orders, product.productID)
  let amount = product.amount

  const total = amount + (ordered || 0) - (reserved || 0)

  return(
    <div className="product">
      <p>{product.name}</p>
      <p>{category}</p>
      <p>{amount || 0}</p>
      <p>{ordered || 0}</p>
      <p>{reserved || 0}</p>
      <p>{total}</p>
      <button onClick={() => edit(product.productID)}>Rediger</button>
    </div>
  )
}

const EditProduct = ({ isOpen, close }) => {
  const current = useSelector(state => state.products.currentProduct)
  const products = useSelector(state => state.products.products)
  const dispatch = useDispatch()
  const [name, setName] = useState(current.name)
  const [category, setCategory] = useState(current.categoryID)
  const [amount, setAmount] = useState(current.amount)
  const [active, setActive] = useState(current.active)

  const [init, setInit] = useState(false)
  if(isOpen && !init){
    console.log(current)
    setName(current.name)
    setCategory(current.categoryID)
    setAmount(current.amount)
    setActive(current.active)
    setInit(true)
  }

  let returnedProduct = {
    productID: current.productID,
    name: name,
    categoryID: category,
    active: active,
    amount: Number(amount)
  }

  return(
    <ReactModal
      isOpen={isOpen}
      contentLabel="Edit Product"
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)"
        },
        content: {
          top: "20vh",
          left: "5vw",
          right: "5vw",
          bottom: "10vh"
        }
      }}
    >
      <form>
        <p>ID: {current.productID}</p>
        <label for="name">Navn</label>
        <br/>
        <input
          type="text"
          name="name"
          placeholder="Navn"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <br/>
        <label for="category">Kategori</label>
        <br/>
        <input
          type="text"
          name="category"
          placeholder="Kategori"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        />
        <br/>
        <label for="amount">På lager</label>
        <br/>
        <input 
          type="tel"
          name="amount"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
        <br/>
        <label for="active">Aktiv</label>
        <input
          type="checkbox"
          name="active"
          checked={active}
          onChange={() => setActive(!active)}
        />
      </form>
      <button onClick={() => {
        console.log("Current ID: ", current.productID)
        console.log("Products length: ", products.length)
        if(current.productID > products.length){
          dispatch(saveCreatedProduct(returnedProduct))
          close()
          setInit(false)
        } else {
          console.log("Saving product: ", returnedProduct)
          dispatch(saveEditedProduct(returnedProduct))
          close()
          setInit(false)
        }
      }}>Lagre</button>
      <button onClick={() => {
        close()
        setInit(false)
      }}>Lukk</button>
    </ReactModal>
  )
}