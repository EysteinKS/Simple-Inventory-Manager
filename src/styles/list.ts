import styled from "styled-components";
import { verticalScroll } from "./scroll";

interface BorderColorProps {
  borderColor: string;
}

export const BasicListItem = styled.div``;

export const StyledList = styled.div<BorderColorProps>`
  max-height: 55vh;
  border-left: 5px solid ${props => props.borderColor};
  ${verticalScroll}
`;
