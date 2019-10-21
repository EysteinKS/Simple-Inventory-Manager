import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  createProduct,
  setCurrentProduct,
  clearCurrentProduct
} from "../../redux/actions/productsActions";
import { sort, newProduct, shouldLog } from "../../constants/util";

import EditProduct from "../../components/inventory/EditModals/EditProduct";
import EditCategories from "../Categories/Categories";
import SectionHeader, {
  Row,
  RowSplitter,
  ColumnSplitter,
  Title,
  Key,
  KeyButton,
  SortingKey,
  TDirections
} from "../../components/util/SectionHeader";
import CloudStatus from "../../components/util/CloudStatus";
import Icons from "../../components/util/Icons";

import useSortableList from "../../hooks/useSortableList";
import { RootState } from "../../redux/types";
import { hasActiveLoans } from "../../redux/selectors/loansSelectors";
import ProductHistory from "../../components/inventory/ProductHistory";
import { TableWrapper } from "../../styles/table";
import { ProductList } from "./styles";
import Product from "./Product";

//TODO
//Show icon if product contains a comment

export default function Products() {
  //REDUX
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products);
  const categories = useSelector((state: RootState) => state.categories);

  //MODALS
  const [isProductOpen, setProductOpen] = useState(false);
  const [isHistoryOpen, setHistoryOpen] = useState(false);
  const [isCategoriesOpen, setCategoriesOpen] = useState(false);

  //SORTING
  const [sorting, setSorting] = useState([null, null, null] as any[]);
  const { sortedList, setList, sortFunc } = useSortableList(products.products);
  useEffect(() => {
    setList(products.products);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products.products]);

  const sortList = (dir: TDirections, index: number, func: Function) =>
    sortFunc(setSorting)(dir, index, func, sorting);

  const activeLoans = useSelector(hasActiveLoans);
  const iconRows = useMemo(() => {
    if (!activeLoans) {
      return "9% 1% 18% 1% 18% 1% repeat(5, 8%) 12%";
    } else {
      return "9% 1% 18% 1% 18% 1% repeat(6, 7%) 10%";
    }
  }, [activeLoans]);

  const buttonStyle = {
    height: "75%",
    width: "75%",
    borderRadius: "15px"
  };
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
    <TableWrapper>
      <SectionHeader>
        <Row grid="15% 15% 43.5% 14.5% 12%">
          <NewProductButton />
          <CategoriesButton />
          <Title>Produkter</Title>
          <br />
          <CloudStatus />
        </Row>
        <RowSplitter />
        <Row grid={iconRows}>
          <SortingKey
            onClick={dir => sortList(dir, 0, sort.by("productID", dir))}
          >
            #
          </SortingKey>
          <ColumnSplitter />
          <SortingKey onClick={dir => sortList(dir, 1, sort.byName(dir))}>
            <Icons.FormatQuote />
          </SortingKey>
          <ColumnSplitter />
          <SortingKey
            onClick={dir =>
              sortList(dir, 2, sort.byCategory(categories.categories, dir))
            }
          >
            <Icons.FolderOpen />
          </SortingKey>
          <ColumnSplitter />
          <Key>
            <Icons.Storage />
          </Key>
          <Key>
            <Icons.Archive />
          </Key>
          <Key>
            <Icons.Unarchive />
          </Key>
          {activeLoans && (
            <Key>
              <Icons.Cached />
            </Key>
          )}
          <Key>
            <Icons.Functions />
          </Key>
          <div />
          <KeyButton onClick={() => shouldLog("TODO: useFilterableList")}>
            {/* !isFiltered ? <Icons.VisibilityOff/> : <Icons.Visibility/> */}
          </KeyButton>
        </Row>
      </SectionHeader>
      <ProductList>
        {!Array.isArray(sortedList) || !sortedList.length
          ? null
          : sortedList.map((product, index) => (
              <Product
                key={"product_" + product.productID}
                product={product}
                edit={id => {
                  dispatch(setCurrentProduct(id));
                  setProductOpen(true);
                }}
                showHistory={id => {
                  dispatch(setCurrentProduct(id));
                  setHistoryOpen(true);
                }}
                index={index}
              />
            ))}
      </ProductList>
      {isProductOpen && (
        <EditProduct
          isOpen={isProductOpen}
          close={() => {
            setProductOpen(false);
            dispatch(clearCurrentProduct());
          }}
        />
      )}
      {isCategoriesOpen && (
        <EditCategories
          isOpen={isCategoriesOpen}
          close={() => {
            setCategoriesOpen(false);
          }}
        />
      )}
      {isHistoryOpen && (
        <ProductHistory
          isOpen={isHistoryOpen}
          close={() => {
            setHistoryOpen(false);
            dispatch(clearCurrentProduct());
          }}
        />
      )}
    </TableWrapper>
  );
}
