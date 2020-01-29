import {
  ISupplier,
  ICustomer,
  IProduct,
  RootState,
  ICategory,
  IOrderedProduct,
  IChangeValue
} from "../redux/types";
import { TDirections } from "../components/util/SectionHeader";

//GETTING VALUES
export const getProductName = (products: IProduct[], id: number) => {
  let p = products.find(product => product.productID === id);
  if (p) return p.name;
  else return "";
};

export const getCategoryName = (categories: ICategory[], id: number) => {
  return categories[id - 1].name;
};

type TWithOrdered = {
  ordered: IOrderedProduct[];
  [key: string]: any;
};

type TGetAmount = (orders: TWithOrdered[], id: number) => number;

export const getAmount: TGetAmount = (orders, id) => {
  return orders.reduce((acc, cur) => {
    let list = cur.ordered;
    list.forEach((product: IOrderedProduct) => {
      if (product.productID === id) {
        acc += product.amount;
      }
    });
    return acc;
  }, 0);
};
//GETTING VALUES END

//SORTING
type TFindByKey<A> = (arr: A[], compare: A, key: string) => A;
const findByKey = (arr: any[], compare: any, key: string) => {
  return arr.find(item => item[key] === compare[key]);
};
const keyToUpperCase = (object: any, key: string): string => {
  return object[key].toUpperCase();
};

const sortByName = (direction: TDirections) => {
  return (a: any, b: any) => {
    const nameA = keyToUpperCase(a, "name");
    const nameB = keyToUpperCase(b, "name");
    let compare = 0;
    if (nameA > nameB) {
      compare = 1;
    } else if (nameA < nameB) {
      compare = -1;
    }
    return direction === "desc" ? compare * -1 : compare;
  };
};

const sortByCategory = (
  categories: ICategory[],
  direction: TDirections
): ((a: ICategory, b: ICategory) => number) => {
  const findCategoryName = (category: ICategory): string => {
    const findCagegory = () =>
      findByKey(categories, category, "categoryID") as ICategory;
    return keyToUpperCase(findCagegory(), "name");
  };
  return (a, b) => {
    const categoryA = findCategoryName(a);
    const categoryB = findCategoryName(b);
    let compare = 0;
    if (categoryA > categoryB) {
      compare = 1;
    } else if (categoryA < categoryB) {
      compare = -1;
    }
    return direction === "desc" ? compare * -1 : compare;
  };
};

const sortBySupplier = (
  suppliers: ISupplier[],
  direction: TDirections
): ((a: ISupplier, b: ISupplier) => number) => {
  const findSupplierName = (supplier: ISupplier): string => {
    const findSupplier = (): TFindByKey<ISupplier> =>
      findByKey(suppliers, supplier, "supplierID");
    return keyToUpperCase(findSupplier(), "name");
  };
  return (a, b) => {
    const supplierA = findSupplierName(a);
    const supplierB = findSupplierName(b);
    let compare = 0;
    if (supplierA > supplierB) {
      compare = 1;
    } else if (supplierA < supplierB) {
      compare = -1;
    }
    return direction === "asc" ? compare * -1 : compare;
  };
};

const sortByCustomer = (
  customers: ICustomer[],
  direction: TDirections
): ((a: ICustomer, b: ICustomer) => number) => {
  const findCustomerName = (customer: ICustomer): string => {
    const findCustomer = () =>
      findByKey(customers, customer, "customer") as ICustomer;
    return keyToUpperCase(findCustomer(), "name");
  };
  return (a, b) => {
    const customerA = findCustomerName(a);
    const customerB = findCustomerName(b);
    let compare = 0;
    if (customerA > customerB) {
      compare = 1;
    } else if (customerA < customerB) {
      compare = -1;
    }
    return direction === "asc" ? compare * -1 : compare;
  };
};

const sortBy = (key: string = "", direction: TDirections) => {
  return (a: any, b: any) => {
    const A = () => (typeof a === "string" ? keyToUpperCase(a, key) : a[key]);
    const B = () => (typeof b === "string" ? keyToUpperCase(b, key) : b[key]);

    let compare = 0;
    if (A > B) {
      compare = 1;
    } else if (A < B) {
      compare = -1;
    }
    return direction === "asc" ? compare * -1 : compare;
  };
};

export const sort = {
  by: sortBy,
  byName: sortByName,
  byCategory: sortByCategory,
  bySupplier: sortBySupplier,
  byCustomer: sortByCustomer
};
//SORTING END

//FILTERING
export const filterByActive = (isFiltered: boolean) => {
  return (item: any) => {
    if (item.active || !isFiltered) {
      return item;
    }
  };
};

export const filterByOrdered = (isFiltered: boolean, products: IProduct[]) => {
  const mapProductID = (products: IProduct[]) => {
    return products.map((prod: IProduct) => {
      return prod.productID;
    });
  };
  return (item: RootState) =>
    !products || !isFiltered
      ? item
      : typeof products === "string"
      ? ""
      : item.products.some((product: IProduct) =>
          mapProductID(products).includes(product.productID)
        );
};
//FILTERING END

//CREATING
export const newProduct = (id: number): IProduct => {
  return {
    productID: id,
    name: "",
    categoryID: 1,
    active: true,
    amount: 0,
    comments: ""
  };
};

//CREATING END

//BOOLEANS
export const isArrayEmpty = (arr: any[]) => {
  return !Array.isArray(arr) || !arr.length;
};

const defaultDateOpts = {
  year: "2-digit",
  month: "2-digit",
  day: "2-digit"
};

export const dateToString = (
  date: string | Date | null,
  opts = defaultDateOpts
) => {
  if (typeof date === "string") {
    let stringToDate = new Date(date);
    return stringToDate.toLocaleDateString("default", opts);
  } else if (date) {
    return date.toLocaleDateString("default", opts);
  } else {
    return null;
  }
};

//DATE HANDLING
export const parseDate = (date: Date | string | any) => {
  if (date && typeof date === "object") {
    if (date && Object.prototype.toString.call(date) === "[object Date]") {
      return date;
    } else if ("seconds" in date) {
      return new Date(date.seconds * 1000);
    } else {
      throw new Error("Object in parseDate isn't a valid object!");
    }
  }

  //dateStringRegex = YYYY-MM-DDThh:mm:ss
  const dateStringRegex = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d/;
  const isValidString = dateStringRegex.test(date);
  if (typeof date === "string") {
    if (isValidString) {
      const DATESTRING_LENGTH = 19;
      let dateString = date.substr(0, DATESTRING_LENGTH);
      return new Date(dateString);
    } else {
      throw new Error("String in parseDate isn't a valid date string!");
    }
  }

  if (date === null) {
    return date;
  }
};

export const findInArray = (arr: any[], key: string | number, value: any) => {
  return arr[arr.findIndex(i => i[key] === value)];
};

export const addZero = (str: string) => {
  if (str.length === 1) {
    return "0" + str;
  } else {
    return str;
  }
};

const areArraysEqual = (oldVal: any[], newVal: any[]) => {
  if (oldVal === newVal) return true;
  if (JSON.stringify(oldVal) === JSON.stringify(newVal)) return true;
  if (oldVal.length !== newVal.length) return false;

  let prev = [...oldVal].sort((a, b) => a.productID - b.productID);
  let next = [...newVal].sort((a, b) => a.productID - b.productID);

  for (let i = 0; i < prev.length; ++i) {
    if (prev[i] !== next[i]) return false;
  }

  return true;
};

const compareArrays = (oldVal: any[], newVal: any[]) => {
  const isPrimitive = () =>
    typeof oldVal[0] === "number" || typeof oldVal[0] === "string";
  if (isPrimitive()) {
    shouldLog("Comparing primitive arrays");
    return comparePrimitiveArrays(oldVal, newVal);
  } else {
    shouldLog("Comparing object arrays");
    return compareObjectArrays(oldVal, newVal);
  }
};

const compareObjectArrays = (oldVal: any[], newVal: any[]) => {
  let oldVals = [];
  let newVals = [];
  let checkedVals = [];

  const sortFunc = (a: any, b: any) => {
    if (a.productID < b.productID) {
      return -1;
    } else {
      return 0;
    }
  };

  let oldSorted = [...oldVal].sort(sortFunc);
  let newSorted = [...newVal].sort(sortFunc);

  for (let i = 0; i < oldSorted.length; i++) {
    let oldIndex = oldSorted[i];
    const indexInNew = newSorted.findIndex(
      i => i.productID === oldIndex.productID
    );
    if (indexInNew < 0) {
      oldVals.push(oldIndex);
      newVals.push(null);
    } else {
      let newIndex = newSorted[indexInNew];
      if (oldIndex.amount !== newIndex.amount) {
        oldVals.push(oldIndex);
        newVals.push(newIndex);
      }
    }
    checkedVals.push(oldIndex.productID);
  }

  for (let i = 0; i < newSorted.length; i++) {
    if (!checkedVals.includes(newSorted[i].productID)) {
      oldVals.push(null);
      newVals.push(newSorted[i]);
    }
  }

  return {
    oldVals,
    newVals
  };
};

const comparePrimitiveArrays = (oldVal: any[], newVal: any[]) => {
  let oldVals = [];
  let newVals = [];
  let checkedVals = [];

  let oldSorted = [...oldVal].sort((a, b) => a - b);
  let newSorted = [...newVal].sort((a, b) => a - b);

  for (let i = 0; i < oldSorted.length; i++) {
    let oldIndex = oldSorted[i];
    const indexInNew = newSorted.findIndex(i => i === oldIndex);
    if (indexInNew < 0) {
      oldVals.push(oldIndex);
      newVals.push(null);
    } else {
      let newIndex = newSorted[indexInNew];
      if (oldIndex !== newIndex) {
        oldVals.push(oldIndex);
        newVals.push(newIndex);
      }
    }
    checkedVals.push(oldIndex);
  }

  for (let i = 0; i < newSorted.length; i++) {
    if (!checkedVals.includes(newSorted[i])) {
      oldVals.push(null);
      newVals.push(newSorted[i]);
    }
  }

  return {
    oldVals,
    newVals
  };
};

export const isChanged = (prev: any, next: any) => {
  //Checks if a state object has changed at all
  let prevAsJSON = JSON.stringify(prev);
  let nextAsJSON = JSON.stringify(next);
  let isEqual = prevAsJSON === nextAsJSON;

  let changed: IChangeValue[] = [];
  if (!isEqual) {
    Object.keys(next).forEach(key => {
      let oldKey = prev[key];
      let newKey = next[key];
      if (Array.isArray(oldKey) && !areArraysEqual(oldKey, newKey)) {
        const { oldVals, newVals } = compareArrays(oldKey, newKey);
        changed.push({
          key: key,
          oldValue: oldVals || [],
          newValue: newVals || []
        });
      } else if (!Array.isArray(oldKey)) {
        if (oldKey !== newKey) {
          changed.push({
            key: key,
            oldValue: oldKey,
            newValue: newKey
          });
        }
      }
    });
    shouldLog("Changed: ", changed);
  }
  return {
    isEqual,
    changed
  };
};

export const shouldLog = (message: any, opt?: any) => {
  if (process.env.REACT_APP_SHOW_LOG === "yes") {
    opt ? console.log(message, opt) : console.log(message);
  }
};
