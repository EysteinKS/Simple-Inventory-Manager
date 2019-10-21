import React from "react";
import CompletedOrders from "./Completed/CompletedOrders";
import CompletedSales from "./Completed/CompletedSales";
import CompletedLoans from "./Completed/CompletedLoans";

const Completed = () => {
  return (
    <div>
      <CompletedOrders />
      <CompletedSales />
      <CompletedLoans />
    </div>
  );
};

export default Completed;
