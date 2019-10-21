import styled from "styled-components";
import { TableItem } from "../../styles/table";

export const OrderWrapper = styled(TableItem)`
  grid-template-columns: repeat(4, 15%) 10% repeat(4, 7.5%);
`;

export const OrderTime = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 50% 50%;
  justify-items: center;
`;

export const OrderContent = styled.div`
  display: grid;
  justify-items: center;
`;
