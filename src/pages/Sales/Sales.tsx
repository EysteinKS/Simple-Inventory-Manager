import React, { useState, useEffect } from "react";
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
import { TableWrapper, ListWrapper } from "../../styles/table";
import { Tooltip } from "../../components/util/HoverInfo";

export default function Sales() {
  const dispatch = useDispatch();
  const sales = useSelector((state: RootState) => state.sales);
  const customers = useSelector((state: RootState) => state.customers);
  const [isSaleOpen, setSaleOpen] = useState(false);

  //SORTING
  const [sorting, setSorting] = useState([null, null, null] as any[]);
  const { sortedList, setList, sortFunc } = useSortableList(sales.sales);
  useEffect(() => {
    setList(sales.sales);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sales.sales]);
  const sortList = (dir: TDirections, index: number, func: Function) =>
    sortFunc(setSorting)(dir, index, func, sorting);

  const handleNewSale = () => {
    dispatch(createSale(newSale(sales.currentID + 1)));
    setSaleOpen(true);
  }


  return (
    <TableWrapper>
      <SectionHeader>
        <HeaderTop>
          <Title>Salg</Title>
          <HeaderButtons>
            <HeaderButton onClick={handleNewSale} data-tip data-for={"sales_header_add"}>
              <Icons.Add/>
            </HeaderButton>
            <Tooltip handle={"sales_header_add"}>
              Nytt salg
            </Tooltip>
            <HeaderButton onClick={() => {}} data-tip data-for={"sales_header_customers"}>
              <Icons.Business/><Icons.List/>
            </HeaderButton>
            <Tooltip handle={"sales_header_customers"}>
              Kunder
            </Tooltip>
          </HeaderButtons>
        </HeaderTop>
        <Row grid="10% 15% 15% 10%">
          <SortingKey 
            onClick={dir => sortList(dir, 0, sort.by("saleID", dir))}
            data-tip data-for={"sales_header_id"}  
          >
            #
          </SortingKey>
          <Tooltip handle={"sales_header_id"}>
            ID
          </Tooltip>

          <SortingKey
            onClick={dir =>
              sortList(dir, 1, sort.byCustomer(customers.customers, dir))
            }
            data-tip data-for={"sales_header_customer"}
          >
            <Icons.Business />
          </SortingKey>
          <Tooltip handle={"sales_header_customer"}>
            Kunde
          </Tooltip>

          <SortingKey
            onClick={dir => sortList(dir, 2, sort.by("dateOrdered", dir))}
            data-tip data-for={"sales_header_ordered"}
          >
            <Icons.AccessTime />
          </SortingKey>
          <Tooltip handle={"sales_header_ordered"}>
            Dato bestilt
          </Tooltip>

          <Key data-tip data-for={"sales_header_amount"}>
            <Icons.ShoppingCart />
          </Key>
          <Tooltip handle={"sales_header_amount"}>
            Antall produkter
          </Tooltip>
        </Row>
      </SectionHeader>
      <ListWrapper>
        {sortedList &&
          sortedList.map((sale, index) => (
            <Sale 
              sale={sale}
              key={"sale_" + sale.saleID}
              edit={id => {
                dispatch(editSale(id));
                setSaleOpen(true);
              }}
              index={index}
            />
        ))}
      </ListWrapper>
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