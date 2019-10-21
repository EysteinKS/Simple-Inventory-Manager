import React from "react";
import { getProductName } from "../../constants/util";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/types";

export default function ProductName({ id }: { id: number }) {
  const products = useSelector((state: RootState) => state.products.products);
  const name = getProductName(products, id);
  return <React.Fragment>{name}</React.Fragment>;
}
