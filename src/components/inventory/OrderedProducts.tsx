import React from "react"
import { IOrderedProduct } from "../../redux/types";
import SelectProduct from "./SelectProduct";
import ProductName from "./ProductName";
import Icons from "../util/Icons";
import styled from "styled-components";

type TOrdered = {
  ordered: IOrderedProduct[],
  add: (newListItem: any) => void,
  edit: (updated: any, index: number) => void,
  remove: (index: number) => void
}

const OrderedProducts = ({ ordered, add, edit, remove }: TOrdered) => {
  return (
    <StyledWrapper>
      <StyledSection>
        <SelectProduct
          onSelect={productID => add(productID)}
          selected={ordered}
        />
      </StyledSection>
      <StyledSection>
        <ul style={{ listStyleType: "none", padding: "5px", margin: "0px" }}>
          {ordered.map((product, i) => (
            <OrderedProduct 
              product={product} 
              key={"selected_products_" + product.productID} 
              index={i} 
              edit={(value, index) => edit({productID: product.productID, amount: value}, index)}
              remove={index => remove(index)}/>
          ))}
        </ul>
      </StyledSection>
    </StyledWrapper>
  );
};

type TOrderedProduct = {
  product: IOrderedProduct,
  edit: (updated: any, index: number) => void,
  remove: (index: number) => void,
  index: number
}

const OrderedProduct = ({ product, edit, remove, index }: TOrderedProduct) => {
  const { productID, amount } = product;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "50% 40% 10%",
        marginBottom: "10px",
        paddingBottom: "5px"
      }}
    >
      <ProductName id={productID} />
      <input
        type="tel"
        value={amount}
        onChange={e => edit(Number(e.target.value), index)}
      />
      <button onClick={e => {
        e.preventDefault()
        remove(index)
      }}><Icons.Delete/></button>
    </div>
  );
};

const StyledWrapper = styled.div`
  padding: 3%;
  max-height: 100%;
  overflow-y: auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 2em;
`

const StyledSection = styled.div`

`

export default OrderedProducts