import styled from "styled-components";

interface BckColorProps {
  bckColor: string;
}

interface ModalHeaderProps extends BckColorProps {
  padBottom?: string;
  columns?: string;
}

export const ModalHeader = styled.div<ModalHeaderProps>`
  display: grid;
  grid-template-columns: ${props => props.columns || "6fr 1fr"};
  border-bottom: 2px solid #0002;
  ${props => `
    background: ${props.bckColor};
  `}
  ${props => props.padBottom && `padding-bottom: ${props.padBottom};`}
`;

export const ModalContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
`;

export const ModalFooter = styled.footer<BckColorProps>`
  display: flex;
  justify-content: flex-end;
  background-color: ${props => props.bckColor};

  button {
    width: 33%;
  }
`;

export const TitleWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: flex-start;
`;

export const ModalTitle = styled.h3`
  margin: 0;
  align-self: center;
  justify-self: start;
  color: #000b;
  font-size: medium;
`;

export const ModalSubtitle = styled.h6`
  margin: 0;
  padding: 0;
  padding-left: 0.5em;
  display: inline-block;
  color: #000b;
  align-self: center;
`;

interface ModalButtonProps {
  btnWidth?: string;
  bckColor?: string;
  sideBorder?: "left" | "right";
}

export const ModalButton = styled.button<ModalButtonProps>`
  height: 100%;
  width: ${props => props.btnWidth || "100%"};
  background: ${props => props.bckColor || "none"};
  border: none;
  ${props =>
    props.sideBorder && props.sideBorder === "left"
      ? "border-left: 1px solid #0002;"
      : props.sideBorder === "right"
      ? "border-right: 1px solid #0002;"
      : null}
  color: #000;
  :focus {
    outline: none;
  }
  :hover {
    cursor: pointer;
    color: #0008;
  }
  :disabled {
    color: #0003;
    cursor: not-allowed;
    background: #0004;
  }
`;
