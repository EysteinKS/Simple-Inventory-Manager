import React, { useState, useMemo } from "react";
import { RootState, ILoan } from "../../../redux/types";
import { useSelector } from "react-redux";
import useEditableList from "../../../hooks/useEditableList";
import { isChanged, shouldLog } from "../../../constants/util";
import OrderedProducts from "../OrderedProducts";
import SelectTarget from "../SelectTarget";
import EditModal, { OrderedProduct } from "./EditModal";
import Names from "../../Names";
import Icons from "../../util/Icons";
import { ProductWithEdit, CenteredText } from "./styles";
import useProducts from "../../../hooks/useProducts";
import useLoans from "../../../redux/hooks/useLoans";
import useAuthLocation from "../../../hooks/useAuthLocation";
import {
  ModalButton,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalSubtitle,
  ModalContent,
  TitleWrapper
} from "../../../styles/modal";
import { StyledList } from "../../../styles/list";
import {
  InputButton,
  InputWrapper,
  InputLabel,
  FakeInput
} from "../../../styles/form";

type TEditLoan = {
  isOpen: boolean;
  close: () => void;
};

type ViewTypes = "details" | "customer" | "products";

export default function EditLoan({ isOpen, close }: TEditLoan) {
  const current = useSelector(
    (state: RootState) => state.loans.currentLoan
  ) as ILoan;
  const [products] = useProducts();

  const { saveCreatedLoan, saveEditedLoan } = useLoans();
  const { color, secondary, dark } = useAuthLocation();

  const [customer, setCustomer] = useState();
  const [view, setView] = useState("details" as ViewTypes);

  const viewText = useMemo(() => {
    switch (view) {
      case "details":
        return "Utlån";
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
    let returnedLoan: ILoan = {
      loanID: current.loanID,
      customerID: Number(customer),
      dateOrdered: current.dateOrdered,
      dateSent: current.dateSent,
      dateReceived: current.dateReceived,
      ordered
    };
    if (current.isNew) {
      saveCreatedLoan(returnedLoan);
    } else {
      let isLoanChanged = isChanged(current, returnedLoan);
      if (!isLoanChanged.isEqual) {
        shouldLog("Changed loan content", isLoanChanged.changed);
        saveEditedLoan(returnedLoan, isLoanChanged.changed);
      }
    }
    close();
    setInit(false);
  };

  return (
    <EditModal
      isOpen={isOpen}
      label="Edit Loan"
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
            <Icons.Loans /> Utlån #{current.loanID}{" "}
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
