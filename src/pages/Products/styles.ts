import styled from "styled-components";
import { TableItem, NewTableItem } from "../../styles/table";

export const ProductList = styled.div``;

type TStyledProduct = {
  active: boolean;
  hasLoans: boolean;
};

export const NewStyledProduct = styled(NewTableItem)`
  ${(props: { active: boolean }) => {
    const { active } = props;
    if (!active)
      return `
    background-color: #FDE5E5 !important
    color: rgb(190, 190, 190)`;
  }};
`;

export const StyledProduct = styled(TableItem)`
  width: 100%;
  grid-template-columns: 10% 20% 15% repeat(4, 7%) 15% 6% 6%;
  ${(props: TStyledProduct) => {
    const { hasLoans } = props;
    if (hasLoans)
      return `
    grid-template-columns: 10% 20% 15% repeat(5, 7%) 8% 6% 6%`;
  }}
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
