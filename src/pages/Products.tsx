import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  createProduct,
  editProduct,
  clearCurrentProduct,
  toggleProduct
} from "../redux/actions/productsActions";
import {
  sort,
  getAmount,
  newProduct,
  shouldLog
} from "../constants/util";
import "./Products.css";

import EditProduct from "../components/inventory/EditProduct";
import EditCategories from "./Categories";
import SectionHeader, { Row, RowSplitter, ColumnSplitter, Title, Key, KeyButton, SortingKey, TDirections } from "../components/util/SectionHeader";
import CloudStatus from "../components/util/CloudStatus"
import Icons from "../components/util/Icons"
import Warning from "../components/util/Warning"

import useSortableList from "../hooks/useSortableList"
import produce from "immer"
import { IProduct, RootState } from "../redux/types";
import { OrdersInfo, SalesInfo } from "../components/util/HoverInfo";
import styled from "styled-components";

//TODO
//Show icon if product contains a comment

export default function Products(){
  //REDUX
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products);
  const categories = useSelector((state: RootState) => state.categories)

  //MODALS
  const [isProductOpen, setProductOpen] = useState(false);
  const [isCategoriesOpen, setCategoriesOpen] = useState(false);

  //SORTING
  const [sorting, setSorting] = useState([null, null, null] as any[])
  const { sortedList, setList, setSortingFuncs } = useSortableList(products.products)
  useEffect(() => {
    setList(products.products);
    setSortingFuncs(sorting);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products.products]);
  const sortList = (dir: TDirections, index: number, func: Function) => {
    if (dir !== null) {
      let newSorting = produce(sorting, draft => {
        draft[index] = func;
      });
      setSorting(newSorting);
      setSortingFuncs(newSorting);
    } else {
      let newSorting = produce(sorting, draft => {
        draft[index] = null;
      });
      setSorting(newSorting);
      setSortingFuncs(newSorting);
    }
  }

  const buttonStyle = {
    height: "75%",
    width: "75%",
    borderRadius: "15px",
  }
  const NewProductButton = () => (
    <button
    style={buttonStyle}
      onClick={() => {
        dispatch(createProduct(newProduct(products.products.length + 1)));
        setProductOpen(true);
      }}
    >
      Legg til
    </button>
  );
  const CategoriesButton = () => (
    <button
      style={buttonStyle}
      onClick={() => {
        setCategoriesOpen(true);
      }}
    >
      Kategorier
    </button>
  );

  return (
    <div style={{ margin: "5vh 10vw 10vh 10vw" }}>
      <SectionHeader>
        <Row grid="15% 15% 43.5% 14.5% 12%">
          <NewProductButton />
          <CategoriesButton />
          <Title>Produkter</Title>
          <br/>
          <CloudStatus/>
        </Row>
        <RowSplitter/>
        <Row grid="9% 1% 18% 1% 18% 1% repeat(5, 8%) 12%" cName="products-header">
          <SortingKey
            onClick={dir => sortList(dir, 0, sort.by("productID", dir))}
          >#</SortingKey>
          <ColumnSplitter/>
          <SortingKey 
            onClick={dir => sortList(dir, 1, sort.byName(dir))}
          >
            <Icons.FormatQuote/>
          </SortingKey>
          <ColumnSplitter/>
          <SortingKey
            onClick={dir => sortList(dir, 2, sort.byCategory(categories.categories, dir))}
          >
            <Icons.FolderOpen/>
          </SortingKey>
          <ColumnSplitter/>
          <Key><Icons.Storage/></Key>
          <Key><Icons.Archive/></Key>
          <Key><Icons.Unarchive/></Key>
          <Key><Icons.Functions/></Key>
          <div/>
          <KeyButton onClick={() => shouldLog("TODO: useFilterableList")}>{/* !isFiltered ? <Icons.VisibilityOff/> : <Icons.Visibility/> */}</KeyButton>
        </Row>
      </SectionHeader>
      <div className="product-list">
        {(!Array.isArray(sortedList) || !sortedList.length)
          ? null
          : sortedList.map((product, key) => (
            <Product
              key={"product_" + product.productID}
              product={product}
              edit={id => {
                dispatch(editProduct(id));
                setProductOpen(true);
              }}/>))}
      </div>
      {isProductOpen && <EditProduct
        isOpen={isProductOpen}
        close={() => {
          setProductOpen(false);
          dispatch(clearCurrentProduct());
        }}
      />}
      {isCategoriesOpen && <EditCategories
        isOpen={isCategoriesOpen}
        close={() => {
          setCategoriesOpen(false);
        }}
      />}
    </div>
  );
};

type TProductWithEdit = {
  product: IProduct,
  edit: (id: number) => void
}

const Product = ({ product, edit }: TProductWithEdit) => {
  const dispatch = useDispatch()
  const categories = useSelector((state: RootState) => state.categories.categories);
  const category = categories[product.categoryID - 1].name;
  //const category = getCategoryName(categories, product.categoryID)
  let orders = useSelector((state: RootState) => state.orders.orders);
  let sales = useSelector((state: RootState) => state.sales.sales)
  let ordered = getAmount(orders, product.productID);
  let reserved = getAmount(sales, product.productID)
  let amount = product.amount;

  const total = amount + (ordered || 0) - (reserved || 0);

  return (
    <div className={`product ${!product.active ? "inactive" : ""} ${(product.active && total < 0)}`}>
      <p>{product.productID}</p>
      <p className="product-name">{product.name}</p>
      <p className="product-category">{category}</p>
      <p>{amount || 0}</p>
      <OrderedWithInfo productID={product.productID} amount={ordered}/>
      <ReservedWithInfo productID={product.productID} amount={reserved}/>
      <p>{total}</p>
      {(total < 0) ? <Warning style={{ placeSelf: "center" }}/> : <div/>}
      <button onClick={() => dispatch(toggleProduct(product.productID))}>{product.active ? <Icons.Visibility/>: <Icons.VisibilityOff/>}</button>
      <button onClick={() => edit(product.productID)}><Icons.Edit/></button>
    </div>
  );
};

interface InfoProps {
  productID: number
  amount: number
}

const AmountField = styled.p`
  width: 80%;
  text-align: center;
  :hover {
    cursor: help;
  }
`

const OrderedWithInfo: React.FC<InfoProps> = ({productID, amount}) => {
  const handle = `product_${productID}_ordered`

  if(amount <= 0){
    return(<p>{amount}</p>)
  }

  return(
    <>
      <AmountField data-tip data-for={handle}>{amount || 0}</AmountField>
      {(amount > 0) && <OrdersInfo handle={handle} productID={productID}/>}
    </>
  )
}

const ReservedWithInfo: React.FC<InfoProps> = ({productID, amount}) => {
  const handle = `product_${productID}_reserved`

  if(amount <= 0){
    return(<p>{amount}</p>)
  }

  return(
    <>
      <AmountField data-tip data-for={handle}>{amount || 0}</AmountField>
      {(amount > 0) && <SalesInfo handle={handle} productID={productID}/>}
    </>
  )
}