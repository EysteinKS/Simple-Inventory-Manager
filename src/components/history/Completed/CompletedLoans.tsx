import React from "react";
import HistoryTable from "./HistoryTable";
import { useSelector } from "react-redux";
import { selectProductNames } from "../../../redux/selectors/productSelectors";
import { RootState } from "../../../redux/types";
import { shouldLog } from "../../../constants/util";
import { ExpandableRow } from "../../util/ExpandableRow";
import OrderedProducts from "./OrderedProducts";

const localeStringOpts = {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
  hour: "2-digit",
  minute: "2-digit"
};

const CompletedLoans = () => {
  const productNames = useSelector(selectProductNames);
  const customers = useSelector(
    (state: RootState) => state.customers.customers
  );
  const loanHistory = useSelector((state: RootState) => state.loans.history);

  const loansColumns = React.useMemo(() => {
    return [
      { name: "ID", width: "10%" },
      { name: "CUSTOMER", width: "20%" },
      { name: "ORDERED", width: "20%" },
      { name: "SENT", width: "20%" },
      { name: "RECEIVED", width: "20%" },
      { name: "AMOUNT", width: "10%" }
    ];
  }, []);

  const loansContent = React.useMemo(() => {
    shouldLog("Calculating content in orders history");
    let sorted = [...loanHistory].sort((a, b) => {
      return a.loanID - b.loanID;
    });
    return sorted.map(loan => {
      let customerName =
        customers[customers.findIndex(i => i.customerID === loan.customerID)]
          .name;
      let ordered = new Date(loan.dateOrdered as string).toLocaleString(
        "default",
        localeStringOpts
      );
      let sent = new Date(loan.dateSent as string).toLocaleString(
        "default",
        localeStringOpts
      );
      let received = new Date(loan.dateReceived as string).toLocaleString(
        "default",
        localeStringOpts
      );
      let amount = loan.ordered.reduce((acc, cur) => {
        acc += cur.amount;
        return acc;
      }, 0);
      let columns = [
        loan.loanID,
        customerName,
        ordered,
        sent,
        received,
        amount
      ];
      return (
        <ExpandableRow
          key={"order_history_" + loan.loanID}
          columns={columns}
          isDeleted={false}
        >
          <OrderedProducts
            id={"order_" + loan.loanID}
            ordered={loan.ordered}
            names={productNames}
            columns={6}
          />
        </ExpandableRow>
      );
    });
  }, [loanHistory, customers, productNames]);

  if (loanHistory.length > 0) {
    return (
      <HistoryTable name="Loans" columns={loansColumns}>
        {loansContent}
      </HistoryTable>
    );
  } else {
    return null;
  }
};

export default CompletedLoans;
