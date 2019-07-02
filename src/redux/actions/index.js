import { loadCategories, loadCategoriesBegin, loadCategoriesSuccess } from "../actions/categoriesActions"
import { loadCustomers, loadCustomersBegin, loadCustomersSuccess } from "../actions/customersActions"
import { loadOrders, loadOrdersBegin, loadOrdersSuccess } from "../actions/ordersActions"
import { loadProducts, loadProductsBegin, loadProductsSuccess } from "../actions/productsActions"
import { loadSales, loadSalesBegin, loadSalesSuccess } from "../actions/salesActions"
import { loadSuppliers, loadSuppliersBegin, loadSuppliersSuccess } from "../actions/suppliersActions"

export const fsActions = {
  categories: loadCategories,
  customers: loadCustomers,
  orders: loadOrders,
  products: loadProducts,
  sales: loadSales,
  suppliers: loadSuppliers
}

export const lsBeginActions = {
  categories: loadCategoriesBegin,
  customers: loadCustomersBegin,
  orders: loadOrdersBegin,
  products: loadProductsBegin,
  sales: loadSalesBegin,
  suppliers: loadSuppliersBegin
}

export const lsSuccessActions = {
  categories: loadCategoriesSuccess,
  customers: loadCustomersSuccess,
  orders: loadOrdersSuccess,
  products: loadProductsSuccess,
  sales: loadSalesSuccess,
  suppliers: loadSuppliersSuccess
}