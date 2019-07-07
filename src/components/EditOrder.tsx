import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  saveCreatedOrder,
  saveEditedOrder
} from "../redux/actions/ordersActions";
import { saveCreatedSupplier } from "../redux/actions/suppliersActions";
import ReactModal from "react-modal";
import Collapse from "@material-ui/core/Collapse";
import Icons from "./Icons";
import ProductName from "./ProductName";
import SelectProduct from "./SelectProduct";
import useEditableList from "../hooks/useEditableList"
import { RootState, ISupplier, IOrderedProduct } from "../redux/types";

ReactModal.setAppElement("#root")

type TEditOrder = {
  isOpen: boolean,
  close: () => void
}

export default function EditOrder({ isOpen, close }: TEditOrder) {
  const current = useSelector((state: RootState) => state.orders.currentOrder);
  const suppliers = useSelector((state: RootState) => state.suppliers.suppliers);
  const dispatch = useDispatch();

  const [supplier, setSupplier] = useState();
  const { 
    list: ordered, 
    add: addProduct, 
    edit: editProduct, 
    remove: removeProduct, 
    replace: setOrdered 
  } = useEditableList(current.ordered)

  const [init, setInit] = useState(false);
  if (isOpen && !init) {
    setSupplier(current.supplierID);
    setOrdered(current.ordered);
    setInit(true);
  }

  const [newSupplier, toggleNewSupplier] = useState(false);

  useEffect(() => {
    if(!suppliers.length){
      toggleNewSupplier(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  useEffect(() => {
    if (supplier === "new") {
      toggleNewSupplier(true);
    } else if (suppliers.length){
      toggleNewSupplier(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplier, toggleNewSupplier]);

  const save = () => {
    let returnedOrder = {
      orderID: current.orderID,
      supplierID: Number(supplier),
      dateOrdered: new Date(),
      dateReceived: null,
      ordered: ordered
    };
    //console.log(returnedOrder)
    if(current.isNew){
      dispatch(saveCreatedOrder(returnedOrder));
    } else {
      dispatch(saveEditedOrder(returnedOrder));
    }
    close();
    setInit(false);
  };

  if(!Array.isArray(current.ordered)) {return null}

  return (
    <ReactModal
      isOpen={isOpen}
      contentLabel="Edit order"
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
      <p style={{ padding: "10px" }}>ID: {current.orderID}</p>
      <form
        style={{
          display: "grid",
          gridTemplateColumns: "50% 50%",
          justifyContent: "center",
          maxHeight: "60vh"
        }}
      >
        <label htmlFor="supplier">Leverandør</label>
        <select value={supplier} onChange={e => setSupplier(e.target.value)}>
          {suppliers && suppliers.map((supplier, key) => (
            <option key={"supplier_menu_" + supplier.supplierID} value={supplier.supplierID}>
              {supplier.name}
            </option>
          ))}
          <option value="new">...</option>
        </select>
        <Collapse
          in={newSupplier}
          style={{
            gridColumn: "2/3"
          }}
        >
          {newSupplier ? (
            <AddSupplier
              visible={(supplier === "new")}
              suppliers={suppliers}
              close={ID => {
                setSupplier(ID);
                toggleNewSupplier(false);
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

type TAddSupplier = {
  visible: boolean,
  close: (id: number) => void,
  suppliers: ISupplier[]
}

const AddSupplier = ({ visible, close, suppliers }: TAddSupplier) => {
  const [name, setName] = useState("");
  const [ID, setID] = useState();
  const dispatch = useDispatch();
  const save = useCallback(
    event => {
      event.preventDefault();
      dispatch(saveCreatedSupplier(name));
      close(ID);
    },
    [dispatch, name, close, ID]
  );

  useEffect(() => {
    if(visible) {
      setID(suppliers.length + 1);
    }
  }, [visible, setID, suppliers]);

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
            key={"ordered_product_" + product.productID} 
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