export const inventory = [
  { productID: 1, name: "iPad Wi-Fi", amount: 0 },
  { productID: 2, name: "iPad Mini", amount: 0 }
]

export const getInventory = new Promise((res, rej) => {
  if(!inventory){
    rej("Error! Couldn't find inventory")
  }
  setTimeout(() => {
    res(inventory)
  }, 1000)
})

export const orders = [
  { orderid: 1, supplier: "Komplett", title: "iPader", dateOrdered: "01-01-1970", dateReceived: null, ordered: [
    { productID: 1, amount: 4 },
    { productID: 2, amount: 5 }
  ]}
]

export const customers = [
  { customerID: 1, name: "Nye Gastroburger" }
]

export const sales = [
  { saleID: 1, customerID: 1, dateOrdered: "01-01-1970", sent: false, received: false, ordered: [
    { productID: 1, amount: 4 },
    { productID: 2, amount: 5 }
  ]}
]