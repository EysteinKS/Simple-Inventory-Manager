import { ISupplier, ICustomer, ISale, IOrder, IProduct, RootState, ICategory, IOrderedProduct } from "../redux/types";
import { TDirections } from "../components/SectionHeader";

//GETTING VALUES
export const getProductName = (products: IProduct[], id: number) => {
  let p = products.find(product => (
    product.productID === id
  ))
  if(p) return p.name
  else return ""
}

export const getCategoryName = (categories: ICategory[], id: number) => {
  return categories[id - 1].name
}

type TWithOrdered = {
  ordered: IOrderedProduct[],
  [key: string]: any
}

type TGetAmount = (
  orders: TWithOrdered[],
  id: number
) => number

export const getAmount: TGetAmount = (orders, id) => {
  return orders.reduce(( acc, cur ) => {
    let list = cur.ordered
    list.forEach((product: IOrderedProduct) => {
      if (product.productID === id){
        acc += product.amount
      }
    })
    return acc
  }, 0)
}
//GETTING VALUES END


//SORTING
type TFindByKey<A> = (arr: A[], compare: A, key: string) => A
const findByKey = (arr: any[], compare: any, key: string) => {
  return arr.find(item => item[key] === compare[key])
}
const keyToUpperCase = (object: any, key: string): string => {
  return object[key].toUpperCase()
}

const sortByName = (direction: TDirections) => {
  return (a: any, b: any) => {
    const nameA = keyToUpperCase(a, "name")
    const nameB = keyToUpperCase(b, "name")
    let compare = 0
    if(nameA > nameB){
      compare = 1
    } else if (nameA < nameB){
      compare = -1
    }
    return ((direction === "desc") ? (compare * -1) : compare)
  }
}

const sortByCategory = (categories: ICategory[], direction: TDirections):
  ((a: ICategory, b: ICategory) => number) => {
  const findCategoryName = (category: ICategory): string => {
    const findCagegory = () => findByKey(categories, category, "categoryID") as ICategory
    return keyToUpperCase(findCagegory(), "name")
  }
  return (a, b) => {
    const categoryA = findCategoryName(a)
    const categoryB = findCategoryName(b)
    let compare = 0
    if(categoryA > categoryB){
      compare = 1
    } else if (categoryA < categoryB){
      compare = -1
    }
    return ((direction === "desc") ? (compare * -1) : compare)
  }
}

const sortBySupplier = (suppliers: ISupplier[], direction: TDirections):
((a: ISupplier, b: ISupplier) => number) => {
  const findSupplierName = (supplier: ISupplier): string => {
    const findSupplier = (): TFindByKey<ISupplier> => findByKey(suppliers, supplier, "supplierID")
    return keyToUpperCase(findSupplier(), "name")
  }
  return (a, b) => {
    const supplierA = findSupplierName(a)
    const supplierB = findSupplierName(b)
    let compare = 0
    if(supplierA > supplierB){
      compare = 1
    } else if (supplierA < supplierB){
      compare = -1
    }
    return ((direction === "asc") ? (compare * -1) : compare)
  }
}

const sortByCustomer = (customers: ICustomer[], direction: TDirections): 
  ((a: ICustomer, b: ICustomer) => number) => {
  const findCustomerName = (customer: ICustomer): string => {
    const findCustomer = () => findByKey(customers, customer, "customer") as ICustomer
    return keyToUpperCase(findCustomer(), "name")
  }
  return (a, b) => {
    const customerA = findCustomerName(a)
    const customerB = findCustomerName(b)
    let compare = 0
    if(customerA > customerB){
      compare = 1
    } else if (customerA < customerB){
      compare = -1
    }
    return ((direction === "asc") ? (compare * -1) : compare)
  }
}

const sortBy = (key: string = "", direction: TDirections) => {
  return (a: any, b: any) => {
    const A = () => (typeof a === "string") ? keyToUpperCase(a, key) : a[key]
    const B = () => (typeof b === "string") ? keyToUpperCase(b, key) : b[key]

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
export const filterByActive = (isFiltered: boolean) => {
  return (item: any) => {
    if(item.active || !isFiltered){
      return item
    }
  }
}

export const filterByOrdered = (isFiltered: boolean, products: IProduct[]) => {
  const mapProductID = (products: IProduct[]) => {
    return products.map((prod: IProduct) => {
      return prod.productID
    })
  }
  return (item: RootState) =>
    (!products || !isFiltered)
      ? item
      : (typeof products === "string") 
      ? "" 
      : item.products.some((product: IProduct) => mapProductID(products).includes(product.productID))

}
//FILTERING END

//CREATING
export const newProduct = (id: number): IProduct => {
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

export const newOrder = (id: number): IOrder => {
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

export const newSale = (id: number): ISale => {
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
export const isArrayEmpty = (arr: any[]) => {
  return (!Array.isArray(arr) || !arr.length)
}

//DATE HANDLING
export const parseDate = (date: Date | string | any) => {
  if(date && (typeof date === "object")){
    if(date && Object.prototype.toString.call(date) === "[object Date]") { 
      return date 
    } else if ("seconds" in date) {
      return new Date(date.seconds * 1000)
    } else {
      throw new Error("Object in parseDate isn't a valid object!")
    }
  }

  //dateStringRegex = YYYY-MM-DDThh:mm:ss
  const dateStringRegex = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d/
  const isValidString = dateStringRegex.test(date)
  if((typeof date === "string")) {
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

export const findInArray = (arr: any[], key: string | number, value: any) => {
  return arr[arr.findIndex(i => i[key] === value)]
}

export const addZero = (str: string) => {
  if(str.length === 1){
    return "0" + str
  } else {
    return str
  }
}