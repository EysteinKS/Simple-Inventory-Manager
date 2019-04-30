import React, { Component } from 'react';
import { connect } from "react-redux"

import Inventory from "./components/inventory/Inventory"
import Sales from "./components/sales/Sales"
import { loadInventory } from "./redux/actions/inventoryActions"
import { loadOrders } from "./redux/actions/ordersActions"

import './App.css';

class App extends Component {

  componentDidMount(){
    if(!this.props.inventory.isLoading && !this.props.inventory.loaded){
      this.props.dispatch(loadInventory())
    }
    if(!this.props.orders.isLoading && !this.props.orders.loaded){
      this.props.dispatch(loadOrders())
    }
  }
  
  render(){
    const inventory = this.props.inventory
    const orders = this.props.orders

    if(inventory.isLoading || orders.isLoading){
      return(
        <div>
          Loading...
        </div>
      )
    }

    if(inventory.error || orders.error){
      return(
        <div>
          <p>Error: {inventory.error.message || orders.error.message}</p>
        </div>
      )
    }

    if(inventory.loaded && orders.loaded){
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
  orders: state.orders
})

export default connect(mapStateToProps)(App);