import React from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../redux/types';
import { navigate } from '@reach/router';

/*
TODO

CREATE SIMILAR PAGE TO ORDERS AND SALES, BUT SPLIT BY ORDERED AND SENT
NEEDS BUTTON TO SEND AND TO RECEIVE

*/

const Admin = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user)

  if(currentUser.role !== "admin"){
    return <NonAdmin/>
  }

  return (
    <div>
      <Clients/>
      <Users/>
    </div>
  )
}

const NonAdmin = () => {
  return(
    <div>
      <p>This page is only available to administrators</p>
      <button onClick={() => navigate("/")}>Go home</button>
    </div>
  )
}

const Clients = () => {
  return(
    <div>

    </div>
  )
}

const NewClient = () => {
  return(
    <div>

    </div>
  )
}

const Users = () => {
  return(
    <div>

    </div>
  )
}

const User = () => {
  return(
    <div>
      
    </div>
  )
}

const NewUser = () => {
  return(
    <div>

    </div>
  )
}

export default Admin