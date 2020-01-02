import React, { useState } from "react";
import ReactModal from "react-modal";
import useMargin from "../../hooks/useMargin";
import useAuthLocation from "../../hooks/useAuthLocation";
import {
  ModalHeader,
  ModalTitle,
  ModalButton,
  ModalContent
} from "../../styles/modal";
import Icons from "./Icons";
import styled from "styled-components";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

ReactModal.setAppElement("#root");

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: (d: Date) => void;
  getDate?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onClose,
  onConfirm,
  getDate = false
}) => {
  const modalWidth = 250;
  const borderWidth = 4;
  const sideMargin = useMargin(modalWidth, borderWidth);
  const { color } = useAuthLocation();

  const [date, setDate] = useState<Date | null>(new Date());

  const confirm = () => {
    date && onConfirm(date);
    onClose();
  };

  return (
    <ReactModal
      isOpen={isOpen}
      contentLabel={title}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      onRequestClose={onClose}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          zIndex: "10"
        },
        content: {
          top: "10vh",
          bottom: "auto",
          left: `${sideMargin}px`,
          right: `${sideMargin}px`,
          padding: "0",
          background: "white",
          width: `${modalWidth}px`,
          display: "grid",
          gridTemplateRows: "30px auto",
          border: `${borderWidth}px solid ${color}`
        }
      }}
    >
      <ModalHeader bckColor={color}>
        <ModalTitle>
          {"  "}
          {title}
        </ModalTitle>
        <ModalButton onClick={() => onClose()}>
          <Icons.Close />
        </ModalButton>
      </ModalHeader>
      <ModalContent>
        <ConfirmContent>
          {getDate && (
            <DateWrapper>
              <ReactDatePicker
                selected={date}
                onChange={setDate}
                maxDate={new Date()}
                dateFormat={"dd/MM/yyyy"}
                showPopperArrow={false}
              />
            </DateWrapper>
          )}
          <p>{message}</p>
          <ModalButton onClick={confirm}>
            <Icons.Check />
          </ModalButton>
        </ConfirmContent>
      </ModalContent>
    </ReactModal>
  );
};

const ConfirmContent = styled.div`
  display: grid;
  grid-template-columns: 6fr 1fr;

  p {
    margin: 0;
    padding: 1em 0.5em;
  }
`;

const DateWrapper = styled.div`
  grid-column: span 2;
  height: auto;
  margin-top: 1em;

  .react-datepicker-wrapper {
    width: 80% !important;
    padding: 0 10% !important;

    div > input {
      width: 100%;
    }
  }

  .react-datepicker-popper {
    position: relative !important;
    transform: none !important;

    .react-datepicker {
      border-left: none !important;
      border-right: none !important;
      width: 100% !important;

      & > :nth-child(1) {
        display: none !important;
        border-top: none !important;
      }

      .react-datepicker__month-container {
        width: 100%;
      }
    }
  }
`;

export default ConfirmModal;
