import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/types";

interface INames {
  target: string;
  id: number;
}

const targetToID: { [key: string]: string } = {
  products: "productID",
  customers: "customerID",
  suppliers: "supplierID",
  categories: "categoryID"
};

export default function Names({ target, id }: INames) {
  const selector = useSelector((state: RootState) => state[target][target]);

  const name = React.useMemo(() => {
    try {
      const targetID = targetToID[target];
      return selector[selector.findIndex((i: any) => i[targetID] === id)].name;
    } catch (err) {
      return "ERROR";
    }
  }, [target, id, selector]);

  return <React.Fragment>{name}</React.Fragment>;
}
