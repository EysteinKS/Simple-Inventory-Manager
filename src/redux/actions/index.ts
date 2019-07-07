import * as cat from "./categoriesActions"
import * as cus from "./customersActions"
import { loadOrders, loadOrdersBegin, loadOrdersSuccess } from "./ordersActions"
import { loadProducts, loadProductsBegin, loadProductsSuccess } from "./productsActions"
import { loadSales, loadSalesBegin, loadSalesSuccess } from "./salesActions"
import { loadSuppliers, loadSuppliersBegin, loadSuppliersSuccess } from "./suppliersActions"

import { IThunkAction } from "../middleware/types"
import { AnyAction, ActionCreator } from "redux"

export interface ILoadActions<T> {
  categories: T,
  customers: T,
  orders: T,
  products: T,
  sales: T,
  suppliers: T,
  [index: string]: any
}

export type IThunkActionCreator = () => IThunkAction

export const fsActions: ILoadActions<IThunkActionCreator> = {
  categories: cat.loadCategories,
  customers: cus.loadCustomers,
  orders: loadOrders,
  products: loadProducts,
  sales: loadSales,
  suppliers: loadSuppliers
}

export const lsBeginActions: ILoadActions<ActionCreator<AnyAction>> = {
  categories: cat.loadCategoriesBegin,
  customers: cus.loadCustomersBegin,
  orders: loadOrdersBegin,
  products: loadProductsBegin,
  sales: loadSalesBegin,
  suppliers: loadSuppliersBegin
}

export const lsSuccessActions: ILoadActions<ActionCreator<AnyAction>> = {
  categories: cat.loadCategoriesSuccess,
  customers: cus.loadCustomersSuccess,
  orders: loadOrdersSuccess,
  products: loadProductsSuccess,
  sales: loadSalesSuccess,
  suppliers: loadSuppliersSuccess
}