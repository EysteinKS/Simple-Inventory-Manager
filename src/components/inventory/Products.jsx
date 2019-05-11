import React, { useState, useCallback, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  sortProducts,
  filterProducts,
  createProduct,
  editProduct,
  clearCurrentProduct,
  saveProducts,
  toggleProduct
} from "../../redux/actions/productsActions";
import { saveCategories } from "../../redux/actions/categoriesActions"
import {
  filterByActive,
  sort,
  getOrderedAmount,
  newProduct
} from "../../constants/util";
import "./Products.css";

import EditProduct from "./EditProduct";
import EditCategories from "./Categories";
import SectionHeader, { Row, Title, Key, KeyButton } from "../SectionHeader";
import CloudStatus from "../CloudStatus"
import Icons from "../Icons"
import {useGate, generateSelectors} from "../../constants/hooks"

import SimpleBar from "simplebar-react"
import "simplebar/dist/simplebar.min.css"

export default () => {
  const dispatch = useDispatch();
  const products = useSelector(state => state.products);
  const categories = useSelector(state => state.categories)
  let productList = products.sortedProducts;
  const [isProductOpen, setProductOpen] = useState(false);
  const [isCategoriesOpen, setCategoriesOpen] = useState(false);

  const [isFiltered, setFiltered] = useState(true);
  const filter = useCallback(() => {
    setFiltered(!isFiltered);
    dispatch(filterProducts(filterByActive(isFiltered)));
  }, [isFiltered, dispatch]);

  let content;
  if (!Array.isArray(productList) || !productList.length) {
    content = null;
  } else {
    content = productList.map((product, key) => (
      <Product
        key={key}
        product={product}
        edit={id => {
          dispatch(editProduct(id));
          setProductOpen(true);
        }}
      />
    ));
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
      style={{...buttonStyle}}
      onClick={() => {
        setCategoriesOpen(true);
      }}
    >
      Kategorier
    </button>
  );
  const gateObjects = ["categories", "products"]
  let gateObjSaving = generateSelectors(gateObjects, "isSaving", useSelector)
  let gateObjSaved = generateSelectors(gateObjects, "isSaved", useSelector)
  let gateObjError = generateSelectors(gateObjects, "savingError", useSelector)
  const savingGate = useGate(
    {gate: "OR", list: gateObjSaving}, 
    {gate: "OR", list: ["isSaving"]})
  const savedGate = useGate(
    {gate: "AND", list: gateObjSaved}, 
    {gate: "AND", list: ["isSaved"]})
  const errorGate = useGate(
    {gate: "OR", list: gateObjError}, 
    {gate: "OR", list: ["savingError"]})
  //console.log(gateObjSaving)

  return (
    <Fragment>
      <SectionHeader>
        <Row grid="15% 15% 43.5% 14.5% 12%">
          <NewProductButton />
          <CategoriesButton />
          <Title>Produkter</Title>
          <br/>
          <CloudStatus 
            save={() => {
              dispatch(saveProducts(products.products))
              dispatch(saveCategories(categories.categories))
            }}
            isSaving={savingGate}
            isSaved={savedGate}
            error={errorGate}
          />
        </Row>
        
        <Row grid="15% 15% repeat(4, 14.5%) 12%" cName="products-header">
          <HeaderButton sorting={dir => sort.byName(dir)}>
            <Icons.FormatQuote/>
          </HeaderButton>
          <HeaderButton
            sorting={dir => sort.byCategory(categories.categories, dir)}
          >
            <Icons.FolderOpen/>
          </HeaderButton>
          <Key><Icons.Storage/></Key>
          <Key><Icons.Archive/></Key>
          <Key><Icons.Unarchive/></Key>
          <Key><Icons.Functions/></Key>
          <KeyButton onClick={filter}>{!isFiltered ? <Icons.VisibilityOff/> : <Icons.Visibility/>}</KeyButton>
        </Row>
      </SectionHeader>
      <SimpleBar>
      <div className="product-list">
        {content}
      </div>
      </SimpleBar>
      <EditProduct
        isOpen={isProductOpen}
        close={() => {
          setProductOpen(false);
          dispatch(clearCurrentProduct());
        }}
      />
      <EditCategories
        isOpen={isCategoriesOpen}
        close={() => {
          setCategoriesOpen(false);
        }}
      />
    </Fragment>
  );
};

const HeaderButton = ({ children, sorting }) => {
  const dispatch = useDispatch();
  const [currentDirection, setDirection] = useState("asc");
  return (
    <button
      onClick={() => {
        setDirection(currentDirection === "asc" ? "desc" : "asc");
        //console.log(currentDirection);
        dispatch(sortProducts(sorting(currentDirection)));
      }}
    >
      {children}
      <p>{currentDirection === "asc" ? "↓" : "↑"}</p>
    </button>
  );
};

const Product = ({ product, reserved, edit }) => {
  const dispatch = useDispatch()
  const categories = useSelector(state => state.categories.categories);
  const category = categories[product.categoryID - 1].name;
  //const category = getCategoryName(categories, product.categoryID)
  let orders = useSelector(state => state.orders.orders);
  let ordered = getOrderedAmount(orders, product.productID);
  let amount = product.amount;

  const total = amount + (ordered || 0) - (reserved || 0);

  return (
    <div className={`product ${!product.active ? "inactive" : ""}`}>
      <p className="product-name">{product.name}</p>
      <p className="product-category">{category}</p>
      <p>{amount || 0}</p>
      <p>{ordered || 0}</p>
      <p>{reserved || 0}</p>
      <p>{total}</p>
      <button onClick={() => dispatch(toggleProduct(product.productID))}>{product.active ? <Icons.Visibility/>: <Icons.VisibilityOff/>}</button>
      <button onClick={() => edit(product.productID)}><Icons.Edit/></button>
    </div>
  );
};
  