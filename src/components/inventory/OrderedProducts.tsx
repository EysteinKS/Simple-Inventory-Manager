import React from "react";
import { IOrderedProduct, IProduct } from "../../redux/types";
import SelectProduct from "./SelectProduct";
import ProductName from "./ProductName";
import Icons from "../util/Icons";
import styled from "styled-components";
import { device } from "../../styles/device";
import { ProductWithEdit, CenteredText } from "./EditModals/styles";
import { InputButton as FormInputButton } from "../../styles/form";
import { StyledList } from "../../styles/list";
import useAuthLocation from "../../hooks/useAuthLocation";

type TOrdered = {
  products: IProduct[];
  ordered: IOrderedProduct[];
  add: (newListItem: any) => void;
  edit: (updated: any, index: number) => void;
  remove: (index: number) => void;
};

const OrderedProducts = ({
  products,
  ordered,
  add,
  edit,
  remove
}: TOrdered) => {
  const { color, secondary, dark } = useAuthLocation();
  return (
    <StyledWrapper bckColor={color}>
      <StyledSection overflow="hidden">
        <SelectProduct
          height={/*window.innerWidth > 760*/ false ? "60vh" : "30vh"}
          products={products}
          onSelect={productID => add(productID)}
          selected={ordered}
        />
      </StyledSection>
      <StyledSection overflow="hidden">
        <ProductWithEdit bckColor={secondary}>
          <CenteredText>
            <Icons.Exchange />
          </CenteredText>
        </ProductWithEdit>
        <StyledList borderColor={dark}>
          {ordered.map((product, i) => (
            <OrderedProduct
              product={product}
              key={"selected_ordered_products_" + product.productID}
              index={i}
              edit={(value, index) =>
                edit({ productID: product.productID, amount: value }, index)
              }
              remove={index => remove(index)}
            />
          ))}
        </StyledList>
      </StyledSection>
    </StyledWrapper>
  );
};

type TOrderedProduct = {
  product: IOrderedProduct;
  edit: (updated: any, index: number) => void;
  remove: (index: number) => void;
  index: number;
};

const OrderedProduct = ({ product, edit, remove, index }: TOrderedProduct) => {
  const { productID, amount } = product;
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

  return (
    <ProductWrapper columns="4fr 2fr 1fr">
      <NameWrapper>
        <ProductName id={productID} />
      </NameWrapper>
      <InputWrapper>
        <InputButton
          side="left"
          onClick={() => amount > 1 && edit(amount - 1, index)}
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
      <FormInputButton
        onClick={e => {
          e.preventDefault();
          remove(index);
        }}
      >
        <Icons.Delete />
      </FormInputButton>
    </ProductWrapper>
  );
};

interface ProductWrapperProps {
  columns?: string;
}

export const ProductWrapper = styled.div<ProductWrapperProps>`
  display: grid;
  grid-template-columns: ${props => props.columns || "3fr 3fr 1fr"};
  height: 35px;
  padding: 0.3em;
  background-color: #e8e8e8;
  :nth-child(2n) {
    background-color: #f3f3f3;
  }

  p {
    padding: 0;
    margin: 0;
    place-self: center;
    font-size: 12px;
  }
`;

export const NameWrapper = styled.p`
  padding-left: 1em;
  margin: 0;
  text-align: start;
  align-self: center;
`;

const InputButton = styled.button`
  background-color: #fff;
  font-weight: 400;
  font-size: 16px;
  border-radius: ${(props: { side: string }) => {
    if (props.side === "left") return "0.5em 0 0 0.5em";
    else if (props.side === "right") return "0 0.5em 0.5em 0";
  }};
  border-radius: 0;
`;

const InputField = styled.input`
  width: 100%;
  border: 1px solid #aaa;
  text-align: center;
  border: none;
  margin: 0;

  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const InputWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 2fr 1.5fr;
  padding: 0.2em;
`;

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
  grid-template-rows: 35px 175px;
  overflow-y: hidden;
  overflow-x: hidden;
  :hover {
    overflow-y: ${(props: { overflow: string }) => props.overflow};
  }
  ${device.tablet(`
    grid-template-rows: 35px 465px;
  `)}
`;

export default OrderedProducts;
