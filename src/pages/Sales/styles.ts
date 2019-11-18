import styled from "styled-components";
import { TableItem } from "../../styles/table";

export const SaleWrapper = styled(TableItem)`
  grid-template-columns: 10% 15% 15% 10% 26% repeat(4, 6%);
  
`;

export const HeaderButton = styled.button`
  height: 75%;
  width: 75%;
  border-radius: 15px;
`;
