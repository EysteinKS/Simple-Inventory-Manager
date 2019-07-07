import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  saveCreatedSale,
  saveEditedSale
} from "../redux/actions/salesActions";
import { saveCreatedCustomer } from "../redux/actions/customersActions";
import ReactModal from "react-modal";
import Collapse from "@material-ui/core/Collapse";
import Icons from "./Icons";
import ProductName from "./ProductName";
import SelectProduct from "./SelectProduct";
import useEditableList from "../hooks/useEditableList"
import { RootState, ICustomer, IOrderedProduct } from "../redux/types";

ReactModal.setAppElement("#root");

type TEditSale = {
  isOpen: boolean,
  close: () => void
}

export default function EditSale({ isOpen, close }: TEditSale) {
  const current = useSelector((state: RootState) => state.sales.currentSale);
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
    console.log("EditSale is open and uninitialized")
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
      dateOrdered: new Date(),
      dateSent: null,
      ordered: ordered
    };
    //console.log(returnedOrder)
    if(current.isNew){
      dispatch(saveCreatedSale(returnedSale));
    } else {
      dispatch(saveEditedSale(returnedSale));
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
        <Ordered
          ordered={ordered}
          add={productID => addProduct({productID: productID, amount: 0})}
          edit={(product, index) => editProduct(product, index)}
          remove={productID => removeProduct(productID)}
        />
      </form>
      <div style={{ display: "grid", gridTemplateColumns: "60% 20% 20%" }}>
        <div />
        <button onClick={save}>Lagre</button>
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

type TAddCustomer = {
  visible: boolean,
  close: (id: number) => void,
  customers: ICustomer[]
}

const AddCustomer = ({ visible, close, customers }: TAddCustomer) => {
  const [name, setName] = useState("");
  const [ID, setID] = useState();
  const dispatch = useDispatch();
  const save = useCallback(
    event => {
      event.preventDefault();
      dispatch(saveCreatedCustomer(name));
      close(ID);
    },
    [dispatch, name, close, ID]
  );

  useEffect(() => {
    if(visible) {
      setID(customers.length + 1);
    }
  }, [visible, setID, customers]);

  return (
    <div
      style={{
        gridColumn: "2 / 3",
        marginTop: "5px",
        marginBottom: "20px",
        display: "flex",
        flexWrap: "nowrap",
        justifyContent: "center"
      }}
    >
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Navn"
        style={{
          width: "100"
        }}
      />
      <button
        onClick={e => save(e)}
        style={{
          width: "10vw",
          backgroundColor: "rgb(255, 220, 0)"
        }}
      >
        <Icons.NewFolder />
      </button>
    </div>
  );
};

type TOrdered = {
  ordered: IOrderedProduct[],
  add: (newListItem: any) => void,
  edit: (updated: any, index: number) => void,
  remove: (index: number) => void
}

const Ordered = ({ ordered, add, edit, remove }: TOrdered) => {
  const [showAdd, setAdd] = useState(false);

  return (
    <div
      style={{
        gridColumn: "1 / 3",
        padding: "3%",
        maxHeight: "100%",
        overflowY: "auto"
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "20% 60% 20%",
          backgroundColor: "lightgray",
          marginTop: "0px",
          padding: "5px"
        }}
      >
        <button
          onClick={e => {
            e.preventDefault();
            setAdd(!showAdd);
          }}
        >
          +
        </button>
        <span
          style={{ marginTop: "0px", paddingLeft: "10px", placeSelf: "center" }}
        >
          Produkter
        </span>
      </div>
      <ul style={{ listStyleType: "none", padding: "5px", margin: "0px" }}>
        {ordered.map((product, i) => (
          <OrderedProduct 
            product={product} 
            key={"selected_products_" + product.productID} 
            index={i} 
            edit={(value, index) => edit({productID: product.productID, amount: value}, index)}
            remove={index => remove(index)}/>
        ))}
      </ul>
      <Collapse in={showAdd}>
        <SelectProduct
          style={{
            height: "30vh",
            overflowY: "scroll"
          }}
          onSelect={productID => add(productID)}
          selected={ordered}
        />
      </Collapse>
    </div>
  );
};

type TOrderedProduct = {
  product: IOrderedProduct,
  edit: (updated: any, index: number) => void,
  remove: (index: number) => void,
  index: number
}

const OrderedProduct = ({ product, edit, remove, index }: TOrderedProduct) => {
  const { productID, amount } = product;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "50% 40% 10%",
        borderBottom: "black 1px solid",
        marginBottom: "10px",
        paddingBottom: "5px"
      }}
    >
      <ProductName id={productID} />
      <input
        type="tel"
        value={amount}
        onChange={e => edit(Number(e.target.value), index)}
      />
      <button onClick={e => {
        e.preventDefault()
        remove(index)
      }}><Icons.Delete/></button>
    </div>
  );
};