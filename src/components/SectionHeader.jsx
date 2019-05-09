import React from 'react'

export default ({
  children
}) => {
  return (
    <header style={{
      display: "block",
      borderBottom: "black 1px solid"
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

export const KeyButton = ({ children, onClick, border = true }) => {
  let withBorder = {}
  let withoutBorder = {border: "none", padding: "16px", background: "none"}

  return(
    <button 
      onClick={onClick}
      style={border ? withBorder : withoutBorder}
    >
      {children}
    </button>
  )
}