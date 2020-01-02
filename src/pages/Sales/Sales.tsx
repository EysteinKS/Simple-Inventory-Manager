import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";

import EditSale from "../../components/inventory/EditModals/EditSale";
import {
  Title,
  Key,
  SortingKey,
  TDirections,
  HeaderButtons,
  HeaderButton
} from "../../components/util/SectionHeader";
import Icons from "../../components/util/Icons";
import { sort } from "../../constants/util";

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
import useSales from "../../redux/hooks/useSales";

export default function Sales() {
  const { sales, createNewSale, editSale, clearCurrentSale } = useSales();
  const customers = useSelector((state: RootState) => state.customers);
  const [isSaleOpen, setSaleOpen] = useState(false);
  const { secondary } = useAuthLocation();

  //SORTING
  const [sorting, setSorting] = useState([null, null, null] as any[]);
  const { sortedList, setList, sortFunc } = useSortableList(sales);
  useEffect(() => {
    setList(sales);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sales]);
  const sortList = (dir: TDirections, index: number, func: Function) =>
    sortFunc(setSorting)(dir, index, func, sorting);

  //SIZE
  const [extended, setExtended] = useState(() => window.innerWidth > 425);
  const tableStyles = useMemo(() => {
    let data: TWidth[] = ["large"];
    if (extended) {
      data.unshift("small");
      data.push("medium");
    }
    data.push("tiny", "tiny", "tiny");
    return getTableStyle(data, 4);
  }, [extended]);

  const handleNewSale = () => {
    createNewSale();
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
            <Icons.Customers />
            <Tooltip handle={"sales_header_customer"}>Kunde</Tooltip>
          </SortingKey>

          {extended && (
            <SortingKey
              onClick={dir => sortList(dir, 2, sort.by("dateOrdered", dir))}
              data-tip
              data-for={"sales_header_ordered"}
            >
              <Icons.Calendar />
              <Tooltip handle={"sales_header_ordered"}>Dato bestilt</Tooltip>
            </SortingKey>
          )}

          <Key data-tip data-for={"sales_header_amount"}>
            <Icons.ShoppingCart />
            <Tooltip handle={"sales_header_amount"}>Antall produkter</Tooltip>
          </Key>

          <Key data-tip data-for={"sales_header_ready"}>
            <Icons.Check />
            <Tooltip handle={"sales_header_ready"}>Klar for sending</Tooltip>
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
                  editSale(id);
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
            clearCurrentSale();
          }}
        />
      )}
    </TableWrapper>
  );
}
