import React, { useMemo, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  RootState,
  ICategory,
  ICustomer,
  ISupplier,
  IChangeTypes
} from "../../redux/types";
import useSortableList from "../../hooks/useSortableList";
import styled from "styled-components";
import { SortingKey, TDirections } from "../util/SectionHeader";
import Icons from "../util/Icons";
import { sort } from "../../constants/util";

import { saveCreatedCustomer } from "../../redux/actions/customersActions";
import { saveCreatedCategory } from "../../redux/actions/categoriesActions";
import { saveCreatedSupplier } from "../../redux/actions/suppliersActions";
import { addChange } from "../../redux/actions/reportsActions";
import { InputButton } from "../../styles/form";
import { verticalScroll } from "../../styles/scroll";

/**
 * Used by EditModals to select targets such as supplier, category and customer
 * Able to add new of each
 */

interface IProps {
  type: "categories" | "customers" | "suppliers";
  select: (id: number) => void;
}

type TargetsType = ICategory[] | ICustomer[] | ISupplier[];
type ItemTypes = ICategory | ICustomer | ISupplier;

const SelectTarget: React.FC<IProps> = ({ type, select }) => {
  const targets = useSelector((state: RootState) => state[type][type]) as any[];

  const idKey = useMemo(() => {
    switch (type) {
      case "categories":
        return "categoryID";
      case "customers":
        return "customerID";
      default:
        return "supplierID";
    }
  }, [type]);

  //SEARCH & SORT
  const [sorting, setSorting] = useState([null, null] as any[]);
  const { sortedList, setList, sortFunc } = useSortableList(targets);

  useEffect(() => {
    if (targets.length !== sortedList.length) {
      setList(targets);
    }
  }, [targets, setList, sortedList.length]);

  const sortList = (dir: TDirections, index: number, func: Function) =>
    sortFunc(setSorting)(dir, index, func, sorting);

  const [searchString, setSearchString] = useState("");
  const targetList = React.useMemo(() => {
    if (searchString.length < 1) {
      return sortedList;
    }
    let search = searchString.toLowerCase();
    return sortedList.filter(item => {
      let itemName = item.name.toLowerCase();
      return itemName.includes(search);
    });
  }, [sortedList, searchString]);

  return (
    <StyledWrapper>
      <TargetHeader
        search={searchString}
        setSearch={setSearchString}
        sortList={sortList}
        idKey={idKey}
      />
      <ScrollableList>
        {targetList.map(item => (
          <TargetItem key={"select_" + item.name} item={item} select={select} />
        ))}
        <AddItem targets={targets} type={type} />
      </ScrollableList>
    </StyledWrapper>
  );
};

interface HeaderProps {
  search: string;
  setSearch: (search: string) => void;
  sortList: (dir: TDirections, index: number, func: Function) => void;
  idKey: string;
}

const TargetHeader: React.FC<HeaderProps> = ({
  search,
  setSearch,
  sortList,
  idKey
}) => {
  const [isSearching, setSearching] = useState(false);

  if (isSearching) {
    return (
      <StyledHeader>
        <CenteredText>Søk</CenteredText>
        <input
          autoFocus
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <InputButton onClick={() => setSearching(false)}>
          <Icons.Done />
        </InputButton>
      </StyledHeader>
    );
  }

  return (
    <StyledHeader>
      <SortingKey onClick={dir => sortList(dir, 0, sort.by(idKey, dir))}>
        #
      </SortingKey>
      <SortingKey onClick={dir => sortList(dir, 1, sort.byName(dir))}>
        <Icons.Name />
      </SortingKey>
      <InputButton onClick={() => setSearching(true)}>
        <Icons.Search />
      </InputButton>
    </StyledHeader>
  );
};

interface ItemProps {
  item: ItemTypes;
  select: (id: number) => void;
}

const TargetItem: React.FC<ItemProps> = ({ item, select }) => {
  const ID = useMemo(() => {
    if ((item as ICategory).categoryID) {
      return (item as ICategory).categoryID;
    } else if ((item as ICustomer).customerID) {
      return (item as ICustomer).customerID;
    } else if ((item as ISupplier).supplierID) {
      return (item as ISupplier).supplierID;
    } else {
      return 0;
    }
  }, [item]);

  const name = useMemo(() => {
    return item.name;
  }, [item]);

  return (
    <StyledTargetItem>
      <CenteredText>{ID}</CenteredText>
      <CenteredText>{name}</CenteredText>
      <InputButton onClick={() => select(ID)}>
        <Icons.Check />
      </InputButton>
    </StyledTargetItem>
  );
};

interface AddItemProps {
  targets: TargetsType;
  type: "categories" | "customers" | "suppliers";
}

const AddItem: React.FC<AddItemProps> = ({ targets, type }) => {
  const [doAdd, setAdd] = useState(false);
  const [name, setName] = useState("");
  const dispatch = useDispatch();

  const ID = targets.length + 1;

  const { changeType, saveAction } = useMemo((): {
    changeType: IChangeTypes;
    saveAction: Function;
  } => {
    switch (type) {
      case "categories":
        return { changeType: "NEW_CATEGORY", saveAction: saveCreatedCategory };
      case "customers":
        return { changeType: "NEW_CUSTOMER", saveAction: saveCreatedCustomer };
      case "suppliers":
        return { changeType: "NEW_SUPPLIER", saveAction: saveCreatedSupplier };
      default:
        return { changeType: "NEW_CATEGORY", saveAction: (name: string) => {} };
    }
  }, [type]);

  const save = () => {
    dispatch(
      addChange({
        type: changeType,
        id: ID,
        name,
        section: type
      })
    );
    dispatch(saveAction(name));
    setAdd(false);
    setName("");
  };

  if (doAdd) {
    return (
      <AddWrapper>
        <CenteredText>{ID}</CenteredText>
        <AddInput
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <InputButton onClick={save}>
          <Icons.Save />
        </InputButton>
        <InputButton
          onClick={() => {
            setAdd(false);
            setName("");
          }}
        >
          <Icons.Close />
        </InputButton>
      </AddWrapper>
    );
  }

  return (
    <AddButton onClick={() => setAdd(true)}>
      <Icons.Add />
    </AddButton>
  );
};

const StyledWrapper = styled.div`
  background-color: #eee;
`;

const StyledHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 5fr 1fr;
  height: 40px;
  background-color: #eee;
`;

const CenteredText = styled.p`
  text-align: center;
  margin: 0;
  place-self: center;
`;

const StyledTargetItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 5fr 1fr;
  height: 35px;
  padding: 0.3em;
  background-color: #f8f8f8;
  :nth-child(2n) {
    background-color: #fff;
  }

  p {
    margin: 0;
    place-self: center;
    font-size: 12px;
  }
`;

const AddButton = styled.button`
  height: 35px;
  padding: 0.3em;
  background: none;
  border: none;
`;

const AddWrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 10fr 1fr 1fr;
  background-color: #f3f3f3;
  padding: 0.3em;
`;

const AddInput = styled.input``;

const ScrollableList = styled.div`
  max-height: 50vh;
  ${verticalScroll}
`;

export default SelectTarget;
