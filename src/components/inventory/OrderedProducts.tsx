import React, { useState } from "react"
import { IOrderedProduct } from "../../redux/types";
import { Collapse } from "@material-ui/core";
import SelectProduct from "../util/SelectProduct";
import ProductName from "./ProductName";
import Icons from "../util/Icons";

type TOrdered = {
  ordered: IOrderedProduct[],
  add: (newListItem: any) => void,
  edit: (updated: any, index: number) => void,
  remove: (index: number) => void
}

const OrderedProducts = ({ ordered, add, edit, remove }: TOrdered) => {
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

export default OrderedProducts