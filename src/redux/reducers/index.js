import { combineReducers } from "redux"
import auth from "./authReducers"
import customers from "./customersReducers"
import products from "./productsReducers"
import categories from "./categoriesReducers"
import orders from "./ordersReducers"
import sales from "./salesReducers"

export default combineReducers({ auth, customers, products, categories, orders, sales })