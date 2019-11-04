import React from "react";
import Report from "./Report";
import ReportDatePicker from "./ReportDatePicker";
import { RootState } from "../../redux/types";
import { useSelector } from "react-redux";

const Reports = () => {
  const report = useSelector((state: RootState) => state.reports.report)

  return (
    <div>
      <ReportDatePicker/>
      {report.isLoading && <p>Loading report...</p>}
      {report.isLoaded && report.report && <Report />}
    </div>
  );
};

export default Reports;
