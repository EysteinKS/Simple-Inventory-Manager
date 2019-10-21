import React from "react";
import { AmountField } from "./styles";
import {
  OrdersInfo,
  SalesInfo,
  LoansInfo
} from "../../components/util/HoverInfo";

interface InfoProps {
  productID: number;
  amount: number;
}

export const OrderedWithInfo: React.FC<InfoProps> = ({ productID, amount }) => {
  const handle = `product_${productID}_ordered`;

  if (amount <= 0) {
    return <p>-</p>;
  }

  return (
    <>
      <AmountField data-tip data-for={handle}>
        {amount || "-"}
      </AmountField>
      {amount > 0 && <OrdersInfo handle={handle} productID={productID} />}
    </>
  );
};

export const ReservedWithInfo: React.FC<InfoProps> = ({
  productID,
  amount
}) => {
  const handle = `product_${productID}_reserved`;

  if (amount <= 0) {
    return <p>-</p>;
  }

  return (
    <>
      <AmountField data-tip data-for={handle}>
        {amount || "-"}
      </AmountField>
      {amount > 0 && <SalesInfo handle={handle} productID={productID} />}
    </>
  );
};

export const LoansWithInfo: React.FC<InfoProps> = ({ productID, amount }) => {
  const handle = `product_${productID}_loans`;

  if (amount <= 0) {
    return <p>-</p>;
  }

  return (
    <>
      <AmountField data-tip data-for={handle}>
        {amount || "-"}
      </AmountField>
      {amount > 0 && <LoansInfo handle={handle} productID={productID} />}
    </>
  );
};
