import React from "react";
import ReactModal from "react-modal";
import { IOrderedProduct } from "../../../redux/types";
import ProductName from "../ProductName";
import useMargin from "../../../hooks/useMargin";
import useAuthLocation from "../../../hooks/useAuthLocation";
import { ProductWrapper } from "../OrderedProducts";
ReactModal.setAppElement("#root");

interface IProps {
  isOpen: boolean;
  label: string;
  onClose: () => void;
  rows?: string;
  modalWidth?: number;
  fullWidth?: boolean;
}

const defaultRows = "40px auto 40px";

const EditModal: React.FC<IProps> = ({
  isOpen,
  label,
  onClose,
  rows = defaultRows,
  children,
  modalWidth = 350,
  fullWidth = false
}) => {
  modalWidth =
    window.innerWidth >= modalWidth ? modalWidth : window.innerWidth - 14;
  if (window.innerWidth >= 768 && fullWidth) {
    modalWidth = 700;
  }
  const borderWidth = 7;
  const sideMargin = useMargin(modalWidth, borderWidth);
  const { color } = useAuthLocation();

  return (
    <ReactModal
      isOpen={isOpen}
      contentLabel={label}
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
          width: `${modalWidth}px`,
          padding: "0",
          display: "grid",
          gridTemplateRows: rows,
          border: `${borderWidth}px solid ${color}`
        }
      }}
    >
      {children}
    </ReactModal>
  );
};

interface OrderedProductProps {
  product: IOrderedProduct;
}

export const OrderedProduct: React.FC<OrderedProductProps> = ({ product }) => {
  return (
    <ProductWrapper columns="1fr 1fr">
      <p>
        <ProductName id={product.productID} />
      </p>
      <p>{product.amount}x</p>
    </ProductWrapper>
  );
};

interface SelectedProductProps {
  id: number;
}

export const SelectedProduct: React.FC<SelectedProductProps> = ({ id }) => {
  return (
    <ProductWrapper columns="1fr">
      <p>
        <ProductName id={id} />
      </p>
    </ProductWrapper>
  );
};

export default EditModal;
