import React, {useState} from 'react'
import { useDispatch } from "react-redux"

export default ({
  children
}) => {
  return (
    <header style={{
      display: "block",
      borderBottom: "gray 1px solid"
    }}>
      {children}
    </header>
  )
}

export const Title = ({children}) => {
  return <h3>{children}</h3>
}

export const Row = ({ grid, children, cName }) => {
  return(
    <div style={{
      display: "grid",
      gridTemplateColumns: grid,
      justifyItems: "center",
      alignItems: "center"
    }}
    className={cName}>
      {children}
    </div>
  )
}

export const Key = ({ children }) => {
  return(
    <p>
      {children}
    </p>
  )
}

export const KeyButton = ({children, onClick}) => {
  const withoutBorder = {border: "none", padding: "16px", background: "none"}

  return(
    <button
    onClick={onClick}
    style={withoutBorder}>
      {children}
    </button>
  )
}

export const SortingKey = ({ children, target, sorting }) => {
  const withoutBorder = {border: "none", padding: "16px", background: "none"}
  const dispatch = useDispatch()
  const [currentDirection, setDirection] = useState("asc");

  return(
    <button 
      onClick={() => {
        setDirection(currentDirection === "asc" ? "desc" : "asc")
        dispatch(target(sorting(currentDirection)))
      }}
      style={withoutBorder}
    >
      {children}{currentDirection === "asc" ? "↓" : "↑"}
    </button>
  )
}