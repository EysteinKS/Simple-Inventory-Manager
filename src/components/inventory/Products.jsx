import React, { useState, useEffect, Fragment, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
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
  getAmount,
  newProduct
} from "../../constants/util";
import "./Products.css";

import EditProduct from "./EditProduct";
import EditCategories from "./Categories";
import SectionHeader, { Row, Title, Key, KeyButton, SortingKey } from "../SectionHeader";
import CloudStatus from "../CloudStatus"
import Icons from "../Icons"
import {useGate} from "../../constants/hooks"

import useSortableList from "../../hooks/useSortableList"
import produce from "immer"

export default function Products(){
  const dispatch = useDispatch();
  const products = useSelector(state => state.products);
  const categories = useSelector(state => state.categories)

  const [isProductOpen, setProductOpen] = useState(false);
  const [isCategoriesOpen, setCategoriesOpen] = useState(false);

  //SORTING
  const [sorting, setSorting] = useState([null, null])
  const [sortedList, setList, setSortingFuncs] = useSortableList(products.products)
  useEffect(() => {
    //console.log("Orders list updated, setting list");
    setList(products.products);
    setSortingFuncs(sorting);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products.products]);
  const sortList = (dir, index, func) => {
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

/*   const [isFiltered, setFiltered] = useState(true);
  const filter = useCallback(() => {
    setFiltered(!isFiltered);
    dispatch(filterProducts(filterByActive(isFiltered)));
  }, [isFiltered, dispatch]); */

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

  const allIsSaving = useMemo(() => [products.isSaving, categories.isSaving], [products.isSaving, categories.isSaving])
  const savingGate = useGate(allIsSaving, "OR", "productsIsSaving")
  const allIsSaved = useMemo(() => [products.isSaved, categories.isSaved], [products.isSaved, categories.isSaved])
  const savedGate = useGate(allIsSaved, "AND", "productsIsSaved", true)
  const allError = useMemo(() => [products.savingError, categories.savingError], [products.savingError, categories.savingError])
  const errorGate = useGate(allError, "OR", "productsLoadingError")

  React.useEffect(() => {
    //console.log("allIsSaved: ", allIsSaved)
    //console.log("savedGate: ", savedGate)
  })

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
        
        <Row grid="24% 24% repeat(4, 10%) 12%" cName="products-header">
          <SortingKey 
            onClick={dir => sortList(dir, 0, sort.byName(dir))}
          >
            <Icons.FormatQuote/>
          </SortingKey>
          <SortingKey
            onClick={dir => sortList(dir, 1, sort.byCategory(categories.categories, dir))}
          >
            <Icons.FolderOpen/>
          </SortingKey>
          <Key><Icons.Storage/></Key>
          <Key><Icons.Archive/></Key>
          <Key><Icons.Unarchive/></Key>
          <Key><Icons.Functions/></Key>
          <KeyButton onClick={() => console.log("TODO: useFilterableList")}>{/* !isFiltered ? <Icons.VisibilityOff/> : <Icons.Visibility/> */}</KeyButton>
        </Row>
      </SectionHeader>
      <div className="product-list">
        {(!Array.isArray(sortedList) || !sortedList.length)
          ? null
          : sortedList.map((product, key) => (
            <Product
              key={key}
              product={product}
              edit={id => {
                dispatch(editProduct(id));
                setProductOpen(true);
              }}/>))}
      </div>
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

const Product = ({ product, edit }) => {
  const dispatch = useDispatch()
  const categories = useSelector(state => state.categories.categories);
  const category = categories[product.categoryID - 1].name;
  //const category = getCategoryName(categories, product.categoryID)
  let orders = useSelector(state => state.orders.orders);
  let sales = useSelector(state => state.sales.sales)
  let ordered = getAmount(orders, product.productID);
  let reserved = getAmount(sales, product.productID)
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
  