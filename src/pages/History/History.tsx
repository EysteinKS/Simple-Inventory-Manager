import React from "react";
import Reports from "../../components/history/Reports";
import Completed from "../../components/history/Completed";
import styled from "styled-components";

//const historyPages = ["reports", "completed"]

const HistoryNav = styled.nav`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-bottom: 1vh;
`;

const NavButton = styled.button`
  height: 3vh;
  font-size: 15px;
  color: ${(props: { isActive: boolean }) => {
    if (props.isActive) {
      return "#fff";
    } else {
      return "#000";
    }
  }};
  background-color: ${(props: { isActive: boolean }) => {
    if (props.isActive) {
      return "#777";
    } else {
      return "#ccc";
    }
  }};
  :hover {
    cursor: pointer;
  }
  :focus {
    outline: 0;
  }
`;

const History = () => {
  const [page, setPage] = React.useState("reports");

  return (
    <div style={{ margin: "1vh 10vw 10vh 10vw" }}>
      <HistoryNav>
        <NavButton
          isActive={page === "reports"}
          onClick={() => setPage("reports")}
        >
          Rapporter
        </NavButton>
        <NavButton
          isActive={page === "completed"}
          onClick={() => setPage("completed")}
        >
          Fullført
        </NavButton>
      </HistoryNav>
      {page === "reports" && <Reports />}
      {page === "completed" && <Completed />}
    </div>
  );
};

export default History;
