import React, { Component } from 'react';
import { connect } from "react-redux"

import Main from "./components/Main"
import { data } from "./config"
import { loadProducts, loadProductsNew } from "./redux/actions/productsActions"
import { loadOrders } from "./redux/actions/ordersActions"
import { loadCategories } from "./redux/actions/categoriesActions"

import './App.css';

class App extends Component {

  componentDidMount(){
    let orders = this.props.orders
    if(!orders.isLoading && !orders.loaded){
      this.props.dispatch(loadOrders())
    }
    let products = this.props.products
    if(!products.isLoading && !products.isLoaded){
      (data === "Local")
      ? this.props.dispatch(loadProducts())
      : this.props.dispatch(loadProductsNew())
    }
    let categories = this.props.categories
    if(!categories.isLoading && !categories.isLoaded){
      this.props.dispatch(loadCategories())
    }
  }
  
  render(){
    const orders = this.props.orders
    const products = this.props.products
    const categories = this.props.categories

    if(orders.isLoading || products.isLoading){
      return(
        <div>
          Loading...
        </div>
      )
    }

    if(orders.error || products.error){
      return(
        <div>
          <p>Error: {orders.error.message || products.error.message}</p>
        </div>
      )
    }

    if(orders.loaded && products.isLoaded && categories.isLoaded){
      return(
        <div className="app-grid">
          <Main className="grid-left"/>
        </div>
      )
    }

    return(
      null
    )
  }

}

const mapStateToProps = state => ({
  orders: state.orders,
  products: state.products,
  categories: state.categories
})

export default connect(mapStateToProps)(App);