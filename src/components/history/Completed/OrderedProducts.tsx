import React from "react"
import styled, { css } from "styled-components";
import { IOrderedProduct } from "../../../redux/types";

interface IOrderedProducts {
  id: string;
  names: { [key: number]: string };
  ordered: IOrderedProduct[];
  columns?: number;
  isDeleted?: boolean;
}

const OrderedCell = styled.td`
  text-align: center;
  ${(props: {isDeleted: boolean}) => props.isDeleted && css`
    text-decoration: line-through;
    color: #888;
  `}
`;

const OrderedProducts: React.FC<IOrderedProducts> = ({
  id,
  names,
  ordered,
  children,
  isDeleted = false,
  columns = 5
}) => {
  const orderedList = React.useMemo(() => {
    let sorted = ordered.sort((a, b) => a.productID - b.productID);
    return sorted.map((o, i) => {
      return (
        <tr key={`${id}_ordered_${i}`}>
          <OrderedCell isDeleted={isDeleted}>{o.productID}</OrderedCell>
          <OrderedCell isDeleted={isDeleted}>{names[o.productID]}</OrderedCell>
          <OrderedCell isDeleted={isDeleted}>{o.amount}</OrderedCell>
        </tr>
      );
    });
  }, [names, ordered, id, isDeleted]);

  return (
    <tr>
      <td colSpan={columns} style={{ borderTop: "2px solid #ccc" }}>
        <table
          style={{
            width: "100%",
            marginBottom: "20px",
            padding: "10px 0",
            backgroundColor: "#f6f6f6",
            border: "2px solid #ccc",
            borderTop: "none"
          }}
        >
          <thead>
            <tr>
              <th style={{ width: "20%" }}>ID</th>
              <th style={{ width: "60%" }}>NAME</th>
              <th style={{ width: "20%" }}>AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {orderedList}
            <tr style={{ height: "1em" }}/>
            {children}
          </tbody>
        </table>
      </td>
    </tr>
  );
};

export default OrderedProducts