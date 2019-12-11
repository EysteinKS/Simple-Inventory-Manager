import React from "react";
import Spinner from "./Spinner";
import styled from "styled-components";

interface PageLoadingProps {
  message: string;
}

export const PageLoading: React.FC<PageLoadingProps> = ({ message }) => (
  <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        placeSelf: "center"
      }}
    >
      <Spinner />
      <LoadingText>{message}</LoadingText>
    </div>
  </div>
);

const LoadingText = styled.p`
  height: 2vh;
  justify-self: center;
  align-self: center;
`;

export const NoTextLoading = () => {
  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "1fr", height: "95vh" }}
    >
      <Spinner />
    </div>
  );
};
