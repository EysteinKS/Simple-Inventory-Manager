//GETTING VALUES
export const getProductName = (products = [], id) => {
  let p = products.find(product => (
    product.productID === id
  ))
  return p.name
}

export const getCategoryName = (categories = [], id) => {
  return categories[id - 1].name
}

export const getAmount = (orders = [], id) => {
  return orders.reduce(( acc, cur ) => {
    let list = cur.ordered
    list.forEach(product => {
      if (product.productID === id){
        acc += product.amount
      }
    })
    return acc
  }, 0)
}
//GETTING VALUES END


//SORTING
const sortByName = (direction) => {
  return (a, b) => {
    const nameA = a.name.toUpperCase()
    const nameB = b.name.toUpperCase()
    let compare = 0
    if(nameA > nameB){
      compare = 1
    } else if (nameA < nameB){
      compare = -1
    }
    return ((direction === "desc") ? (compare * -1) : compare)
  }
}

const sortByCategory = (categories = [], direction) => {
  return (a, b) => {
    const categoryA = categories.find(cat => cat.categoryID === a.categoryID).name.toUpperCase()
    const categoryB = categories.find(cat => cat.categoryID === b.categoryID).name.toUpperCase()
    let compare = 0
    if(categoryA > categoryB){
      compare = 1
    } else if (categoryA < categoryB){
      compare = -1
    }
    return ((direction === "desc") ? (compare * -1) : compare)
  }
}

const sortBySupplier = (suppliers = [], direction) => {
  return (a, b) => {
    const supplierA = suppliers.find(supp => supp.supplierID === a.supplierID).name.toUpperCase()
    const supplierB = suppliers.find(supp => supp.supplierID === b.supplierID).name.toUpperCase()
    let compare = 0
    if(supplierA > supplierB){
      compare = 1
    } else if (supplierA < supplierB){
      compare = -1
    }
    return ((direction === "asc") ? (compare * -1) : compare)
  }
}

const sortByCustomer = (customers = [], direction) => {
  return (a, b) => {
    const customerA = customers.find(cust => cust.customerID === a.customerID).name.toUpperCase()
    const customerB = customers.find(cust => cust.customerID === b.customerID).name.toUpperCase()
    let compare = 0
    if(customerA > customerB){
      compare = 1
    } else if (customerA < customerB){
      compare = -1
    }
    return ((direction === "asc") ? (compare * -1) : compare)
  }
}

const sortBy = (key = "", direction) => {
  return (a, b) => {
    //console.log(`a[${key}] = `, a[key])
    const A = () => (typeof a === "string") ? a[key].toUpperCase() : a[key]
    const B = () => (typeof b === "string") ? b[key].toUpperCase() : b[key]

    let compare = 0
    if(A > B){
      compare = 1
    } else if (A < B){
      compare = -1
    }
    return ((direction === "asc") ? (compare * -1) : compare)
  }
}

export const sort = {
  by: sortBy,
  byName: sortByName,
  byCategory: sortByCategory,
  bySupplier: sortBySupplier,
  byCustomer: sortByCustomer
}
//SORTING END

//FILTERING
export const filterByActive = (isFiltered) => {
  return (item) => {
    if(item.active || !isFiltered){
      return item
    }
  }
}

export const filterByOrdered = (isFiltered, products) => {
  return (item) =>
    (!products || !isFiltered)
      ? item
      : (typeof products === "string") 
      ? "" 
      : item.products.some(product => products.includes(product.productID))

}
//FILTERING END

//CREATING
export const newProduct = (id) => {
  //console.log("Creating product with id: ", id)
  return {
    productID: id,
    name: "",
    categoryID: 1,
    active: true,
    amount: 0,
    comments: ""
  }
}

export const newOrder = (id) => {
  let date = new Date()
  return {
    orderID: id,
    supplierID: 1,
    dateOrdered: date,
    dateReceived: null,
    ordered: [],
    isNew: true
  }
}

export const newSale = (id) => {
  let date = new Date()
  return {
    saleID: id,
    customerID: 1,
    dateOrdered: date,
    dateSent: null,
    ordered: [],
    isNew: true
  }
}

//CREATING END

//BOOLEANS
export const isArrayEmpty = (arr) => {
  return (!Array.isArray(arr) || !arr.length)
}

//DATE HANDLING
export const parseDate = (date) => {
  const isObject = date => (typeof date === "object")
  function isDateObject(date) {
    return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
  }
  if(isObject(date)){
    if(isDateObject(date)) { 
      return date 
    } else if ("seconds" in date) {
      return new Date(date.seconds * 1000)
    } else {
      throw new Error("Object in parseDate isn't a valid object!")
    }
  }

  //dateStringRegex = YYYY-MM-DDThh:mm:ss
  const dateStringRegex = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d/
  const isString = date => (typeof date === "string")
  const isValidString = dateStringRegex.test(date)
  if(isString(date)) {
    if(isValidString){
      const DATESTRING_LENGTH = 19
      let dateString = date.substr(0, DATESTRING_LENGTH)
      return new Date(dateString)
    } else {
      throw new Error("String in parseDate isn't a valid date string!")
    }
  }

  if(date === null){
    return date
  }
}