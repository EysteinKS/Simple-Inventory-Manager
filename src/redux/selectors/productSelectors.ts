import { createSelector } from "reselect";
import { RootState } from "../types";

const productsSelector = (state: RootState) => state.products.products;
//const ordersSelector = (state: RootState) => state.orders.orders
//const salesSelector = (state: RootState) => state.sales.sales

interface IProductNames {
  [key: number]: string;
}

export const selectProductNames = createSelector(
  [productsSelector],
  products => {
    return products.reduce(
      (acc, cur) => {
        acc[cur.productID] = cur.name;
        return acc;
      },
      {} as IProductNames
    );
  }
);
