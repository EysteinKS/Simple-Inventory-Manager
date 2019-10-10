import React from "react"
import CircularProgress from "@material-ui/core/CircularProgress";

interface PageLoadingProps {
  message: string
}

export const PageLoading: React.FC<PageLoadingProps> = ({ message }) => (
  <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
    <div style={{display: "grid", gridTemplateColumns: "1fr", placeSelf: "center"}}>
      <CircularProgress style={{ placeSelf: "center"}}/>
      <p style={{ height: "2vh", placeSelf: "center" }}>{message}</p>
    </div>
  </div>
);