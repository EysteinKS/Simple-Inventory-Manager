import React, {useState} from 'react'

export default function SectionHeader({
  children
}) {
  return (
    <header style={{
      display: "block",
      borderBottom: "gray 1px solid",
      borderRadius: "15px 15px 0px 0px",
      backgroundColor: "#6FCF79"    
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

/* export const SortingKey = ({ children, target, sorting }) => {
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
} */

export const SortingKey = ({ children, onClick}) => {
  const withoutBorder = {border: "none", padding: "16px", background: "none"}
  const [direction, setDirection] = useState(null)

  const getNextDirection = (currentDir) => {
    switch(currentDir){
      case("asc"):
        return "desc"
      case("desc"):
        return null
      default:
        return "asc"
    }
  }

  const changeDirection = (nextDir) => {
    setDirection(nextDir)
  }

  return(
    <button
      style={withoutBorder}
      onClick={() => {
        let nextDir = getNextDirection(direction)
        changeDirection(nextDir)
        onClick(nextDir)
      }}>
        {children} {
          direction === "asc"
            ? "↓"
            : direction === "desc"
              ? "↑"
              : null
        }
      </button>
  )
}