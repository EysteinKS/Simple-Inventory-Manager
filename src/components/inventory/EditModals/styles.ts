import styled from "styled-components";

export const StyledHeader = styled.header`
  padding: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
`;

export const StyledDetails = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(3, 1fr) 8fr;
  column-gap: 1em;
`;

export const StyledFooter = styled.footer`
  display: grid;
  grid-template-columns: 3fr 1fr 1fr;
  margin-top: 20px;
`;

export const CenteredText = styled.p`
  text-align: center;
`;

export const EndText = styled.p`
  text-align: end;
`;

export const TargetWithEdit = styled.div`
  display: grid;
  grid-template-columns: 4fr 1fr;
`;

export const ProductWithEdit = styled.div`
  grid-column: 1/3;
  display: grid;
  grid-template-columns: 1fr 8fr 1fr;
`;

export const IDText = styled(CenteredText)`
  grid-column: 1/3;
`;

export const ProductList = styled.div`
  grid-column: 1 / 3;
  height: 43vh;
  overflow: overlay;
`;
