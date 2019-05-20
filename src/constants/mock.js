export const products = [
  { productID: 1, name: "iPad Wi-Fi", categoryID: 1, active: true, amount: 0 },
  { productID: 2, name: "iPad Mini", categoryID: 1, active: true, amount: 0 },
  { productID: 3, name: "Epson TM-T20II", categoryID: 2, active: false, amount: 2 }
]

export const productCategories = [
  { categoryID: 1, name: "iPader", color: "" },
  { categoryID: 2, name: "Printere", color: "" },
  { categoryID: 3, name: "Annet", color: "" }
]

export const inventory = [
  { productID: 1, amount: 0 },
  { productID: 2, amount: 0 },
  { productID: 3, amount: 2 }
]

export const orders = [
  { orderID: 1, supplierID: 1, dateOrdered: new Date(), dateReceived: null, ordered: [
    { productID: 1, amount: 4 },
    { productID: 2, amount: 5 }
  ]},
  { orderID: 2, supplierID: 2, dateOrdered: new Date(), dateReceived: null, ordered: [
    { productID: 3, amount: 4 },
  ]},
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