import { products, productCategories, inventory, orders, customers, sales } from "./mock"

export const getProducts = new Promise((res, rej) => {
  if(!products){
    rej(new Error("Couldn't find products"))
  }
  setTimeout(() => {
    res(products)
  }, 500)
})

export const getProductCategories = new Promise((res, rej) => {
  if(!productCategories){
    rej(new Error("Couldn't find product categories"))
  }
  setTimeout(() => {
    res(productCategories)
  }, 500)
})

export const getInventory = new Promise((res, rej) => {
  if(!inventory){
    rej(new Error("Couldn't find inventory"))
  }
  setTimeout(() => {
    res(inventory)
  }, 500)
})

export const getOrders = new Promise((res, rej) => {
  if(!orders){
    rej(new Error("Couldn't find orders"))
  }
  setTimeout(() => {
    res(orders)
  }, 500)
})

export const getCustomers = new Promise((res, rej) => {
  if(!customers){
    rej(new Error("Couldn't find customers"))
  }
  setTimeout(() => {
    res(customers)
  }, 500)
})

export const getSales = new Promise((res, rej) => {
  if(!sales){
    rej(new Error("Couldn't find sales"))
  }
  setTimeout(() => {
    res(sales)
  }, 500)
})