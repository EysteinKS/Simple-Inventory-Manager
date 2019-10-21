import styled from "styled-components";

export const HeaderWrapper = styled.header`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  height: 5.1vh;
  width: 100%;
  column-gap: 2px;
  justify-items: center;
  border-bottom: 2px solid gray;
  background-color: ${(props: { bckColor: string }) => props.bckColor};
  position: fixed;
  top: 0;
  z-index: 10;
`;

export const UserWrapper = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 4fr 2fr;
  place-items: center;
`;

export const NoMargin = styled.div`
  & > * {
    margin: 0;
  }
`;

export const SectionText = styled.h4`
  margin: 0;
  padding: 0;
  align-self: center;
  justify-self: center;
`;
