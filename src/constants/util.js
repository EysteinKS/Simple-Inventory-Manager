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
  let c = categories.find(category => (
    category.categoryID === id
  ))
  return c.name
}
//GETTING VALUES END


//SORTING
export const sortByName = (products = [], direction) => {
  return [...products].sort((a, b) => {
    const nameA = a.name.toUpperCase()
    const nameB = b.name.toUpperCase()
    let compare = 0
    if(nameA > nameB){
      compare = 1
    } else if (nameA < nameB){
      compare = -1
    }
    return ((direction === "desc") ? (compare * -1) : compare)
  })
}

export const sortByCategory = (products = [], categories = [], direction) => {

}

export const hideInactive = (products = []) => {

}

export class SortableList {
  constructor(list, type){
    this.list = list
    this.sortedList = list
    this.type = type
    this.sortingKey = "id"
    this.sortingDirection = null
  }

  get list(){
    return sortedList
  }

  reset() {
    this.sortedList = this.list
    return this
  }

  filterByActive() {

  }

  sortByKey(key, values) {
    if(key !== this.sortingKey){
      this.sortingDirection = "asc"
    } else if (key === this.sortingKey){
      this.sortingDirection === "asc"
        ? this.sortingDirection = "desc"
        : this.sortingDirection = "asc"
    }
    this.sortingKey = key
    
    this.sortedList.sort(function(a, b) {
      let a = a[key]
      let b = b[key]
      if(typeof a[key] === "string"){
        a = a.toUpperCase()
        b = b.toUpperCase()
      }
      let compare = 0
      if(a > b){
        compare = 1
      } else if (a < b){
        compare = -1
      }
      return((this.sortingDirection === "asc") ? compare : (compare * -1))
    }) 

    return this
  }

}
//SORTING END

const list = new SortableList([], "")
list.sortByKey("name")
console.log(list.list)