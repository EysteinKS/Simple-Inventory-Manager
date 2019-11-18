import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  createProduct,
  setCurrentProduct,
  clearCurrentProduct
} from "../../redux/actions/productsActions";
import { sort, newProduct } from "../../constants/util";

import EditProduct from "../../components/inventory/EditModals/EditProduct";
import EditCategories from "../Categories/Categories";
import SectionHeader, {
  Row,
  ColumnSplitter,
  Title,
  Key,
  KeyButton,
  SortingKey,
  TDirections,
  HeaderButton,
  HeaderTop,
  HeaderButtons
} from "../../components/util/SectionHeader";
import Icons from "../../components/util/Icons";

import useSortableList from "../../hooks/useSortableList";
import { RootState } from "../../redux/types";
import { hasActiveLoans } from "../../redux/selectors/loansSelectors";
import ProductHistory from "../../components/inventory/ProductHistory";
import { TableWrapper, ListWrapper } from "../../styles/table";
import Product from "./Product";
import { toggleVisible } from "../../redux/actions/authActions";
import { Tooltip } from "../../components/util/HoverInfo";

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
      return "10% 20% 15% repeat(4, 7%) 15% 12%";
    } else {
      return "10% 20% 15% repeat(5, 7%) 8% 12%";
    }
  }, [activeLoans]);

  const showHidden = useSelector(
    (state: RootState) => state.auth.user.settings.isInactiveVisible
  );
  const productList = useMemo(() => {
    if (showHidden) {
      return sortedList;
    } else {
      const filtered = sortedList.filter(p => p.active);
      return filtered;
    }
  }, [sortedList, showHidden]);

  const handleNewProduct = () => {
    dispatch(createProduct(newProduct(products.products.length + 1)));
    setProductOpen(true);
  };

  return (
    <TableWrapper>
      <SectionHeader>
        <HeaderTop>
          <Title>Produkter</Title>
          <HeaderButtons>
            <HeaderButton
              onClick={handleNewProduct}
              data-tip
              data-for={"product_header_add"}
            >
              <Icons.Add />
            </HeaderButton>
            <Tooltip handle={"product_header_add"}>Nytt produkt</Tooltip>
            <HeaderButton
              onClick={() => setCategoriesOpen(true)}
              data-tip
              data-for={"product_header_categories"}
            >
              <Icons.FolderOpen />
              <Icons.List />
            </HeaderButton>
            <Tooltip handle={"product_header_categories"}>Kategorier</Tooltip>
          </HeaderButtons>
        </HeaderTop>
        <Row grid={iconRows}>
          <SortingKey
            onClick={dir => sortList(dir, 0, sort.by("productID", dir))}
            data-tip
            data-for={"product_header_id"}
          >
            #
          </SortingKey>
          <Tooltip handle={"product_header_id"}>ID</Tooltip>

          <SortingKey
            onClick={dir => sortList(dir, 1, sort.byName(dir))}
            data-tip
            data-for={"product_header_name"}
          >
            <Icons.FormatQuote />
          </SortingKey>
          <Tooltip handle={"product_header_name"}>Navn</Tooltip>

          <SortingKey
            onClick={dir =>
              sortList(dir, 2, sort.byCategory(categories.categories, dir))
            }
            data-tip
            data-for={"product_header_category"}
          >
            <Icons.FolderOpen />
          </SortingKey>
          <Tooltip handle={"product_header_category"}>Kategori</Tooltip>

          <Key data-tip data-for={"product_header_inventory"}>
            <Icons.Storage />
          </Key>
          <Tooltip handle={"product_header_inventory"}>På lager</Tooltip>
          <Key data-tip data-for={"product_header_ordered"}>
            <Icons.Archive />
          </Key>
          <Tooltip handle={"product_header_ordered"}>Bestilt</Tooltip>
          <Key data-tip data-for={"product_header_sales"}>
            <Icons.Unarchive />
          </Key>
          <Tooltip handle={"product_header_sales"}>Salg</Tooltip>
          {activeLoans && (
            <>
              <Key data-tip data-for={"product_header_loans"}>
                <Icons.Cached />
              </Key>
              <Tooltip handle={"product_header_loans"}>Utlån</Tooltip>
            </>
          )}
          <Key data-tip data-for={"product_header_total"}>
            <Icons.Functions />
          </Key>
          <Tooltip handle={"product_header_total"}>Totalt</Tooltip>

          <div />

          <KeyButton
            onClick={() => dispatch(toggleVisible())}
            data-tip
            data-for={"product_header_visibility"}
            border="left"
          >
            {!showHidden ? <Icons.VisibilityOff /> : <Icons.Visibility />}
          </KeyButton>
          <Tooltip handle={"product_header_visibility"}>
            {showHidden ? "Skjul" : "Vis"} inaktive produkter
          </Tooltip>
        </Row>
      </SectionHeader>
      <ListWrapper>
        {productList &&
          productList.map((product, index) => (
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
      </ListWrapper>
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
