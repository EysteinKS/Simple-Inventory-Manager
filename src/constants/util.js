export const getOrderedAmount = (orders = [], id) => {
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
  const sortedCategories = [...categories].sort(sortByName("asc"))
  //console.log(sortedCategories)
  return (a, b) => {
    const categoryA = sortedCategories[a.categoryID - 1].name.toUpperCase()
    const categoryB = sortedCategories[b.categoryID - 1].name.toUpperCase()
    let compare = 0
    if(categoryA > categoryB){
      compare = 1
    } else if (categoryA < categoryB){
      compare = -1
    }
    return ((direction === "desc") ? (compare * -1) : compare)
  }
}

const sortBy = (key = "", direction) => {
  return (a, b) => {
    console.log(`a[${key}] = `, a[key])
    const A = () => (typeof a === "string") ? a[key].toUpperCase() : a[key]
    const B = () => (typeof b === "string") ? b[key].toUpperCase() : b[key]

    let compare = 0
    if(A > B){
      compare = 1
    } else if (A < B){
      compare = -1
    }
    return ((direction === "desc") ? (compare * -1) : compare)
  }
}

export const sort = {
  by: sortBy,
  byName: sortByName,
  byCategory: sortByCategory
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
    categoryID: "1",
    active: true,
    amount: 0
  }
}

export const newOrder = (id) => {
  let date = new Date()
  return {
    orderID: id,
    supplierID: "1",
    dateOrdered: date,
    dateReceived: null,
    ordered: [],
    isNew: true
  }
}