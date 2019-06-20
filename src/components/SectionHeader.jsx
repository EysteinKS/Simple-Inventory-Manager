import React, {useState, useMemo} from 'react'
import { useSelector } from "react-redux"

export default function SectionHeader({
  children
}) {
  const defaultColor = "#a9a9a9"
  const primaryColor = useSelector(state => state.auth.primaryColor)
  const bckColor = useMemo(() => {
    if(primaryColor){
      return primaryColor
    } else {
      return defaultColor
    }
  }, [primaryColor])

  return (
    <header style={{
      display: "block",
      borderBottom: "gray 1px solid",
      borderRadius: "15px 15px 0px 0px",
      backgroundColor: bckColor,
      paddingTop: "1vh"
    }}>
      {children}
    </header>
  )
}

export const Title = ({children}) => {
  return <h1>{children}</h1>
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

export const RowSplitter = () => {
  return(
    <hr style={{
      width: "95%",
      marginLeft: "auto",
      marginRight: "auto",
      borderTop: "none",
      borderBottom: "1px black solid"
    }}/>
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