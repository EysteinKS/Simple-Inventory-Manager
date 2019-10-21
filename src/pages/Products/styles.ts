import styled from "styled-components";
import { TableItem } from "../../styles/table";

export const ProductList = styled.div`

`

type TStyledProduct = {
  active: boolean
  hasLoans: boolean
}

export const StyledProduct = styled(TableItem)`
  width: 100%;
  grid-template-columns: 10% 19% 19% repeat(4, 8%) 6% 7% 7%;
  ${(props: TStyledProduct) => {
    const { hasLoans } = props
    if(hasLoans) return `
    grid-template-columns: 10% 19% 19% repeat(5, 7%) 5% 6% 6%`
  }}
  ${(props: TStyledProduct) => {
    const { active } = props
    if(!active) return `
    background-color: #FDE5E5 !important
    color: rgb(190, 190, 190)`
  }};
  & > p {
    margin: 16px;
  }
`

export const ProductName = styled.p`
  justify-self: left;
`

export const ProductCategory = styled.p`
  justify-self: left;
`

export const AmountField = styled.p`
  width: 80%;
  text-align: center;
  :hover {
    cursor: help;
  }
`