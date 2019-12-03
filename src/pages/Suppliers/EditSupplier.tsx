import React, { useMemo, useState } from "react";
import { ISupplier } from "../../redux/types";
import useProducts from "../../hooks/useProducts";
import useEditableList from "../../hooks/useEditableList";
import { shouldLog, isChanged } from "../../constants/util";
import { useDispatch } from "react-redux";
import { addChange } from "../../redux/actions/reportsActions";
import { saveEditedSupplier } from "../../redux/actions/suppliersActions";
import {
  StyledHeader,
  StyledDetails,
  IDText,
  EndText,
  StyledFooter
} from "../../components/inventory/EditModals/styles";
import SuppliersProducts from "../../components/inventory/SuppliersProducts";
import EditModal from "../../components/inventory/EditModals/EditModal";

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
    }
    close();
  };

  return (
    <EditModal isOpen={Boolean(supplier)} label="Edit supplier" onClose={close}>
      <StyledHeader>
        <div />
        <h3 style={{ textAlign: "center" }}>Rediger</h3>
      </StyledHeader>
      <StyledDetails>
        <IDText>ID: {supplier.supplierID}</IDText>
        <EndText>Navn: </EndText>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <IDText>Produkter</IDText>
        <SuppliersProducts
          products={products}
          selected={selected}
          add={addProduct}
          remove={removeProduct}
        />
      </StyledDetails>
      <StyledFooter>
        <br />
        <button onClick={save}>Lagre</button>
        <button onClick={close}>Lukk</button>
      </StyledFooter>
    </EditModal>
  );
};

export default EditSupplier;
