import React from 'react'

//TODO - ADD TABLE WITH PAGINATION

export interface ITableColumn {
  name: string
  width: string
}

interface ITableProps {
  columns: ITableColumn[]
}

const Table: React.FC = ({ children }) => {
  return (
    <table style={{ 
      width: "100%",
      backgroundColor: "white",
      padding: "10px",
      border: "2px solid lightgray"
    }}>
      {children}
    </table>
  )
}

export const TableHeader: React.FC<ITableProps> = ({ columns }) => {
  return(
    <thead>
      <tr>
        {columns.map(col => 
          <th key={"th_" + col.name} style={{ width: col.width }}>{col.name}</th>
        )}
      </tr>
    </thead>
  )
}

export const TableBody: React.FC = ({ children }) => {
  return(
    <tbody>
      {children}
    </tbody>
  )
}

interface ITableRow {
  columns: any[]
}

export const TableRow: React.FC<ITableRow> = ({ columns }) => {
  return(
    <tr>
      {columns.map((col, i) => 
        <td 
          key={"row_" + i + col}
          style={{ 
            padding: "5px 0",
            textAlign: "center",
            verticalAlign: "middle  "
          }}
        >
          {col}
        </td>
      )}
    </tr>
  )
}

export default Table