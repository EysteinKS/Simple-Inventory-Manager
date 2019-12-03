import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/types";
import useSortableList from "../../hooks/useSortableList";
import {
  TDirections,
  Title,
  SortingKey,
  Key,
  HeaderButtons,
  HeaderButton
} from "../../components/util/SectionHeader";
import { sort } from "../../constants/util";
import Icons from "../../components/util/Icons";
import EditLoan from "../../components/inventory/EditModals/EditLoan";
import useLoans from "../../redux/hooks/useLoans";
import Loan from "./Loan";
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

export default function Loans() {
  const loans = useSelector((state: RootState) => state.loans);
  const customers = useSelector((state: RootState) => state.customers);
  const [isLoanOpen, setLoanOpen] = useState(false);
  const { secondary } = useAuthLocation();

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

  const [extended, setExtended] = useState(() => window.innerWidth > 425);
  const tableStyles = useMemo(() => {
    let data: TWidth[] = ["large"];
    if (extended) {
      data.unshift("small");
      data.push("medium", "medium");
    }
    data.push("tiny", "tiny");
    return getTableStyle(data, 5);
  }, [extended]);

  const handleNewLoan = () => {
    createNewLoan();
    setLoanOpen(true);
  };

  return (
    <TableWrapper>
      <TableHeader bckColor={secondary}>
        <Title>Utlån</Title>
        <HeaderButtons>
          <HeaderButton
            onClick={handleNewLoan}
            data-tip
            data-for={"loans_header_add"}
          >
            <Icons.Add />
            <Tooltip handle={"loans_header_add"}>Nytt utlån</Tooltip>
          </HeaderButton>
        </HeaderButtons>
      </TableHeader>
      <TableContent>
        <ContentHeader bckColor={secondary} columns={tableStyles.header}>
          {extended && (
            <>
              <SortingKey
                onClick={dir => sortList(dir, 0, sort.by("loanID", dir))}
                data-tip
                data-for={"loans_header_id"}
              >
                #
              </SortingKey>
              <Tooltip handle={"loans_header_id"}>ID</Tooltip>
            </>
          )}

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
          {extended && (
            <>
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
            </>
          )}
          <Key data-tip data-for={"loans_header_amount"}>
            <Icons.ShoppingCart />
          </Key>
          <Tooltip handle={"loans_header_amount"}>Antall produkter</Tooltip>
          <ExtendColumns extended={extended} setExtended={setExtended} />
          <div />
        </ContentHeader>
        <ListWrapper>
          {sortedList &&
            sortedList.map((loan, index) => (
              <Loan
                key={"loans_" + index}
                columns={tableStyles.item}
                extended={extended}
                loan={loan}
                edit={id => {
                  editLoan(id);
                  setLoanOpen(true);
                }}
              />
            ))}
        </ListWrapper>
      </TableContent>
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
