import React, { useState, ReactNode, FC } from "react";
import styled from "styled-components";
import useAuthLocation from "../../hooks/useAuthLocation";

export default function SectionHeader({ children }: { children: ReactNode }) {
  const { secondary } = useAuthLocation();

  return <StyledHeader bckColor={secondary}>{children}</StyledHeader>;
}

const StyledHeader = styled.header`
  display: grid;
  grid-template-rows: 1fr 1fr;
  background-color: ${(props: { bckColor: string | null }) =>
    props.bckColor ? props.bckColor : "#a9a9a9"};
`;

export const Title = styled.h1`
  margin: 0;
  text-align: center;
  padding-left: 1em;
  color: #000b;
`;

export const HeaderTop = styled.div`
  width: 100%;
  display: flex;
  place-items: center;
  justify-content: space-between;
  border-bottom: 1.2px solid #0003;
`;

export const HeaderButtons = styled.div`
  margin-right: 1em;
  display: flex;
`;

export const Row = ({
  grid,
  children,
  cName
}: {
  grid: string;
  children: ReactNode;
  cName?: string;
}) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: grid,
        justifyItems: "center",
        alignItems: "center"
      }}
      className={cName}
    >
      {children}
    </div>
  );
};

export const RowSplitter = () => {
  return (
    <hr
      style={{
        width: "95%",
        marginLeft: "auto",
        marginRight: "auto",
        borderTop: "none",
        borderBottom: "1px black solid"
      }}
    />
  );
};

export const ColumnSplitter = () => {
  return (
    <hr
      data-width="1"
      data-size="500"
      style={{
        height: "5vh",
        borderLeft: "1px solid #0003",
        borderRight: "none"
      }}
    />
  );
};

interface IButton {
  onClick?: () => void;
  border?: string;
}

export const KeyButton: FC<IButton> = ({ children, onClick, ...rest }) => {
  return (
    <StyledButton
      onClick={e => {
        e.currentTarget.blur();
        onClick && onClick();
      }}
      {...rest}
    >
      {children}
    </StyledButton>
  );
};

export type TDirections = "asc" | "desc" | null;
interface ISortingKey {
  onClick: (event: TDirections) => void;
  style?: any;
}

export const SortingKey: FC<ISortingKey> = ({
  children,
  onClick,
  style = {},
  ...rest
}) => {
  const [direction, setDirection] = useState(null as TDirections);

  const getNextDirection = (currentDir: TDirections) => {
    switch (currentDir) {
      case "asc":
        return "desc";
      case "desc":
        return null;
      default:
        return "asc";
    }
  };

  const changeDirection = (nextDir: TDirections) => {
    setDirection(nextDir);
  };

  return (
    <StyledButton
      style={{ ...style }}
      onClick={e => {
        e.currentTarget.blur();
        let nextDir: TDirections = getNextDirection(direction);
        changeDirection(nextDir);
        onClick(nextDir);
      }}
      {...rest}
    >
      {children} {direction === "asc" ? "↓" : direction === "desc" ? "↑" : null}
    </StyledButton>
  );
};

export const HeaderButton: React.FC<{ onClick: () => void }> = ({
  onClick,
  children
}) => {
  return (
    <StyledHeaderButton
      onClick={e => {
        e.currentTarget.blur();
        onClick();
      }}
    >
      {children}
    </StyledHeaderButton>
  );
};

const StyledHeaderButton = styled.button`
  display: flex;
  justify-content: space-evenly;
  height: 35px;
  width: 70px;
  margin: 0 0 0 0.5em;
  border-radius: 5px;
  border: 1px solid #0004;
  border-bottom: 2px solid #0006;
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.5);
  :hover {
    background-color: rgba(255, 255, 255, 0.4);
    color: #0009;
    border-bottom: 1px solid #0004;
  }
  :focus {
    outline: none;
  }
`;

export const Key = styled.div`
  cursor: help;
  margin: 0;
  display: flex;
  place-items: center;
  place-content: center;
  color: #000a;
  :hover {
    color: rgba(255, 255, 255, 0.2);
  }
`;

const StyledButton = styled.button`
  display: flex;
  justify-content: center;
  color: #000a;
  border: none;
  padding: 0;
  height: 100%;
  background: none;
  cursor: pointer;
  font-size: 18px;
  font-weight: 400;
  ${(props: { border?: string }) => {
    if (props.border && props.border === "left") {
      return "border-left: 1px solid #0001;";
    } else {
      return "border-right: 1px solid #0001;";
    }
  }}
  :hover {
    color: rgba(255, 255, 255, 0.2);
  }
  :focus {
    outline: none;
  }
`;
