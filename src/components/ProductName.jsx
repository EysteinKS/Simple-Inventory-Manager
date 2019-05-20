import React from 'react'
import { getProductName } from "../constants/util"
import { useSelector } from "react-redux"

export default ({ id }) => {
  const products = useSelector(state => state.products.products)
  const name = getProductName(products, id)
  return (
    <React.Fragment>
      {name}
    </React.Fragment>
  )
}