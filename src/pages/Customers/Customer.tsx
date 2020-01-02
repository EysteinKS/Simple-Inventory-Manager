import React from "react";
import { ICustomer } from "../../redux/types";
import { TableItem, ItemData } from "../../styles/table";
import Buttons from "../../components/util/Buttons";
import Icons from "../../components/util/Icons";

interface CustomerProps {
  customer: ICustomer;
  history: () => void;
  edit: () => void;
  columns: string;
}

const Customer: React.FC<CustomerProps> = ({
  customer,
  history,
  edit,
  columns
}) => {
  return (
    <TableItem columns={columns}>
      <ItemData>{customer.customerID}</ItemData>
      <ItemData>{customer.name}</ItemData>
      <div />
      <Buttons.Click onClick={() => history()}>
        <Icons.History />
      </Buttons.Click>
      <Buttons.Click onClick={() => edit()}>
        <Icons.Edit />
      </Buttons.Click>
    </TableItem>
  );
};

export default Customer;
