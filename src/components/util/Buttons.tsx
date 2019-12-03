import React, { FC } from "react";
import styled from "styled-components";

type TConfirm = {
  message: string;
  onConfirm: Function;
  disabled?: boolean;
  border?: string;
};

const Confirm: FC<TConfirm> = ({
  children,
  message,
  onConfirm,
  disabled = false,
  ...rest
}) => {
  return (
    <StyledButton
      onClick={e => {
        if (window.confirm(message)) {
          onConfirm();
        }
        e.currentTarget.blur();
      }}
      disabled={disabled}
      {...rest}
    >
      {children}
    </StyledButton>
  );
};

type TClick = {
  onClick: () => void;
  border?: string;
};

const Click: FC<TClick> = ({ children, onClick, ...rest }) => {
  return (
    <StyledButton
      onClick={e => {
        e.currentTarget.blur();
        onClick();
      }}
      {...rest}
    >
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button`
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
  background: #eee4;
  color: #000b;
  border: none;
  border-left: 1px solid #0001;
  :hover {
    color: #0008;
  }
  :focus {
    outline: none;
  }
  :disabled {
    color: #0003;
    cursor: not-allowed;
  }
`;

export default {
  Confirm,
  Click
};
