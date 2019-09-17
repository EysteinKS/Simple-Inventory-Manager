import React, { useMemo } from "react"
import { IProduct } from "../../redux/types";
import SelectProduct from "./SelectProduct";
import ProductName from "./ProductName";
import Icons from "../util/Icons";
import styled from "styled-components";

interface IProps {
  products: IProduct[]
  selected: number[],
  add: (newListItem: any) => void,
  remove: (index: number) => void
}

const SuppliersProducts = ({ products, selected, add, remove }: IProps) => {
  const selectedProducts = useMemo(() => {
    let list = selected.map(id => ({
      productID: id,
      amount: 0
    }))
    return list
  }, [selected])

  return (
    <StyledWrapper>
      <StyledSection>
        <SelectProduct
          height="35vh"
          ignoreInactive={true}
          products={products}
          onSelect={productID => add(productID)}
          selected={selectedProducts}
        />
      </StyledSection>
      <StyledSection>
        <ul style={{ listStyleType: "none", padding: "5px", margin: "0px" }}>
          {selectedProducts.map((product, i) => (
            <SuppliersProduct 
              product={product.productID} 
              key={"selected_products_" + product.productID} 
              index={i} 
              remove={index => remove(index)}/>
          ))}
        </ul>
      </StyledSection>
    </StyledWrapper>
  );
};

type TOrderedProduct = {
  product: number,
  remove: (index: number) => void,
  index: number
}

const SuppliersProduct = ({ product, remove, index }: TOrderedProduct) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "80% 20%",
        marginBottom: "10px",
        paddingBottom: "5px"
      }}
    >
      <ProductName id={product} />
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
  grid-column: 1 / 3;
`

const StyledSection = styled.div`

`

export default SuppliersProducts