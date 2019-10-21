import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import { RootState, ISupplier } from "../../redux/types";
import ReactModal from "react-modal";
import Icons from "../../components/util/Icons";
import {
  StyledHeader,
  StyledDetails,
  IDText,
  EndText,
  StyledFooter
} from "../../components/inventory/EditModals/styles";
import SuppliersProducts from "../../components/inventory/SuppliersProducts";
import useProducts from "../../hooks/useProducts";
import useEditableList from "../../hooks/useEditableList";
import { isChanged, shouldLog } from "../../constants/util";
import { addChange } from "../../redux/actions/reportsActions";
import {
  saveEditedSupplier,
  saveCreatedSupplier
} from "../../redux/actions/suppliersActions";
ReactModal.setAppElement("#root");

interface IProps {
  isOpen: boolean;
  close: () => void;
}

export default function EditSuppliers({ isOpen, close }: IProps) {
  const suppliers = useSelector(
    (state: RootState) => state.suppliers.suppliers
  );
  const [supplier, setSupplier] = useState(null as ISupplier | null);

  return (
    <ReactModal
      isOpen={isOpen}
      contentLabel="Suppliers"
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      onRequestClose={close}
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
          gridTemplateRows: "10vh 60vh 10vh"
        }
      }}
    >
      {supplier == null && (
        <SupplierList suppliers={suppliers} edit={setSupplier} />
      )}
      {supplier && supplier.name && (
        <EditSupplier
          supplier={supplier}
          back={() => setSupplier(null)}
          close={close}
        />
      )}
    </ReactModal>
  );
}

interface SupplierListProps {
  suppliers: ISupplier[];
  edit: (supplier: ISupplier) => void;
}

const SupplierList: React.FC<SupplierListProps> = ({ suppliers, edit }) => {
  const [add, setAdd] = useState(false);

  return (
    <>
      <StyledHeader>
        <br />
        <h3 style={{ textAlign: "center" }}>Leverandører</h3>
      </StyledHeader>
      <div>
        {suppliers.map(supplier => (
          <SupplierItem
            key={"supplier_" + supplier.supplierID}
            supplier={supplier}
            edit={edit}
          />
        ))}
        {!add ? (
          <button onClick={() => setAdd(true)}>Legg til</button>
        ) : (
          <AddSupplier close={() => setAdd(false)} />
        )}
      </div>
    </>
  );
};

interface SupplierItemProps {
  supplier: ISupplier;
  edit: (supplier: ISupplier) => void;
}

const SupplierItem: React.FC<SupplierItemProps> = ({ supplier, edit }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 4fr 1fr"
      }}
    >
      <p>{supplier.supplierID}</p>
      <p>{supplier.name}</p>
      <button onClick={() => edit(supplier)}>
        <Icons.Edit />
      </button>
    </div>
  );
};

const AddSupplier = ({ close }: { close: () => void }) => {
  const nextID = useSelector(
    (state: RootState) => state.suppliers.currentID + 1
  );
  const [name, setName] = useState("");
  const dispatch = useDispatch();

  const save = () => {
    dispatch(
      addChange({
        type: "NEW_SUPPLIER",
        id: nextID,
        name,
        section: "suppliers"
      })
    );
    dispatch(saveCreatedSupplier(name));
    setName("");
    close();
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 8fr 1fr 1fr"
      }}
    >
      <p>{nextID}</p>
      <input type="text" value={name} onChange={e => setName(e.target.value)} />
      <button onClick={save} disabled={name.length < 1}>
        Lagre
      </button>
      <button onClick={close}>Avbryt</button>
    </div>
  );
};

interface EditSupplierProps {
  supplier: ISupplier;
  back: () => void;
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
    <>
      <StyledHeader>
        <button onClick={back}>
          <Icons.ArrowBack />
        </button>
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
    </>
  );
};
