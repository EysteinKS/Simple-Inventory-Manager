import React from 'react'
import ReactModal from "react-modal";
import { IOrderedProduct } from '../../../redux/types';
import ProductName from '../ProductName';
ReactModal.setAppElement("#root");

interface IProps {
  isOpen: boolean
  label: string
  onClose: () => void
  rows?: string
}

const defaultRows = "10vh 60vh 10vh"

const EditModal: React.FC<IProps> = ({
  isOpen, label, onClose, 
  rows = defaultRows, children
}) => {
  return (
    <ReactModal
      isOpen={isOpen}
      contentLabel={label}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      onRequestClose={onClose}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)"
        },
        content: {
          top: "10vh",
          left: "5vw",
          right: "5vw",
          padding: "10px",
          display: "grid",
          gridTemplateRows: rows
        }
      }}
    >
      {children}
    </ReactModal>
  )
}

interface OrderedProductProps {
  product: IOrderedProduct
}

export const OrderedProduct: React.FC<OrderedProductProps> = ({ product }) => {
  return(
    <div style={{display: "grid", gridTemplateColumns: "1fr"}}>
      <p style={{ placeSelf: "center" }}>
        <span><ProductName id={product.productID}/></span>
        <span>  x{product.amount}</span>
      </p>
    </div>
  )
}

export default EditModal