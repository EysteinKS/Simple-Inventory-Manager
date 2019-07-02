import { createSelector } from "reselect"

const productsSelector = state => state.products.products
const ordersSelector = state => state.orders.orders
const salesSelector = state => state.sales.sales

