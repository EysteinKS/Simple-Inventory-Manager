import React, {useState, useMemo, ReactNode, MouseEvent, FC} from 'react'
import { useSelector } from "react-redux"
import { RootState } from '../redux/types';

export default function SectionHeader({
  children
}: { children: ReactNode }) {
  const defaultColor = "#a9a9a9"
  const primaryColor = useSelector((state: RootState) => state.auth.location.primaryColor)
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

export const Title = ({children}: {children: ReactNode}) => {
  return <h1>{children}</h1>
}

export const Row = ({ grid, children, cName }: { grid: string, children: ReactNode, cName?: string }) => {
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

export const ColumnSplitter = () => {
  return(
    <hr
      data-width="1"
      data-size="500"
      style={{
        height: "5vh",
        borderLeft: "1px black solid",
        borderRight: "none"
      }}
    />
  )
}

export const Key = ({ children }: {children: ReactNode}) => {
  return(
    <p>
      {children}
    </p>
  )
}

interface IButton {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
}

export const KeyButton: FC<IButton> = ({children, onClick}) => {
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

export type TDirections = "asc" | "desc" | null
interface ISortingKey {
  onClick: (event: TDirections) => void
}

export const SortingKey: FC<ISortingKey> = ({ children, onClick }) => {
  const withoutBorder = {border: "none", padding: "16px", background: "none"}
  const [direction, setDirection] = useState(null as TDirections)

  const getNextDirection = (currentDir: TDirections) => {
    switch(currentDir){
      case("asc"):
        return "desc"
      case("desc"):
        return null
      default:
        return "asc"
    }
  }

  const changeDirection = (nextDir: TDirections) => {
    setDirection(nextDir)
  }

  return(
    <button
      style={withoutBorder}
      onClick={() => {
        let nextDir: TDirections = getNextDirection(direction)
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