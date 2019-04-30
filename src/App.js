import React, { Component } from 'react';
import { connect } from "react-redux"

import Inventory from "./components/inventory/Inventory"
import { loadInventory } from "./redux/actions/inventoryActions"

import './App.css';

class App extends Component {

  componentDidMount(){
    if(!this.props.inventory.isLoading && !this.props.inventory.loaded){
      this.props.dispatch(loadInventory())
    }
  }
  
  render(){
    const { isLoading, loaded, error, inventory } = this.props.inventory

    return(
      <Inventory/>
    )
  }

}

const mapStateToProps = state => ({
  inventory: state.inventory
})

export default connect(mapStateToProps)(App);