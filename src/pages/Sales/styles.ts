import styled from "styled-components";
import { TableItem } from "../../styles/table";

export const SaleWrapper = styled(TableItem)`
  grid-template-columns: repeat(4, 15%) repeat(5, 8%);
`

export const HeaderButton = styled.button`
  height: 75%;
  width: 75%;
  border-radius: 15px;
`