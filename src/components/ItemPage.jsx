import React, {useState} from 'react'
import ReactModal from "react-modal"
ReactModal.setAppElement("#root");

export default function ItemPage({
  isOpen,
  label,
  newTitle,
  editTitle,
  isNew,
  EditableView,
  StaticView,
  onClose,
  onSave
}) {
  const [isEditing, setEditing] = useState(false)

  let modalStyle = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)"
    },
    content: {
      top: "20vh",
      left: "5vw",
      right: "5vw",
      bottom: "10vh",
      display: "grid",
      gridTemplateRows: "1fr 8fr 1fr"
    }
  }

  const ModalHeader = () => {
    const headerStyle = {
      gridRow: "1/2",
      display: "grid",
      gridTemplateColumns: "1fr 4fr 1fr",
      justifyContent: "center",
      alignItems: "center"
    }

    return(
      <header style={headerStyle}>
        <h3 style={{gridColumn: "2/3"}}>{isNew ? newTitle : editTitle}</h3>
        <button style={{gridColumn: "3/4"}} onClick={() => setEditing(state => !state)}>Edit</button>
      </header>
    )
  }

  return (
    <ReactModal
      isOpen={isOpen}
      contentLabel={label}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      style={modalStyle}
      onRequestClose={onClose}
    >
      <ModalHeader/>
      {(isNew || isEditing)
        ? <EditableView/>
        : <StaticView/>}
      <ButtonFooter onSave={onSave} onClose={onClose}/>
    </ReactModal>
  )
}

const ButtonFooter = ({onClose, onSave}) => {
  const footerStyle = {
    gridRow: "3/4",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    alignItems: "center"
  }
  return(
    <footer style={footerStyle}>
      <CloseButton {...onClose}/>
      <SaveButton {...onSave}/>
    </footer>
  )
}

const CloseButton = ({onClose}) => {
  return(
    <button onClick={onClose} style={{justifySelf: "end"}}>Lukk</button>
  )
}

const SaveButton = ({onSave}) => {
  return(
    <button onClick={onSave} style={{justifySelf: "start"}}>Lagre</button>
  )
}