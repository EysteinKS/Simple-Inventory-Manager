import React from "react"
import { IOrderedProduct, IProduct } from "../../redux/types";
import SelectProduct from "./SelectProduct";
import ProductName from "./ProductName";
import Icons from "../util/Icons";
import styled from "styled-components";

type TOrdered = {
  products: IProduct[]
  ordered: IOrderedProduct[],
  add: (newListItem: any) => void,
  edit: (updated: any, index: number) => void,
  remove: (index: number) => void
}

const OrderedProducts = ({ products, ordered, add, edit, remove }: TOrdered) => {
  return (
    <StyledWrapper>
      <StyledSection>
        <SelectProduct
          products={products}
          onSelect={productID => add(productID)}
          selected={ordered}
        />
      </StyledSection>
      <StyledSection padding="0.5em">
        <ul style={{ listStyleType: "none", padding: "5px", margin: "0px" }}>
          {ordered.map((product, i) => (
            <OrderedProduct 
              product={product} 
              key={"selected_ordered_products_" + product.productID} 
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
    <ProductWrapper>
      <ProductName id={productID} />
      <InputWrapper>
        <InputButton side="left"
          onClick={() => (amount > 1) && edit(amount - 1, index)}
        >
          -
        </InputButton>
        <InputField
          type="number"
          value={amount}
          onChange={e => edit(Number(e.target.value), index)}
        />
        <InputButton side="right"
          onClick={() => edit(amount + 1, index)}
        >
          +
        </InputButton>
      </InputWrapper>
      <DeleteProduct onClick={e => {
        e.preventDefault()
        remove(index)
      }}><Icons.Delete/></DeleteProduct>
    </ProductWrapper>
  );
};

const ProductWrapper = styled.div`
  display: grid;
  grid-template-columns: 7fr 2fr 1fr;
  column-gap: 1em;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #ccc;
`

const InputButton = styled.button`
  border-radius: ${(props: {side: string}) => {
    if(props.side === "left") return "0.5em 0 0 0.5em"
    else if(props.side === "right") return "0 0.5em 0.5em 0"
  }}
`

const InputField = styled.input`
  width: 100%;
  text-align: center;
  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`

const InputWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
`

const StyledWrapper = styled.div`
  padding: 1%;
  max-height: 100%;
  overflow-y: auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 1em;
`

const DeleteProduct = styled.button`

`

const StyledSection = styled.div`
  background-color: #fbfbfb;
  padding: ${(props: {padding?: string}) => props.padding ? props.padding : 0 };
  border: 2px solid #eee;
`

export default OrderedProducts