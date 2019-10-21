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
      <StyledSection overflow="hidden">
        <SelectProduct
          products={products}
          onSelect={productID => add(productID)}
          selected={ordered}
        />
      </StyledSection>
      <StyledSection overflow="overlay">
        <StyledList>
          {ordered.map((product, i) => (
            <OrderedProduct 
              product={product} 
              key={"selected_ordered_products_" + product.productID} 
              index={i} 
              edit={(value, index) => edit({productID: product.productID, amount: value}, index)}
              remove={index => remove(index)}
            />
          ))}
        </StyledList>
      </StyledSection>
    </StyledWrapper>
  );
};

const StyledList = styled.ul`
  list-style-type: none;
  padding: 0px;
  margin: 0px;
`

type TOrderedProduct = {
  product: IOrderedProduct,
  edit: (updated: any, index: number) => void,
  remove: (index: number) => void,
  index: number
}

const OrderedProduct = ({ product, edit, remove, index }: TOrderedProduct) => {
  const { productID, amount } = product;
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select()
  };

  return (
    <ProductWrapper index={index}>
      <NameWrapper><ProductName id={productID}/></NameWrapper>
      <InputWrapper>
        <InputButton 
          side="left"
          onClick={() => (amount > 1) && edit(amount - 1, index)}
          tabIndex={-1}
        >
          -
        </InputButton>
        <InputField
          type="number"
          value={amount}
          onChange={e => edit(Number(e.target.value), index)}
          onFocus={handleFocus}
        />
        <InputButton 
          side="right"
          onClick={() => edit(amount + 1, index)}
          tabIndex={-1}
        >
          +
        </InputButton>
      </InputWrapper>
      <DeleteProduct
        tabIndex={-1} 
        onClick={e => {
          e.preventDefault()
          remove(index)
      }}><Icons.Delete/></DeleteProduct>
    </ProductWrapper>
  );
};

const ProductWrapper = styled.div`
  display: grid;
  grid-template-columns: 5fr 3fr 1fr;
  height: 50px;
  column-gap: 1em;
  padding: 0.3em;
  background-color: ${(props: {index: number}) => {
    if(props.index % 2 === 0){
      return "#F3F3F3"
    } else {
      return "#E8E8E8"
    }
  }};
`

const NameWrapper = styled.p`
  padding-left: 1em;
  margin: 0.7em 0;
  text-align: start;
  align-self: center;
`

const InputButton = styled.button`
  background-color: #FFF;
  font-weight: 400;
  font-size: 16px;
  border: 1px solid #AAA;
  border-radius: ${(props: {side: string}) => {
    if(props.side === "left") return "0.5em 0 0 0.5em"
    else if(props.side === "right") return "0 0.5em 0.5em 0"
  }}
`

const InputField = styled.input`
  width: 100%;
  border: 1px solid #AAA;
  text-align: center;
  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`

const InputWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 2fr 1.5fr;
  padding: 0.2em;
`

const StyledWrapper = styled.div`
  padding: 1%;
  max-height: 100%;
  overflow-y: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 1em;
`

const DeleteProduct = styled.button`
  border: 1px solid #AAA;
`

const StyledSection = styled.div`
  background-color: #fbfbfb;
  padding: 0;
  border: 2px solid #eee;
  overflow-y: hidden;
  overflow-x: hidden;
  :hover {
    overflow-y: ${(props: {overflow: string}) => props.overflow};
  }
`

export default OrderedProducts