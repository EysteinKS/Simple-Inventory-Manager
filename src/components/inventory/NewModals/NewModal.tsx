import React from "react";
import ReactModal from "react-modal";
import {
  NewModalHeader,
  NewModalTitle,
  CloseNewModal,
  NewModalContent,
  NewModalFooter,
  NameInput,
  NewModalMessage,
  SaveNewModal
} from "./styles";
import Icons from "../../util/Icons";
import useMargin from "../../../hooks/useMargin";
import useAuthLocation from "../../../hooks/useAuthLocation";
ReactModal.setAppElement("#root");

interface NewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  name: string;
  setName: (name: string) => void;
  message: string;
  onSave: () => void;
}

const NewModal: React.FC<NewModalProps> = ({
  isOpen,
  onClose,
  title,
  name,
  setName,
  onSave,
  message
}) => {
  const modalWidth = window.innerWidth >= 364 ? 350 : window.innerWidth - 14;
  const borderWidth = 7;
  const sideMargin = useMargin(modalWidth, borderWidth);

  const { color, secondary } = useAuthLocation();

  return (
    <ReactModal
      isOpen={isOpen}
      contentLabel="New Supplier"
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      onRequestClose={onClose}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          zIndex: "10"
        },
        content: {
          top: "30vh",
          bottom: "auto",
          left: `${sideMargin}px`,
          right: `${sideMargin}px`,
          padding: "0",
          background: "white",
          width: `${modalWidth}px`,
          display: "grid",
          gridTemplateRows: "50px 50px auto",
          border: `${borderWidth}px solid ${color}`
        }
      }}
    >
      <NewModalHeader bckColor={color as string}>
        <NewModalTitle>{title}</NewModalTitle>
        <CloseNewModal onClick={onClose}>
          <Icons.Close />
        </CloseNewModal>
      </NewModalHeader>
      <NewModalContent>
        <NameInput
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Skriv inn navnet her..."
          maxLength={30}
        />
        <SaveNewModal onClick={onSave} bckColor={secondary}>
          <Icons.Save />
        </SaveNewModal>
      </NewModalContent>
      {message && (
        <NewModalFooter>
          <NewModalMessage>{message}</NewModalMessage>
        </NewModalFooter>
      )}
    </ReactModal>
  );
};

export default NewModal;
