import React from "react";
import { ISupplier } from "../../redux/types";
import { TableItem, ItemData } from "../../styles/table";
import Buttons from "../../components/util/Buttons";
import Icons from "../../components/util/Icons";

interface SupplierProps {
  supplier: ISupplier;
  history: () => void;
  edit: () => void;
  columns: string;
}

const Supplier: React.FC<SupplierProps> = ({
  supplier,
  history,
  edit,
  columns
}) => {
  return (
    <TableItem columns={columns}>
      <ItemData>{supplier.supplierID}</ItemData>
      <ItemData>{supplier.name}</ItemData>
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

export default Supplier;
