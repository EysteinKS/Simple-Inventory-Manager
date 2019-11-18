import styled from "styled-components";
import { TableItem } from "../../styles/table";

export const OrderWrapper = styled(TableItem)`
  grid-template-columns: 10% 15% 15% 10% 26% repeat(4, 6%);
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
