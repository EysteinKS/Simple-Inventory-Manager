import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  createSale,
  editSale,
  clearCurrentSale
} from "../../redux/actions/salesActions";

import EditSale from "../../components/inventory/EditModals/EditSale";
import SectionHeader, {
  Row,
  Title,
  Key,
  SortingKey,
  TDirections,
  HeaderTop,
  HeaderButtons,
  HeaderButton
} from "../../components/util/SectionHeader";
import Icons from "../../components/util/Icons";
import { newSale, sort } from "../../constants/util";

import useSortableList from "../../hooks/useSortableList";
import { RootState } from "../../redux/types";
import Sale from "./Sale";
import {
  TableWrapper,
  ListWrapper,
  TWidth,
  getTableStyle,
  TableHeader,
  TableContent,
  ContentHeader,
  ExtendColumns
} from "../../styles/table";
import { Tooltip } from "../../components/util/HoverInfo";
import useAuthLocation from "../../hooks/useAuthLocation";

export default function Sales() {
  const dispatch = useDispatch();
  const sales = useSelector((state: RootState) => state.sales);
  const customers = useSelector((state: RootState) => state.customers);
  const [isSaleOpen, setSaleOpen] = useState(false);
  const { secondary } = useAuthLocation();

  //SORTING
  const [sorting, setSorting] = useState([null, null, null] as any[]);
  const { sortedList, setList, sortFunc } = useSortableList(sales.sales);
  useEffect(() => {
    setList(sales.sales);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sales.sales]);
  const sortList = (dir: TDirections, index: number, func: Function) =>
    sortFunc(setSorting)(dir, index, func, sorting);

  const [extended, setExtended] = useState(() => window.innerWidth > 425);
  const tableStyles = useMemo(() => {
    let data: TWidth[] = ["large"];
    if (extended) {
      data.unshift("small");
      data.push("medium");
    }
    data.push("tiny", "tiny");
    return getTableStyle(data, 4);
  }, [extended]);

  const handleNewSale = () => {
    dispatch(createSale(newSale(sales.currentID + 1)));
    setSaleOpen(true);
  };

  return (
    <TableWrapper>
      <TableHeader bckColor={secondary}>
        <Title>Salg</Title>
        <HeaderButtons>
          <HeaderButton
            onClick={handleNewSale}
            data-tip
            data-for={"sales_header_add"}
          >
            <Icons.Add />
            <Tooltip handle={"sales_header_add"}>Nytt salg</Tooltip>
          </HeaderButton>
          <HeaderButton
            onClick={() => {}}
            data-tip
            data-for={"sales_header_customers"}
          >
            <Icons.Business />
            <Icons.List />
            <Tooltip handle={"sales_header_customers"}>Kunder</Tooltip>
          </HeaderButton>
        </HeaderButtons>
      </TableHeader>
      <TableContent>
        <ContentHeader bckColor={secondary} columns={tableStyles.header}>
          {extended && (
            <SortingKey
              onClick={dir => sortList(dir, 0, sort.by("saleID", dir))}
              data-tip
              data-for={"sales_header_id"}
            >
              #<Tooltip handle={"sales_header_id"}>ID</Tooltip>
            </SortingKey>
          )}

          <SortingKey
            onClick={dir =>
              sortList(dir, 1, sort.byCustomer(customers.customers, dir))
            }
            data-tip
            data-for={"sales_header_customer"}
          >
            <Icons.Business />
            <Tooltip handle={"sales_header_customer"}>Kunde</Tooltip>
          </SortingKey>

          {extended && (
            <SortingKey
              onClick={dir => sortList(dir, 2, sort.by("dateOrdered", dir))}
              data-tip
              data-for={"sales_header_ordered"}
            >
              <Icons.AccessTime />
              <Tooltip handle={"sales_header_ordered"}>Dato bestilt</Tooltip>
            </SortingKey>
          )}

          <Key data-tip data-for={"sales_header_amount"}>
            <Icons.ShoppingCart />
            <Tooltip handle={"sales_header_amount"}>Antall produkter</Tooltip>
          </Key>

          <ExtendColumns extended={extended} setExtended={setExtended} />
          <div />
        </ContentHeader>
        <ListWrapper>
          {sortedList &&
            sortedList.map(sale => (
              <Sale
                sale={sale}
                extended={extended}
                columns={tableStyles.item}
                key={"sale_" + sale.saleID}
                edit={id => {
                  dispatch(editSale(id));
                  setSaleOpen(true);
                }}
              />
            ))}
        </ListWrapper>
      </TableContent>
      {isSaleOpen && (
        <EditSale
          isOpen={isSaleOpen}
          close={() => {
            setSaleOpen(false);
            dispatch(clearCurrentSale());
          }}
        />
      )}
    </TableWrapper>
  );
}
