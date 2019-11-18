import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState, ILoan } from "../../redux/types";
import useSortableList from "../../hooks/useSortableList";
import SectionHeader, {
  TDirections,
  Row,
  Title,
  RowSplitter,
  SortingKey,
  ColumnSplitter,
  Key,
  HeaderTop,
  HeaderButtons,
  HeaderButton
} from "../../components/util/SectionHeader";
import { sort, isArrayEmpty } from "../../constants/util";
import Icons from "../../components/util/Icons";
import EditLoan from "../../components/inventory/EditModals/EditLoan";
import useLoans from "../../redux/hooks/useLoans";
import Loan from "./Loan";
import { TableWrapper, ListWrapper } from "../../styles/table";
import { Tooltip } from "../../components/util/HoverInfo";

export default function Loans() {
  const loans = useSelector((state: RootState) => state.loans);
  const customers = useSelector((state: RootState) => state.customers);
  const [isLoanOpen, setLoanOpen] = useState(false);

  const { createNewLoan, editLoan, clearCurrentLoan } = useLoans();

  //SORTING
  const [sorting, setSorting] = useState([null, null, null] as any[]);
  const { sortedList, setList, sortFunc } = useSortableList(loans.loans);

  useEffect(() => {
    setList(loans.loans);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loans.loans]);

  const sortList = (dir: TDirections, index: number, func: Function) =>
    sortFunc(setSorting)(dir, index, func, sorting);

  const handleNewLoan = () => {
    createNewLoan();
    setLoanOpen(true);
  };

  return (
    <TableWrapper>
      <SectionHeader>
        <HeaderTop>
          <Title>Utlån</Title>
          <HeaderButtons>
            <HeaderButton
              onClick={handleNewLoan}
              data-tip
              data-for={"loans_header_add"}
            >
              <Icons.Add />
            </HeaderButton>
            <Tooltip handle={"loans_header_add"}>Nytt utlån</Tooltip>

            <HeaderButton data-tip data-for={"loans_header_customers"}>
              <Icons.Business />
              <Icons.List />
            </HeaderButton>
            <Tooltip handle={"loans_header_customers"}>Kunder</Tooltip>
          </HeaderButtons>
        </HeaderTop>

        <Row grid="10% repeat(3, 15%) 10%">
          <SortingKey
            onClick={dir => sortList(dir, 0, sort.by("loanID", dir))}
            data-tip
            data-for={"loans_header_id"}
          >
            #
          </SortingKey>
          <Tooltip handle={"loans_header_id"}>ID</Tooltip>

          <SortingKey
            onClick={dir =>
              sortList(dir, 1, sort.byCustomer(customers.customers, dir))
            }
            data-tip
            data-for={"loans_header_customer"}
          >
            <Icons.Business />
          </SortingKey>
          <Tooltip handle={"loans_header_customer"}>Kunde</Tooltip>

          <SortingKey
            onClick={dir => sortList(dir, 2, sort.by("dateOrdered", dir))}
            data-tip
            data-for={"loans_header_ordered"}
          >
            <Icons.AccessTime />
          </SortingKey>
          <Tooltip handle={"loans_header_ordered"}>Dato bestilt</Tooltip>

          <SortingKey
            onClick={dir => sortList(dir, 2, sort.by("dateSent", dir))}
            data-tip
            data-for={"loans_header_sent"}
          >
            <Icons.Unarchive />
          </SortingKey>
          <Tooltip handle={"loans_header_sent"}>Dato sendt</Tooltip>

          <Key data-tip data-for={"loans_header_amount"}>
            <Icons.ShoppingCart />
          </Key>
          <Tooltip handle={"loans_header_amount"}>Antall produkter</Tooltip>
        </Row>
      </SectionHeader>
      <ListWrapper>
        {sortedList &&
          sortedList.map((loan, index) => (
            <Loan
              key={"loans_" + index}
              loan={loan}
              edit={id => {
                editLoan(id);
                setLoanOpen(true);
              }}
              index={index}
            />
          ))}
      </ListWrapper>
      {isLoanOpen && (
        <EditLoan
          isOpen={isLoanOpen}
          close={() => {
            setLoanOpen(false);
            clearCurrentLoan();
          }}
        />
      )}
    </TableWrapper>
  );
}
