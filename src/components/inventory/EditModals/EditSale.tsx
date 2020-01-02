import React, { useState, useMemo } from "react";
import { RootState, ISale } from "../../../redux/types";
import { useSelector, useDispatch } from "react-redux";
import useEditableList from "../../../hooks/useEditableList";
import { addChange } from "../../../redux/actions/reportsActions";
import { isChanged, shouldLog } from "../../../constants/util";
import ReactModal from "react-modal";
import OrderedProducts from "../OrderedProducts";
import SelectTarget from "../SelectTarget";
import EditModal, { OrderedProduct } from "./EditModal";
import Names from "../../Names";
import Icons from "../../util/Icons";
import { ProductWithEdit, CenteredText } from "./styles";
import {
  saveCreatedSale,
  saveEditedSale
} from "../../../redux/actions/salesActions";
import useProducts from "../../../hooks/useProducts";
import useAuthLocation from "../../../hooks/useAuthLocation";
import {
  ModalFooter,
  ModalHeader,
  ModalButton,
  ModalTitle,
  ModalSubtitle,
  ModalContent,
  TitleWrapper
} from "../../../styles/modal";
import { StyledList } from "../../../styles/list";
import {
  InputWrapper,
  FakeInput,
  InputLabel,
  InputButton
} from "../../../styles/form";
import {
  addNotification,
  notifications
} from "../../../redux/actions/notificationActions";

ReactModal.setAppElement("#root");

type TEditSale = {
  isOpen: boolean;
  close: () => void;
};

type ViewTypes = "details" | "customer" | "products";

export default function EditSale({ isOpen, close }: TEditSale) {
  const current = useSelector(
    (state: RootState) => state.sales.currentSale
  ) as ISale;
  const [products] = useProducts();
  const dispatch = useDispatch();

  const { color, secondary, dark } = useAuthLocation();

  const [customer, setCustomer] = useState();
  const [view, setView] = useState("details" as ViewTypes);

  const viewText = useMemo(() => {
    switch (view) {
      case "details":
        return "Salg";
      case "customer":
        return "Kunde";
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
  } = useEditableList(current.ordered);

  const [init, setInit] = useState(false);
  if (isOpen && !init) {
    setCustomer(current.customerID);
    setOrdered(current.ordered);
    setInit(true);
  }

  const save = () => {
    let returnedSale: ISale = {
      saleID: current.saleID,
      customerID: Number(customer),
      dateOrdered: current.dateOrdered,
      dateSent: current.dateSent,
      ordered
    };
    if (current.isNew) {
      dispatch(
        addChange({
          type: "NEW_SALE",
          id: returnedSale.saleID,
          section: "sales"
        })
      );
      dispatch(saveCreatedSale(returnedSale));
      dispatch(addNotification(notifications.addedChange()));
    } else {
      let isSaleChanged = isChanged(current, returnedSale);
      if (!isSaleChanged.isEqual) {
        shouldLog("Changed loan content", isSaleChanged.changed);
        dispatch(
          addChange({
            type: "EDIT_SALE_INFO",
            id: returnedSale.saleID,
            section: "loans",
            changed: isSaleChanged.changed
          })
        );
        dispatch(saveEditedSale(returnedSale));
        dispatch(addNotification(notifications.addedChange()));
      }
    }
    close();
    setInit(false);
  };

  return (
    <EditModal
      isOpen={isOpen}
      label="Edit Sale"
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
            <Icons.Sales /> Salg #{current.saleID}{" "}
          </ModalTitle>
          {view !== "details" && <ModalSubtitle>{viewText}</ModalSubtitle>}
        </TitleWrapper>
        {view !== "details" && (
          <ModalButton sideBorder="right" onClick={() => setView("details")}>
            <Icons.ArrowBack />
          </ModalButton>
        )}
        <ModalButton
          onClick={() => {
            close();
            setInit(false);
          }}
        >
          <Icons.Close />
        </ModalButton>
      </ModalHeader>
      <ModalContent>
        {view === "details" && (
          <>
            <InputWrapper>
              <InputLabel>
                <Icons.Customers /> Kunde
              </InputLabel>
              <FakeInput onClick={() => setView("customer")}>
                <Names target="customers" id={customer} />
                <Icons.Edit />
              </FakeInput>
            </InputWrapper>

            <ProductWithEdit>
              <CenteredText>Produkter</CenteredText>
              <InputButton
                bckColor={secondary}
                onClick={() => setView("products")}
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
        {view === "customer" && (
          <SelectTarget
            type="customers"
            select={id => {
              setCustomer(id);
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
            customer === "new" || view === "customer" || ordered.length < 1
          }
        >
          <Icons.Save />
        </ModalButton>
      </ModalFooter>
    </EditModal>
  );
}
