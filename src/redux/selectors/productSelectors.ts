import { createSelector } from "reselect"
import { RootState } from "../types";

const productsSelector = (state: RootState) => state.products.products
const ordersSelector = (state: RootState) => state.orders.orders
const salesSelector = (state: RootState) => state.sales.sales

