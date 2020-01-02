import React, { useMemo, useState } from "react";
import { ISupplier } from "../../redux/types";
import useProducts from "../../hooks/useProducts";
import useEditableList from "../../hooks/useEditableList";
import { shouldLog, isChanged } from "../../constants/util";
import { useDispatch } from "react-redux";
import { addChange } from "../../redux/actions/reportsActions";
import { saveEditedSupplier } from "../../redux/actions/suppliersActions";
import {
  ProductWithEdit,
  CenteredText
} from "../../components/inventory/EditModals/styles";
import SuppliersProducts from "../../components/inventory/SuppliersProducts";
import EditModal, {
  SelectedProduct
} from "../../components/inventory/EditModals/EditModal";
import useAuthLocation from "../../hooks/useAuthLocation";
import {
  ModalHeader,
  ModalTitle,
  ModalSubtitle,
  ModalButton,
  ModalFooter,
  ModalContent,
  TitleWrapper
} from "../../styles/modal";
import Icons from "../../components/util/Icons";
import {
  InputWrapper,
  InputLabel,
  TextInput,
  InputButton
} from "../../styles/form";
import { StyledList } from "../../styles/list";
import {
  notifications,
  addNotification
} from "../../redux/actions/notificationActions";

interface EditSupplierProps {
  supplier: ISupplier;
  back?: () => void;
  close: () => void;
}

const EditSupplier: React.FC<EditSupplierProps> = ({
  supplier,
  back,
  close
}) => {
  const [products] = useProducts();
  const supplierProducts = useMemo(() => {
    if (supplier.products) {
      return supplier.products;
    } else {
      return [] as number[];
    }
  }, [supplier]);

  const [view, setView] = useState("details" as "details" | "products");
  const { color, secondary, dark } = useAuthLocation();

  const { list, add: addProduct, remove: removeProduct } = useEditableList(
    supplierProducts
  );

  const selected = useMemo(() => {
    return list.sort((a, b) => a - b);
  }, [list]);

  shouldLog("Supplier product list: ", selected);

  const [name, setName] = useState(supplier.name);
  const dispatch = useDispatch();

  const save = () => {
    let returnedSupplier: ISupplier = {
      supplierID: supplier.supplierID,
      name,
      products: []
    };
    if (selected.length > 0) {
      returnedSupplier.products = selected;
    }

    let isSupplierChanged = isChanged(supplier, returnedSupplier);
    if (!isSupplierChanged.isEqual) {
      shouldLog("Changed Supplier", isSupplierChanged.changed);
      dispatch(
        addChange({
          type: "EDIT_SUPPLIER_INFO",
          id: returnedSupplier.supplierID,
          section: "suppliers",
          changed: isSupplierChanged.changed
        })
      );
      dispatch(saveEditedSupplier(returnedSupplier));
      dispatch(addNotification(notifications.addedChange()));
    }
    close();
  };

  return (
    <EditModal
      isOpen={Boolean(supplier)}
      label="Edit supplier"
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
            <Icons.Suppliers /> Leverandør #{supplier.supplierID}{" "}
          </ModalTitle>
          {view !== "details" && <ModalSubtitle>Produkter</ModalSubtitle>}
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
              <TextInput
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
              />
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
              {selected.map(s => (
                <SelectedProduct
                  id={s}
                  key={`supplier_${supplier.supplierID}_product_${s}`}
                />
              ))}
            </StyledList>
          </>
        )}
        {view === "products" && (
          <SuppliersProducts
            products={products}
            selected={selected}
            add={addProduct}
            remove={removeProduct}
          />
        )}
      </ModalContent>
      <ModalFooter bckColor={secondary}>
        <ModalButton onClick={save}>
          <Icons.Save />
        </ModalButton>
      </ModalFooter>
    </EditModal>
  );
};

export default EditSupplier;
