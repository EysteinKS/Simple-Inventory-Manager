import React, { useState, useMemo } from "react";
import HistoryModal from "../../components/inventory/HistoryModals";
import { ISupplier, RootState, IOrder } from "../../redux/types";
import { useSelector } from "react-redux";
import {
  ItemWrapper,
  ItemText,
  ExpandButton,
  ExpandedHistoryItem,
  ExpandedHistoryListItem
} from "../../components/inventory/HistoryModals/styles";
import { shortDate } from "../../constants/dates";
import Icons from "../../components/util/Icons";
import Names from "../../components/Names";
import useAuthLocation from "../../hooks/useAuthLocation";

interface SupplierHistoryProps {
  supplier: ISupplier;
  close: () => void;
}

const SupplierHistory: React.FC<SupplierHistoryProps> = ({
  supplier,
  close
}) => {
  const history = useSelector((state: RootState) =>
    state.orders.history.filter(o => o.supplierID === supplier.supplierID)
  );
  const columns = "repeat(3, 4fr) 2fr 1fr";

  return (
    <HistoryModal
      isOpen={Boolean(supplier)}
      close={close}
      label="Supplier History"
      name={supplier.name}
      columns={columns}
      columnNames={["Type/ID", "Bestilt", "Mottatt", "Antall"]}
    >
      {history.map(order => (
        <HistoryItem
          key={`supplier_${supplier.supplierID}_order_${order.orderID}`}
          columns={columns}
          order={order}
        />
      ))}
    </HistoryModal>
  );
};

interface IHistoryItem {
  columns: string;
  order: IOrder;
}

const HistoryItem: React.FC<IHistoryItem> = ({ columns, order }) => {
  const [expanded, setExpanded] = useState(false);
  const { dark } = useAuthLocation();

  const orderedAmount = useMemo(() => {
    return order.ordered.reduce((acc, cur) => {
      acc += cur.amount;
      return acc;
    }, 0);
  }, [order]);

  return (
    <>
      <ItemWrapper columns={columns} expanded={expanded ? dark : null}>
        <ItemText>Bestilling #{order.orderID}</ItemText>
        <ItemText>{shortDate(order.dateOrdered)}</ItemText>
        <ItemText>{shortDate(order.dateReceived)}</ItemText>
        <ItemText>{orderedAmount}</ItemText>
        <ExpandButton onClick={() => setExpanded(!expanded)}>
          {expanded ? <Icons.Close /> : <Icons.List />}
        </ExpandButton>
      </ItemWrapper>
      {expanded && (
        <ExpandedHistoryItem borderColor={dark}>
          {order.ordered.map(product => (
            <ExpandedHistoryListItem
              key={`order_${order.orderID}_product_${product.productID}`}
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

export default SupplierHistory;
