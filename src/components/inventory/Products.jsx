import React, { useState, useCallback, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  sortProducts,
  filterProducts,
  createProduct,
  editProduct,
  clearCurrentProduct,
  saveProducts
} from "../../redux/actions/productsActions";
import {
  filterByActive,
  sort,
  getOrderedAmount,
  newProduct
} from "../../constants/util";
import { productCategories } from "../../constants/mock";
import "./Products.css";

import EditProduct from "./EditProduct";
import EditCategories from "./Categories";
import SectionHeader, { Row, Title, Key, KeyButton } from "../SectionHeader";
import CloudStatus from "../CloudStatus"
import Icons from "../Icons"

export default () => {
  const dispatch = useDispatch();
  const products = useSelector(state => state.products);
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

  const LeftButton = () => (
    <button
      onClick={() => {
        dispatch(createProduct(newProduct(products.products.length + 1)));
        setProductOpen(true);
      }}
    >
      Legg til
    </button>
  );
  const RightButton = () => (
    <button
      onClick={() => {
        setCategoriesOpen(true);
      }}
    >
      Kategorier
    </button>
  );
  return (
    <Fragment>
      <SectionHeader>
        <Row grid="20% 20% 20% 20% 20%">
          <LeftButton />
          <div/>
          <Title>Produkter</Title>
          <CloudStatus 
            save={() => dispatch(saveProducts(products.products))}
            isSaving={products.isSaving}
            isSaved={products.isSaved}
            error={products.savingError}
          />
          <RightButton />
        </Row>
        
        <Row grid="repeat(6, 14.58%) 12.5%" cName="products-header">
          <HeaderButton sorting={dir => sort.byName(dir)}>
            <Icons.FormatQuote/>
          </HeaderButton>
          <HeaderButton
            sorting={dir => sort.byCategory(productCategories, dir)}
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

      <div className="product-list">{content}</div>
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
      {children} {currentDirection === "asc" ? "↓" : "↑"}
    </button>
  );
};

const Product = ({ product, reserved, edit }) => {
  const categories = useSelector(state => state.categories.categories);
  const category = categories[product.categoryID - 1].name;
  //const category = getCategoryName(categories, product.categoryID)
  let orders = useSelector(state => state.orders.orders);
  let ordered = getOrderedAmount(orders, product.productID);
  let amount = product.amount;

  const total = amount + (ordered || 0) - (reserved || 0);

  return (
    <div className={`product ${!product.active ? "inactive" : null}`}>
      <p className="product-name">{product.name}</p>
      <p className="product-category">{category}</p>
      <p>{amount || 0}</p>
      <p>{ordered || 0}</p>
      <p>{reserved || 0}</p>
      <p>{total}</p>
      <button onClick={() => edit(product.productID)}>Rediger</button>
    </div>
  );
};
