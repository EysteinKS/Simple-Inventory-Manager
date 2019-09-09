import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  saveCreatedSale,
  saveEditedSale
} from "../../redux/actions/salesActions";
import ReactModal from "react-modal";
import Collapse from "@material-ui/core/Collapse";
import useEditableList from "../../hooks/useEditableList"
import { RootState, ISale } from "../../redux/types";
import { isChanged, shouldLog } from "../../constants/util";
import { addChange } from "../../redux/actions/reportsActions";
import AddCustomer from "./AddCustomer";
import OrderedProducts from "./OrderedProducts";

ReactModal.setAppElement("#root");

type TEditSale = {
  isOpen: boolean,
  close: () => void
}

export default function EditSale({ isOpen, close }: TEditSale) {
  const current = useSelector((state: RootState) => state.sales.currentSale) as ISale
  const customers = useSelector((state: RootState) => state.customers.customers);
  const dispatch = useDispatch();

  const [customer, setCustomer] = useState();
  const { 
    list: ordered, 
    add: addProduct, 
    edit: editProduct, 
    remove: removeProduct, 
    replace: setOrdered 
  } = useEditableList(current.ordered)

  const [init, setInit] = useState(false);
  if (isOpen && !init) {
    setCustomer(current.customerID);
    setOrdered(current.ordered);
    setInit(true);
  }

  const [newCustomer, toggleNewCustomer] = useState(false);
  useEffect(() => {
    if(!customers.length){
      toggleNewCustomer(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])
  useEffect(() => {
    if (customer === "new") {
      toggleNewCustomer(true);
    } else if (customers.length) {
      toggleNewCustomer(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer, toggleNewCustomer]);

  const save = () => {
    let returnedSale = {
      saleID: current.saleID,
      customerID: Number(customer),
      dateOrdered: current.dateOrdered,
      dateSent: current.dateSent,
      ordered: ordered
    };
    if(current.isNew){
      dispatch(addChange({
        type: "NEW_SALE",
        id: returnedSale.saleID,
        section: "sales"
      }))
      dispatch(saveCreatedSale(returnedSale));
    } else {
      let isSaleChanged = isChanged(current, returnedSale)
      if(!isSaleChanged.isEqual){
        shouldLog("Changed sale content", isSaleChanged.changed)
        dispatch(addChange({
          type: "EDIT_SALE_INFO",
          id: returnedSale.saleID,
          section: "sales",
          changed: isSaleChanged.changed
        }))
        dispatch(saveEditedSale(returnedSale));
      }
    }
    close();
    setInit(false);
  };

  return (
    <ReactModal
      isOpen={isOpen}
      contentLabel="Edit sale"
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      onRequestClose={() => {
        close();
        setInit(false);
      }}
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
      <p style={{ padding: "10px" }}>ID: {current.saleID}</p>
      <form
        style={{
          display: "grid",
          gridTemplateColumns: "50% 50%",
          justifyContent: "center",
          maxHeight: "60vh"
        }}
      >
        <label htmlFor="customer">Kunde</label>
        <select value={customer} onChange={e => setCustomer(e.target.value)}>
          {customers && customers.map((customer, key) => (
            <option key={"customer_menu_" + customer.customerID} value={customer.customerID}>
              {customer.name}
            </option>
          ))}
          <option value="new">...</option>
        </select>
        <Collapse
          in={newCustomer}
          style={{
            gridColumn: "2/3"
          }}
        >
          {newCustomer ? (
            <AddCustomer
              visible={(customer === "new")}
              customers={customers}
              close={ID => {
                setCustomer(ID);
                toggleNewCustomer(false);
              }}
            />
          ) : null}
        </Collapse>
        <OrderedProducts
          ordered={ordered}
          add={productID => addProduct({productID: productID, amount: 1})}
          edit={(product, index) => editProduct(product, index)}
          remove={productID => removeProduct(productID)}
        />
      </form>
      <div style={{ display: "grid", gridTemplateColumns: "60% 20% 20%" }}>
        <div />
        <button onClick={save} disabled={(customer === "new")}>Lagre</button>
        <button
          onClick={() => {
            close();
            setInit(false);
          }}
        >
          Lukk
        </button>
      </div>
    </ReactModal>
  );
};