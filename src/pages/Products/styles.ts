import styled from "styled-components";
import { TableItem } from "../../styles/table";

export const ProductList = styled.div``;

type TStyledProduct = {
  active: boolean;
};

export const StyledProduct = styled(TableItem)`
  ${(props: TStyledProduct) => {
    const { active } = props;
    if (!active)
      return `
    background-color: #FDE5E5 !important
    color: rgb(190, 190, 190)`;
  }};
`;

export const ProductName = styled.p`
  justify-self: left;
`;

export const ProductCategory = styled.p`
  justify-self: left;
`;

export const AmountField = styled.p`
  width: 80%;
  text-align: center;
  :hover {
    cursor: help;
  }
`;
