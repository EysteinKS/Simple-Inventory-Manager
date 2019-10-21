import React from "react";
import { TableRow } from "./SectionTable";

interface IExpandableRow {
  columns: any[];
  isDeleted?: boolean;
}

export const ExpandableRow: React.FC<IExpandableRow> = ({
  columns,
  isDeleted,
  children
}) => {
  const [isOpen, setOpen] = React.useState(false);

  const rowStyle = React.useMemo(() => {
    let style = {};
    if (isOpen) {
      style = {
        backgroundColor: "#eee",
        border: "2px solid #ccc"
      };
    }
    if (isDeleted) {
      style = { ...style, textDecoration: "line-through", color: "#888" };
    }

    return style;
  }, [isOpen, isDeleted]);

  return (
    <>
      <TableRow
        style={rowStyle}
        columns={columns}
        onClick={() => setOpen(!isOpen)}
      />
      {isOpen && children}
    </>
  );
};
