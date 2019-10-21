import styled, { css } from "styled-components";

export const TableWrapper = styled.div`
  margin: 5vh 10vw 10vh;
`;

export const TableItem = styled.div`
  display: grid;
  justify-items: center;
  background-color: ${(props: { index: number }) => {
    if (props.index % 2 === 0) {
      return "#E2E2E2";
    } else {
      return "#F3F3F3";
    }
  }};
`;

export const ExpandedTableItem = styled.div`
  ${(props: { expanded: boolean }) =>
    props.expanded
      ? css`
          display: grid;
          padding: 10px;
          background-color: #e6e6e6;
          place-items: center;
        `
      : css`
          display: none;
        `}
`;
