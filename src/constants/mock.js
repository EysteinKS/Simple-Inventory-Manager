export const products = [
  { productID: 1, name: "iPad Wi-Fi", categoryID: 1, active: true },
  { productID: 2, name: "iPad Mini", categoryID: 1, active: true },
  { productID: 3, name: "Epson TM-T20II", categoryID: 2, active: false }
]

export const productCategories = [
  { categoryID: 1, name: "iPader", color: "" },
  { categoryID: 2, name: "Printere", color: "" }
]

export const inventory = [
  { productID: 1, amount: 0 },
  { productID: 2, amount: 0 },
  { productID: 3, amount: 2 }
]

export const orders = [
  { orderid: 1, supplier: "Komplett", title: "iPader", dateOrdered: "01-01-1970", dateReceived: null, ordered: [
    { productID: 1, amount: 4 },
    { productID: 2, amount: 5 }
  ]},
  { orderid: 2, supplier: "EET", title: "Printere", dateOrdered: "01-01-1970", dateReceived: null, ordered: [
    { productID: 3, amount: 4 },
  ]},
  { orderid: 3, supplier: "EET", title: "Printere", dateOrdered: "01-01-1970", dateReceived: null, ordered: [
    { productID: 3, amount: 4 },
  ]},
  { orderid: 4, supplier: "EET", title: "Printere", dateOrdered: "01-01-1970", dateReceived: null, ordered: [
    { productID: 3, amount: 4 },
  ]},
  { orderid: 5, supplier: "EET", title: "Printere", dateOrdered: "01-01-1970", dateReceived: null, ordered: [
    { productID: 3, amount: 4 },
  ]},
  { orderid: 6, supplier: "EET", title: "Printere", dateOrdered: "01-01-1970", dateReceived: null, ordered: [
    { productID: 3, amount: 4 },
  ]},
  { orderid: 7, supplier: "EET", title: "Printere", dateOrdered: "01-01-1970", dateReceived: null, ordered: [
    { productID: 3, amount: 4 },
  ]},
  { orderid: 8, supplier: "EET", title: "Printere", dateOrdered: "01-01-1970", dateReceived: null, ordered: [
    { productID: 3, amount: 4 },
  ]},
  { orderid: 9, supplier: "EET", title: "Printere", dateOrdered: "01-01-1970", dateReceived: null, ordered: [
    { productID: 3, amount: 4 },
  ]},
  { orderid: 10, supplier: "EET", title: "Printere", dateOrdered: "01-01-1970", dateReceived: null, ordered: [
    { productID: 3, amount: 4 },
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