import React from "react";
import styled from "styled-components";

//TODO - ADD TABLE WITH PAGINATION

interface ITableProps {
  style?: any;
}

const Table: React.FC<ITableProps> = ({ children, style }) => {
  let tableStyle = {
    width: "100%",
    backgroundColor: "white",
    padding: "10px",
    border: "2px solid lightgray"
  };

  return <table style={style ? style : tableStyle}>{children}</table>;
};

export interface ITableColumn {
  name: string;
  width: string;
}

interface ITableColumnProps {
  columns: ITableColumn[];
}

export const TableHeader: React.FC<ITableColumnProps> = ({ columns }) => {
  return (
    <thead>
      <tr>
        {columns.map(col => (
          <th
            key={"th_" + col.name}
            style={{ width: col.width, padding: "10px" }}
          >
            {col.name}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export const TableBody: React.FC = ({ children }) => {
  return <tbody>{children}</tbody>;
};

interface ITableRow {
  columns: any[];
  onClick?: () => void;
  style?: any;
}

const StyledRow = styled.tr`
  ${(props: { hover: boolean }) => {
    if (props.hover) return `:hover { cursor: pointer }`;
  }}
`;

export const TableRow: React.FC<ITableRow> = ({
  columns,
  onClick,
  style = {}
}) => {
  return (
    <StyledRow
      style={style}
      hover={Boolean(onClick)}
      onClick={() => onClick && onClick()}
    >
      {columns.map((col, i) => (
        <td
          key={"row_" + i + col}
          style={{
            padding: "10px 0",
            textAlign: "center",
            verticalAlign: "middle  "
          }}
        >
          {col}
        </td>
      ))}
    </StyledRow>
  );
};

export default Table;
