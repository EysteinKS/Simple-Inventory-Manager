import styled from "styled-components";

interface BckColorProps {
  bckColor: string;
}

export const StyledHeader = styled.header<BckColorProps>`
  padding: 10px;
  display: grid;
  grid-template-columns: 50px 1fr 50px;
  background-color: ${props => props.bckColor};
`;

export const StyledDetails = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(3, 1fr) 8fr;
  column-gap: 1em;
`;

export const ModalFooter = styled.footer`
  display: flex;
  justify-content: flex-end;
`;

export const StyledFooter = styled.footer`
  display: grid;
  grid-template-columns: 3fr 1fr 1fr;
  margin-top: 20px;
`;

export const CenteredText = styled.p`
  text-align: center;
  margin: 0;
  place-self: center;
`;

export const EndText = styled.p`
  text-align: end;
`;

export const TargetWithEdit = styled.div`
  display: grid;
  grid-template-columns: 4fr 1fr;
`;

export const ProductWithEdit = styled.div`
  display: grid;
  grid-template-columns: 2fr 5fr 2fr;
  padding: 0.5em;
  background: ${(props: { bckColor?: string }) => props.bckColor || "white"};

  :before {
    content: "";
  }
`;

export const IDText = styled(CenteredText)`
  grid-column: 1/3;
`;

export const ProductList = styled.div`
  max-height: 43vh;
  overflow: overlay;
`;
