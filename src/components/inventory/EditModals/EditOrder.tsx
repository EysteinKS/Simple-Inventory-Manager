import React, { useState, useMemo, useEffect } from "react";
import { RootState, IOrder } from "../../../redux/types";
import { useSelector } from "react-redux";
import useEditableList from "../../../hooks/useEditableList";
import { isChanged } from "../../../constants/util";
import ReactModal from "react-modal";
import OrderedProducts from "../OrderedProducts";
import SelectTarget from "../SelectTarget";
import EditModal, { OrderedProduct } from "./EditModal";
import Names from "../../Names";
import Icons from "../../util/Icons";
import { ProductWithEdit, CenteredText } from "./styles";
import useProducts from "../../../hooks/useProducts";
import useAuthLocation from "../../../hooks/useAuthLocation";
import {
  ModalHeader,
  ModalTitle,
  ModalButton,
  ModalSubtitle,
  ModalContent,
  ModalFooter,
  TitleWrapper
} from "../../../styles/modal";
import {
  InputWrapper,
  InputLabel,
  InputButton,
  FakeInput
} from "../../../styles/form";
import { StyledList } from "../../../styles/list";
import useOrders from "../../../redux/hooks/useOrders";

ReactModal.setAppElement("#root");

type TEditOrder = {
  isOpen: boolean;
  close: () => void;
};

type ViewTypes = "details" | "supplier" | "products";

export default function EditOrder({ isOpen, close }: TEditOrder) {
  const { currentOrder, saveCreatedOrder, saveEditedOrder } = useOrders();

  const [supplier, setSupplier] = useState();
  const [view, setView] = useState("details" as ViewTypes);

  const suppliers = useSelector(
    (state: RootState) => state.suppliers.suppliers
  );
  const [products, setSupplierProducts] = useProducts();
  const { color, secondary, dark } = useAuthLocation();

  useEffect(() => {
    if (supplier !== null && typeof supplier === "number") {
      const thisSupplier =
        suppliers[suppliers.findIndex(s => s.supplierID === supplier)];
      if (
        "products" in thisSupplier &&
        thisSupplier.products &&
        thisSupplier.products.length > 0
      ) {
        setSupplierProducts(thisSupplier.products);
      } else {
        setSupplierProducts([]);
      }
    }
  }, [supplier, suppliers, setSupplierProducts]);

  const viewText = useMemo(() => {
    switch (view) {
      case "details":
        return "Bestilling";
      case "supplier":
        return "Leverandør";
      case "products":
        return "Produkter";
      default:
        return "";
    }
  }, [view]);

  const {
    list: ordered,
    add: addProduct,
    edit: editProduct,
    remove: removeProduct,
    replace: setOrdered
  } = useEditableList(currentOrder.ordered);

  const [init, setInit] = useState(false);
  if (isOpen && !init) {
    setSupplier(currentOrder.supplierID);
    setOrdered(currentOrder.ordered);
    setInit(true);
  }

  const save = () => {
    let returnedOrder: IOrder = {
      orderID: currentOrder.orderID,
      supplierID: Number(supplier),
      dateOrdered: currentOrder.dateOrdered,
      dateReceived: currentOrder.dateReceived,
      ordered
    };
    if (currentOrder.isNew) {
      saveCreatedOrder(returnedOrder);
    } else {
      let isOrderChanged = isChanged(currentOrder, returnedOrder);
      if (!isOrderChanged.isEqual) {
        saveEditedOrder(returnedOrder, isOrderChanged.changed);
      }
    }
    close();
    setInit(false);
  };

  return (
    <EditModal
      isOpen={isOpen}
      label="Edit Order"
      onClose={close}
      fullWidth={view === "products"}
    >
      <ModalHeader
        bckColor={color}
        padBottom="7px"
        columns={view === "details" ? "6fr 1fr" : "5fr 1fr 1fr"}
      >
        <TitleWrapper>
          <ModalTitle>
            <Icons.Orders /> Bestilling #{currentOrder.orderID}{" "}
          </ModalTitle>
          {view !== "details" && <ModalSubtitle>{viewText}</ModalSubtitle>}
        </TitleWrapper>
        {view !== "details" && (
          <ModalButton sideBorder="right" onClick={() => setView("details")}>
            <Icons.ArrowBack />
          </ModalButton>
        )}
        <ModalButton onClick={close}>
          <Icons.Close />
        </ModalButton>
      </ModalHeader>
      <ModalContent>
        {view === "details" && (
          <>
            <InputWrapper>
              <InputLabel>
                <Icons.Suppliers /> Leverandør
              </InputLabel>
              <FakeInput onClick={() => setView("supplier")}>
                <Names target="suppliers" id={supplier} />
                <Icons.Edit />
              </FakeInput>
            </InputWrapper>
            <ProductWithEdit>
              <CenteredText>Produkter</CenteredText>
              <InputButton
                onClick={() => setView("products")}
                bckColor={secondary}
              >
                <Icons.Products />
                <Icons.List />
              </InputButton>
            </ProductWithEdit>
            <StyledList borderColor={dark}>
              {ordered.map(product => (
                <OrderedProduct
                  key={"ordered_product_" + product.productID}
                  product={product}
                />
              ))}
            </StyledList>
          </>
        )}
        {view === "supplier" && (
          <SelectTarget
            type="suppliers"
            select={id => {
              setSupplier(id);
              setView("details");
            }}
          />
        )}
        {view === "products" && (
          <OrderedProducts
            products={products}
            ordered={ordered}
            add={productID => addProduct({ productID, amount: 1 })}
            edit={(product, index) => editProduct(product, index)}
            remove={productID => removeProduct(productID)}
          />
        )}
      </ModalContent>
      <ModalFooter bckColor={secondary}>
        <ModalButton
          onClick={save}
          disabled={
            supplier === "new" || view === "supplier" || ordered.length < 1
          }
        >
          <Icons.Save />
        </ModalButton>
      </ModalFooter>
    </EditModal>
  );
}
