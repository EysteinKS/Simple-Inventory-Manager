import styled from "styled-components";

interface BckColorProps {
  bckColor: string;
}

const NewModalButton = styled.button`
  background: none;
  border: none;
  :focus {
    outline: none;
  }
  :hover {
    cursor: pointer;
    color: #0008;
  }
`;

export const NewModalHeader = styled.div`
  display: grid;
  grid-template-columns: 6fr 1fr;
  border-bottom: 2px solid #0002;
  ${(props: BckColorProps) => `
    background: ${props.bckColor};
  `}
`;

export const NewModalTitle = styled.h3`
  margin: 0;
  align-self: center;
  justify-self: start;
  padding-left: 0.5em;
  color: #000b;
`;

export const CloseNewModal = styled(NewModalButton)``;

export const NewModalContent = styled.div`
  display: grid;
  grid-template-columns: 6fr 1fr;
`;

export const NameInput = styled.input`
  font-size: 16px;
  margin: 0;
  padding-left: 1em;
  border: 1px solid #0002;
  border-top: none;
  border-left: none;
  :focus {
    outline: none;
  }
`;

export const NewModalMessage = styled.p`
  color: #8a0000;
  margin: 0;
  align-self: center;
  justify-self: start;
`;

export const NewModalFooter = styled.div`
  display: grid;
  height: 50px;
  justify-content: center;
  background: #f7cbcb;
`;

export const SaveNewModal = styled(NewModalButton)`
  border-bottom: 1px solid #0002;
  ${(props: BckColorProps) => `
    background: ${props.bckColor};
  `}
`;
