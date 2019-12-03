import React, { useMemo, useState } from "react";
import HistoryModal from "../../components/inventory/HistoryModals";
import { ICustomer, RootState, ISale, ILoan } from "../../redux/types";
import { useSelector } from "react-redux";
import {
  ItemWrapper,
  ItemText,
  ExpandButton,
  ExpandedHistoryItem,
  ExpandedHistoryListItem
} from "../../components/inventory/HistoryModals/styles";
import { shortDate } from "../../constants/dates";
import useAuthLocation from "../../hooks/useAuthLocation";
import Icons from "../../components/util/Icons";
import Names from "../../components/Names";

interface CustomerHistoryProps {
  customer: ICustomer;
  close: () => void;
}

type HistoryContent = ISale | ILoan;

const CustomerHistory: React.FC<CustomerHistoryProps> = ({
  customer,
  close
}) => {
  const salesHistory = useSelector((state: RootState) =>
    state.sales.history.filter(s => s.customerID === customer.customerID)
  );

  const loansHistory = useSelector((state: RootState) =>
    state.loans.history.filter(l => l.customerID === customer.customerID)
  );

  const history = useMemo(() => {
    let history: HistoryContent[] = [...salesHistory, ...loansHistory];
    return history.sort((a, b) => {
      let aDate: number, bDate: number;

      if (a.hasOwnProperty("saleID")) {
        let sale = a as ISale;
        aDate = Date.parse(sale.dateSent as string);
      } else {
        let loan = a as ILoan;
        aDate = Date.parse(loan.dateReceived as string);
      }

      if (b.hasOwnProperty("saleID")) {
        let sale = b as ISale;
        bDate = Date.parse(sale.dateSent as string);
      } else {
        let loan = b as ILoan;
        bDate = Date.parse(loan.dateReceived as string);
      }

      return aDate - bDate;
    });
  }, [salesHistory, loansHistory]);

  const columns = "repeat(4, 4fr) 2fr 1fr";

  return (
    <HistoryModal
      isOpen={Boolean(customer)}
      close={close}
      label="Customer History"
      name={customer.name}
      columns={columns}
      columnNames={["Type/ID", "Bestilt", "Sendt", "Mottatt", "Antall"]}
    >
      {history.map((item, i) => (
        <HistoryItem
          key={`customer_${customer.customerID}_transaction_${i}`}
          columns={columns}
          history={item}
        />
      ))}
    </HistoryModal>
  );
};

interface IHistoryItem {
  columns: string;
  history: ISale | ILoan;
}

const HistoryItem: React.FC<IHistoryItem> = ({ columns, history }) => {
  const [expanded, setExpanded] = useState(false);
  const { dark } = useAuthLocation();

  const orderedAmount = useMemo(() => {
    return history.ordered.reduce((acc, cur) => {
      acc += cur.amount;
      return acc;
    }, 0);
  }, [history]);

  const item = useMemo(() => {
    let itemData = {
      id: "",
      ordered: "",
      sent: "",
      received: ""
    };
    const isSale = history.hasOwnProperty("saleID");
    if (isSale) {
      let sale = history as ISale;
      itemData.id = `Salg #${sale.saleID}`;
      itemData.ordered = shortDate(sale.dateOrdered) as string;
      itemData.sent = shortDate(sale.dateSent) as string;
    } else {
      let loan = history as ILoan;
      itemData.id = `Utlån #${loan.loanID}`;
      itemData.ordered = shortDate(loan.dateOrdered) as string;
      itemData.sent = shortDate(loan.dateSent) as string;
      itemData.received = shortDate(loan.dateReceived) as string;
    }
    return itemData;
  }, [history]);

  return (
    <>
      <ItemWrapper columns={columns} expanded={expanded ? dark : null}>
        <ItemText>{item.id}</ItemText>
        <ItemText>{item.ordered}</ItemText>
        <ItemText>{item.sent}</ItemText>
        <ItemText>{item.received}</ItemText>
        <ItemText>{orderedAmount}</ItemText>
        <ExpandButton onClick={() => setExpanded(!expanded)}>
          {expanded ? <Icons.Close /> : <Icons.List />}
        </ExpandButton>
      </ItemWrapper>
      {expanded && (
        <ExpandedHistoryItem borderColor={dark}>
          {history.ordered.map(product => (
            <ExpandedHistoryListItem
              key={`${item.id}_product_${product.productID}`}
              columns="1fr 2fr 1fr"
            >
              <ItemText>#{product.productID}</ItemText>
              <ItemText>
                <Names target="products" id={product.productID} />
              </ItemText>
              <ItemText>{product.amount}x</ItemText>
            </ExpandedHistoryListItem>
          ))}
        </ExpandedHistoryItem>
      )}
    </>
  );
};

export default CustomerHistory;
