import React, { useMemo } from "react";
import { IProduct } from "../../redux/types";
import SelectProduct from "./SelectProduct";
import ProductName from "./ProductName";
import Icons from "../util/Icons";
import styled from "styled-components";
import { device } from "../../styles/device";
import { ProductWithEdit, CenteredText } from "./EditModals/styles";
import useAuthLocation from "../../hooks/useAuthLocation";
import { StyledList } from "../../styles/list";
import { ProductWrapper, NameWrapper } from "./OrderedProducts";
import { InputButton } from "../../styles/form";

interface IProps {
  products: IProduct[];
  selected: number[];
  add: (newListItem: any) => void;
  remove: (index: number) => void;
}

const SuppliersProducts = ({ products, selected, add, remove }: IProps) => {
  const selectedProducts = useMemo(() => {
    let list = selected.map(id => ({
      productID: id,
      amount: 0
    }));
    return list;
  }, [selected]);

  const { color, secondary, dark } = useAuthLocation();

  return (
    <StyledWrapper bckColor={color}>
      <StyledSection overflow="hidden">
        <SelectProduct
          height="60vh"
          ignoreInactive={true}
          products={products}
          onSelect={productID => add(productID)}
          selected={selectedProducts}
        />
      </StyledSection>
      <StyledSection overflow="hidden">
        <ProductWithEdit bckColor={secondary}>
          <CenteredText>
            <Icons.Exchange />
          </CenteredText>
        </ProductWithEdit>
        <StyledList borderColor={dark}>
          {selectedProducts.map((product, i) => (
            <SuppliersProduct
              product={product.productID}
              key={"selected_supplier_products_" + product.productID}
              index={i}
              remove={index => remove(index)}
            />
          ))}
        </StyledList>
      </StyledSection>
    </StyledWrapper>
  );
};

type TOrderedProduct = {
  product: number;
  remove: (index: number) => void;
  index: number;
};

const SuppliersProduct = ({ product, remove, index }: TOrderedProduct) => {
  return (
    <ProductWrapper columns="6fr 1fr">
      <NameWrapper>
        <ProductName id={product} />
      </NameWrapper>
      <InputButton
        onClick={e => {
          e.preventDefault();
          remove(index);
        }}
      >
        <Icons.Delete />
      </InputButton>
    </ProductWrapper>
  );
};

const StyledWrapper = styled.div<{ bckColor: string }>`
  background: ${props => props.bckColor};
  max-height: 100%;
  overflow-y: hidden;
  display: grid;
  grid-template-rows: 30vh 30vh;
  ${device.tablet(`
    grid-template-rows: 500px;
    grid-template-columns: 345px 345px;
    column-gap: 10px;
  `)}
`;

const StyledSection = styled.div`
  background-color: #fbfbfb;
  padding: 0;
  display: grid;
  grid-template-rows: 6vh 24vh;
  overflow-y: hidden;
  overflow-x: hidden;
  :hover {
    overflow-y: ${(props: { overflow: string }) => props.overflow};
  }
`;

export default SuppliersProducts;
