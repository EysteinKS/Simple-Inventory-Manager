import { combineReducers } from "redux"
import auth from "./authReducers"
import customers from "./customersReducers"
import products from "./productsReducers"
import categories from "./categoriesReducers"
import orders from "./ordersReducers"
import reports from "./reportsReducers"
import sales from "./salesReducers"
import suppliers from "./suppliersReducers"
import loans from "./loansReducers"

import { Reducer } from "redux"

interface CombinedReducers {
  auth: Reducer,
  categories: Reducer,
  customers: Reducer,
  orders: Reducer,
  products: Reducer,
  reports: Reducer,
  sales: Reducer,
  suppliers: Reducer,
  loans: Reducer
}

const reducers: CombinedReducers = {
  auth,
  categories,
  customers,
  orders,
  products,
  reports,
  sales,
  suppliers,
  loans
}

export default combineReducers(reducers)