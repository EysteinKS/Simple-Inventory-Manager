import { combineReducers } from "redux"
import auth from "./authReducers"
import customers from "./customersReducers"
import inventory from "./inventoryReducers"
import orders from "./ordersReducers"
import sales from "./salesReducers"

export default combineReducers({ auth, customers, inventory, orders, sales })