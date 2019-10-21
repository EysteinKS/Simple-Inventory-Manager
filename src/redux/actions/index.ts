import * as cat from "./categoriesActions";
import * as cus from "./customersActions";
import {
  loadOrders,
  loadOrdersBegin,
  loadOrdersSuccess,
  resetOrders
} from "./ordersActions";
import {
  loadProducts,
  loadProductsBegin,
  loadProductsSuccess,
  resetProducts
} from "./productsActions";
import {
  loadSales,
  loadSalesBegin,
  loadSalesSuccess,
  resetSales
} from "./salesActions";
import {
  loadSuppliers,
  loadSuppliersBegin,
  loadSuppliersSuccess,
  resetSuppliers
} from "./suppliersActions";

import { IThunkAction } from "../middleware/types";
import { AnyAction, ActionCreator } from "redux";
import {
  loadLoans,
  loadLoansBegin,
  loadLoansSuccess,
  resetLoans
} from "./loansActions";
import { resetAuth } from "./authActions";
import { resetCategories } from "./categoriesActions";
import { resetCustomers } from "./customersActions";
import { resetReports } from "./reportsActions";

export interface ILoadActions<T> {
  categories: T;
  customers: T;
  orders: T;
  products: T;
  sales: T;
  suppliers: T;
  loans: T;
  [index: string]: any;
}

export type IThunkActionCreator = () => IThunkAction;

export const fsActions: ILoadActions<IThunkActionCreator> = {
  categories: cat.loadCategories,
  customers: cus.loadCustomers,
  orders: loadOrders,
  products: loadProducts,
  sales: loadSales,
  suppliers: loadSuppliers,
  loans: loadLoans
};

export const lsBeginActions: ILoadActions<ActionCreator<AnyAction>> = {
  categories: cat.loadCategoriesBegin,
  customers: cus.loadCustomersBegin,
  orders: loadOrdersBegin,
  products: loadProductsBegin,
  sales: loadSalesBegin,
  suppliers: loadSuppliersBegin,
  loans: loadLoansBegin
};

export const lsSuccessActions: ILoadActions<ActionCreator<AnyAction>> = {
  categories: cat.loadCategoriesSuccess,
  customers: cus.loadCustomersSuccess,
  orders: loadOrdersSuccess,
  products: loadProductsSuccess,
  sales: loadSalesSuccess,
  suppliers: loadSuppliersSuccess,
  loans: loadLoansSuccess
};

export const resetRedux = (): IThunkAction => async dispatch => {
  dispatch(resetAuth());
  dispatch(resetCategories());
  dispatch(resetCustomers());
  dispatch(resetOrders());
  dispatch(resetProducts());
  dispatch(resetSales());
  dispatch(resetSuppliers());
  dispatch(resetReports());
  dispatch(resetLoans());
};
