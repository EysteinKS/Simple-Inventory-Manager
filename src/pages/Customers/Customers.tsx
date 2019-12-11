import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import useAuthLocation from "../../hooks/useAuthLocation";
import { RootState, ICustomer } from "../../redux/types";
import useSortableList from "../../hooks/useSortableList";
import {
  TDirections,
  Title,
  HeaderButtons,
  HeaderButton,
  SortingKey
} from "../../components/util/SectionHeader";
import {
  TWidth,
  getTableStyle,
  TableWrapper,
  TableHeader,
  TableContent,
  ContentHeader,
  ListWrapper
} from "../../styles/table";
import Icons from "../../components/util/Icons";
import { Tooltip } from "../../components/util/HoverInfo";
import { sort } from "../../constants/util";
import Customer from "./Customer";
import NewCustomer from "./NewCustomer";
import CustomerHistory from "./CustomerHistory";

const Customers = () => {
  const customers = useSelector(
    (state: RootState) => state.customers.customers
  );
  const { secondary } = useAuthLocation();

  const [sorting, setSorting] = useState([null, null] as any[]);
  const { sortedList, setList, sortFunc } = useSortableList(customers);
  useEffect(() => {
    setList(customers);
    /* eslint-disable-next-line */
  }, [customers]);
  const sortList = (dir: TDirections, index: number, func: Function) =>
    sortFunc(setSorting)(dir, index, func, sorting);

  const tableStyles = useMemo(() => {
    let data: TWidth[] = ["tiny", "large"];
    return getTableStyle(data, 1);
  }, []);

  const [isNewCustomerOpen, setNewCustomerOpen] = useState(false);
  const closeNewCustomer = () => setNewCustomerOpen(false);

  const handleNewCustomer = () => {
    setNewCustomerOpen(true);
  };

  const [historyCustomer, setHistoryCustomer] = useState(
    null as ICustomer | null
  );

  return (
    <TableWrapper>
      <TableHeader bckColor={secondary}>
        <Title>Kunder</Title>
        <HeaderButtons>
          <HeaderButton
            onClick={handleNewCustomer}
            data-tip
            data-for={"customer_header_add"}
          >
            <Icons.Add />
            <Tooltip handle={"customer_header_add"}>Ny kunde</Tooltip>
          </HeaderButton>
        </HeaderButtons>
      </TableHeader>
      <TableContent>
        <ContentHeader bckColor={secondary} columns={tableStyles.header}>
          <SortingKey
            onClick={dir => sortList(dir, 0, sort.by("customerID", dir))}
            data-tip
            data-for={"customer_header_id"}
          >
            #<Tooltip handle={"customer_header_id"}>ID</Tooltip>
          </SortingKey>
          <SortingKey
            onClick={dir => sortList(dir, 0, sort.byName(dir))}
            data-tip
            data-for={"customer_header_name"}
          >
            <Icons.Name />
            <Tooltip handle={"customer_header_name"}>Navn</Tooltip>
          </SortingKey>
        </ContentHeader>
        <ListWrapper>
          {sortedList.map(c => (
            <Customer
              key={"customer_" + c.customerID}
              customer={c}
              history={() => setHistoryCustomer(c)}
              columns={tableStyles.item}
            />
          ))}
        </ListWrapper>
      </TableContent>
      {isNewCustomerOpen && (
        <NewCustomer isOpen={isNewCustomerOpen} onClose={closeNewCustomer} />
      )}
      {historyCustomer && (
        <CustomerHistory
          customer={historyCustomer}
          close={() => setHistoryCustomer(null)}
        />
      )}
    </TableWrapper>
  );
};

export default Customers;
