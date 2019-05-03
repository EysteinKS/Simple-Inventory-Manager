import React, { Component } from 'react';
import { connect } from "react-redux"

import Inventory from "./components/inventory/Inventory"
import Sales from "./components/sales/Sales"
import { loadProducts } from "./redux/actions/productsActions"
import { loadInventory } from "./redux/actions/inventoryActions"
import { loadOrders } from "./redux/actions/ordersActions"

import './App.css';

class App extends Component {

  componentDidMount(){
    let inventory = this.props.inventory
    if(!inventory.isLoading && !inventory.loaded){
      this.props.dispatch(loadInventory())
    }
    let orders = this.props.orders
    if(!orders.isLoading && !orders.loaded){
      this.props.dispatch(loadOrders())
    }
    let products = this.props.products
    if(!products.isLoading && !products.loaded){
      this.props.dispatch(loadProducts())
    }
  }
  
  render(){
    const inventory = this.props.inventory
    const orders = this.props.orders
    const products = this.props.products

    if(inventory.isLoading || orders.isLoading || products.isLoading){
      return(
        <div>
          Loading...
        </div>
      )
    }

    if(inventory.error || orders.error || products.error){
      return(
        <div>
          <p>Error: {inventory.error.message || orders.error.message}</p>
        </div>
      )
    }

    if(inventory.loaded && orders.loaded && products.loaded){
      return(
        <div className="app-grid">
          <Inventory className="grid-left"/>
          <Sales className="grid-right"/>
        </div>
      )
    }

    return(
      null
    )
  }

}

const mapStateToProps = state => ({
  inventory: state.inventory,
  orders: state.orders,
  products: state.products
})

export default connect(mapStateToProps)(App);