import { useSelector } from "react-redux";
import { RootState } from "../redux/types";
import React from "react";

type TTarget = "products" | "customers" | "suppliers" | "categories";

const useNames = (target: TTarget, id: number) => {
  const selector = useSelector((state: RootState) => state[target][target]);

  const name = React.useMemo(() => {
    const targetToID: { [key: string]: string } = {
      products: "productID",
      customers: "customerID",
      suppliers: "supplierID",
      categories: "categoryID"
    };

    try {
      const targetID = targetToID[target];
      return selector[selector.findIndex((i: any) => i[targetID] === id)].name;
    } catch (err) {
      return "ERROR";
    }
  }, [target, id, selector]);

  return name;
};

export default useNames;
