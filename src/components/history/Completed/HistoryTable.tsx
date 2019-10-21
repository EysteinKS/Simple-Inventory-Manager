import React from "react";
import Table, {
  ITableColumn,
  TableHeader,
  TableBody
} from "../../util/SectionTable";
import { TableButton } from "./styles";

interface IHistoryTable {
  name: string;
  columns: ITableColumn[];
}

const HistoryTable: React.FC<IHistoryTable> = ({ name, columns, children }) => {
  const [isOpen, setOpen] = React.useState(false);

  return (
    <>
      <TableButton onClick={() => setOpen(!isOpen)}>
        <h2 style={{ textAlign: "left", paddingLeft: "10px" }}>{name}</h2>
      </TableButton>
      {isOpen && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "white",
            border: "2px solid lightgray"
          }}
        >
          <Table
            style={{
              borderCollapse: "collapse",
              width: "100%"
            }}
          >
            <TableHeader columns={columns} />
            <TableBody>{children}</TableBody>
          </Table>
        </div>
      )}
    </>
  );
};

export default HistoryTable;
