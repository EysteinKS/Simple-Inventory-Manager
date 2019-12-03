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
import {
  Title,
  Key,
  KeyButton,
  SortingKey,
  TDirections,
  HeaderButton,
  HeaderButtons
} from "../../components/util/SectionHeader";
import Icons from "../../components/util/Icons";

import useSortableList from "../../hooks/useSortableList";
import { RootState, IProduct } from "../../redux/types";
import { hasActiveLoans } from "../../redux/selectors/loansSelectors";
import ProductHistory from "./ProductHistory";
import {
  TableWrapper,
  ListWrapper,
  TableContent,
  ContentHeader,
  TableHeader,
  getTableStyle,
  TWidth,
  ExtendColumns
} from "../../styles/table";
import Product from "./Product";
import { toggleVisible } from "../../redux/actions/authActions";
import { Tooltip } from "../../components/util/HoverInfo";
import useAuthLocation from "../../hooks/useAuthLocation";

//TODO
//Show icon if product contains a comment

export default function Products() {
  //REDUX
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products);
  const categories = useSelector((state: RootState) => state.categories);
  const { secondary } = useAuthLocation();

  //MODALS
  const [isProductOpen, setProductOpen] = useState(false);
  const [historyProduct, setHistoryProduct] = useState(null as IProduct | null);
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
  const [extended, setExtended] = useState(() => window.innerWidth > 425);
  const tableStyles = useMemo(() => {
    let data: TWidth[] = ["large"];
    if (extended) {
      data.unshift("small");
      data = data.concat(["medium", "tiny", "tiny", "tiny"]);

      if (activeLoans) {
        data.push("tiny");
      }
    }
    data = data.concat(["tiny", "tiny"]);

    return getTableStyle(data, 2);
  }, [activeLoans, extended]);

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
      <TableHeader bckColor={secondary}>
        <Title>Produkter</Title>
        <HeaderButtons>
          <HeaderButton
            onClick={handleNewProduct}
            data-tip
            data-for={"product_header_add"}
          >
            <Icons.Add />
            <Tooltip handle={"product_header_add"}>Nytt produkt</Tooltip>
          </HeaderButton>
          <HeaderButton
            onClick={() => setCategoriesOpen(true)}
            data-tip
            data-for={"product_header_categories"}
          >
            <Icons.FolderOpen />
            <Icons.List />
            <Tooltip handle={"product_header_categories"}>Kategorier</Tooltip>
          </HeaderButton>
        </HeaderButtons>
      </TableHeader>
      <TableContent>
        <ContentHeader bckColor={secondary} columns={tableStyles.header}>
          {extended && (
            <SortingKey
              onClick={dir => sortList(dir, 0, sort.by("productID", dir))}
              data-tip
              data-for={"product_header_id"}
            >
              #<Tooltip handle={"product_header_id"}>ID</Tooltip>
            </SortingKey>
          )}

          <SortingKey
            onClick={dir => sortList(dir, 1, sort.byName(dir))}
            data-tip
            data-for={"product_header_name"}
          >
            <Icons.FormatQuote />
            <Tooltip handle={"product_header_name"}>Navn</Tooltip>
          </SortingKey>

          {extended && (
            <>
              <SortingKey
                onClick={dir =>
                  sortList(dir, 2, sort.byCategory(categories.categories, dir))
                }
                data-tip
                data-for={"product_header_category"}
              >
                <Icons.FolderOpen />
                <Tooltip handle={"product_header_category"}>Kategori</Tooltip>
              </SortingKey>
              <Key data-tip data-for={"product_header_inventory"}>
                <Icons.Storage />
                <Tooltip handle={"product_header_inventory"}>På lager</Tooltip>
              </Key>
              <Key data-tip data-for={"product_header_ordered"}>
                <Icons.Archive />
                <Tooltip handle={"product_header_ordered"}>Bestilt</Tooltip>
              </Key>
              <Key data-tip data-for={"product_header_sales"}>
                <Icons.Unarchive />
                <Tooltip handle={"product_header_sales"}>Salg</Tooltip>
              </Key>
              {activeLoans && (
                <>
                  <Key data-tip data-for={"product_header_loans"}>
                    <Icons.Cached />
                    <Tooltip handle={"product_header_loans"}>Utlån</Tooltip>
                  </Key>
                </>
              )}
            </>
          )}
          <Key data-tip data-for={"product_header_total"}>
            <Icons.Functions />
            <Tooltip handle={"product_header_total"}>Totalt</Tooltip>
          </Key>

          <ExtendColumns extended={extended} setExtended={setExtended} />
          <div />

          <KeyButton
            onClick={() => dispatch(toggleVisible())}
            data-tip
            data-for={"product_header_visibility"}
            border="left"
          >
            {!showHidden ? <Icons.VisibilityOff /> : <Icons.Visibility />}
            <Tooltip handle={"product_header_visibility"}>
              {showHidden ? "Skjul" : "Vis"} inaktive produkter
            </Tooltip>
          </KeyButton>
        </ContentHeader>
        <ListWrapper>
          {productList &&
            productList.map(product => (
              <Product
                key={"product_" + product.productID}
                columns={tableStyles.item}
                product={product}
                extended={extended}
                edit={id => {
                  dispatch(setCurrentProduct(id));
                  setProductOpen(true);
                }}
                showHistory={() => setHistoryProduct(product)}
              />
            ))}
        </ListWrapper>
      </TableContent>
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
      {historyProduct && (
        <ProductHistory
          product={historyProduct}
          close={() => setHistoryProduct(null)}
        />
      )}
    </TableWrapper>
  );
}
