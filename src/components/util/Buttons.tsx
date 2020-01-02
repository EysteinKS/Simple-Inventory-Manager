import React, { FC, useState } from "react";
import styled from "styled-components";
import ConfirmModal from "./ConfirmModal";

type TConfirm = {
  message: string;
  title?: string;
  onConfirm: (d: Date) => void;
  getDate?: boolean;
  disabled?: boolean;
  border?: string;
};

const Confirm: FC<TConfirm> = ({
  children,
  message,
  title = "",
  onConfirm,
  getDate,
  disabled = false,
  ...rest
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  return (
    <>
      <StyledButton
        onClick={() => setModalOpen(true)}
        disabled={disabled}
        {...rest}
      >
        {children}
      </StyledButton>
      {isModalOpen && (
        <ConfirmModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={onConfirm}
          title={title}
          message={message}
          getDate={getDate}
        />
      )}
    </>
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

    svg {
      color: #0003;
      cursor: not-allowed;
    }
  }
`;

export default {
  Confirm,
  Click
};
