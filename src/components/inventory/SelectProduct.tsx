import React, { useMemo, useState, useEffect } from "react";
import { IOrderedProduct, RootState, IProduct } from "../../redux/types";
import { useSelector } from "react-redux";
import { TDirections, SortingKey } from "../util/SectionHeader";
import styled from "styled-components";
import useSortableList from "../../hooks/useSortableList";
import Names from "../Names";
import { sort } from "../../constants/util";
import Icons from "../util/Icons";
import { InputButton as FormInputButton } from "../../styles/form";
import { StyledList } from "../../styles/list";
import useAuthLocation from "../../hooks/useAuthLocation";

interface ISelectProduct {
  products: IProduct[];
  height?: string;
  ignoreInactive?: boolean;
  onSelect: (id: number) => void;
  selected: IOrderedProduct[];
}

const SelectProduct: React.FC<ISelectProduct> = ({
  products,
  height = "57vh",
  ignoreInactive = false,
  onSelect,
  selected
}) => {
  const [search, setSearch] = useState("");
  const { dark } = useAuthLocation();

  const list = useMemo(() => {
    let productList: IProduct[] = [];
    if (ignoreInactive) {
      productList = products;
    } else {
      productList = products.filter(product => product.active);
    }
    if (Array.isArray(selected) && selected.length > 0) {
      const selectedIDs = selected.map(sel => sel.productID);
      productList = productList.filter(
        product => !selectedIDs.includes(product.productID)
      );
    }
    if (search.length > 0) {
      productList = productList.filter(product => {
        let searchQuery = search.toLowerCase();
        let productName = product.name.toLowerCase();
        return productName.includes(searchQuery);
      });
    }
    return productList;
  }, [products, selected, search, ignoreInactive]);

  const [sorting, setSorting] = useState([null, null] as any[]);
  const { sortedList, setList, sortFunc } = useSortableList(list);
  const sortList = (dir: TDirections, index: number, func: Function) =>
    sortFunc(setSorting)(dir, index, func, sorting);

  useEffect(() => {
    setList(list);
    /* eslint-disable-next-line */
  }, [list]);

  return (
    <>
      <SelectHeader setSearch={setSearch} sortList={sortList} />
      <StyledList borderColor={dark}>
        {sortedList.map(prod => (
          <Product
            key={"selectable_product_" + prod.productID}
            product={prod}
            onSelect={onSelect}
          />
        ))}
      </StyledList>
    </>
  );
};

interface ISelectHeader {
  setSearch: (search: string) => void;
  sortList: (dir: TDirections, index: number, func: Function) => void;
}

const SelectHeader: React.FC<ISelectHeader> = ({ setSearch, sortList }) => {
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );
  const [isSearching, setSearching] = useState(false);
  const [input, setInput] = useState("");

  const search = (str: string) => {
    setInput(str);
    setSearch(str);
  };

  if (isSearching) {
    return (
      <StyledHeader>
        <SearchInput
          autoFocus
          type="text"
          value={input}
          onChange={e => search(e.target.value)}
        />
        <FormInputButton onClick={() => setSearching(false)}>
          <Icons.Done />
        </FormInputButton>
      </StyledHeader>
    );
  }

  return (
    <StyledHeader>
      <SortingKey onClick={dir => sortList(dir, 0, sort.byName(dir))}>
        <Icons.Name />
      </SortingKey>
      <SortingKey
        onClick={dir => sortList(dir, 0, sort.byCategory(categories, dir))}
      >
        <Icons.FolderOpen />
      </SortingKey>
      <FormInputButton onClick={() => setSearching(true)}>
        <Icons.Search />
      </FormInputButton>
    </StyledHeader>
  );
};

interface ProductProps {
  product: IProduct;
  onSelect: (id: number) => void;
}
const Product = ({ product, onSelect }: ProductProps) => {
  const { productID, name, categoryID } = product;
  return (
    <ProductWrapper>
      <CenteredText>{name}</CenteredText>
      <CenteredText>
        <Names target="categories" id={categoryID} />
      </CenteredText>
      <FormInputButton
        onClick={e => {
          e.preventDefault();
          onSelect(productID);
        }}
      >
        <Icons.Add />
      </FormInputButton>
    </ProductWrapper>
  );
};

const StyledHeader = styled.div`
  display: grid;
  grid-template-columns: 3fr 3fr 1fr;
  height: auto;
  background-color: white;
`;

const CenteredText = styled.p`
  text-align: center;
`;

const SearchInput = styled.input`
  grid-column: span 2;
  margin: 0.3em;
`;

const ProductWrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 3fr 1fr;
  height: 35px;
  padding: 0.3em;
  background-color: #e8e8e8;
  :nth-child(2n) {
    background-color: #f3f3f3;
  }

  p {
    padding: 0;
    margin: 0;
    place-self: center;
    font-size: 12px;
  }
`;

export default SelectProduct;
