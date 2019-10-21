import React from "react";
import { RootState, IReportsDates, IReportsReport } from "../redux/types";
import { useSelector, useDispatch } from "react-redux";
import { loadReportDates, loadReport } from "../redux/actions/reportsActions";
import { addZero, shouldLog } from "../constants/util";

export interface IDateArrays {
  years: string[];
  months: string[];
  days: string[];
}

export interface ISelected {
  year: string;
  month: string;
  day: string;
}

export interface ISetDate {
  changeYear: (value: string) => void;
  changeMonth: (value: string) => void;
  changeDay: (value: string) => void;
}

export type IonLoadReport = () => void;

export type TuseReports = [
  IReportsDates,
  IDateArrays,
  ISelected,
  ISetDate,
  IReportsReport,
  IonLoadReport,
  boolean
];

const useReports = (): TuseReports => {
  const [selectedYear, setYear] = React.useState("...");
  const [selectedMonth, setMonth] = React.useState("...");
  const [selectedDay, setDay] = React.useState("...");

  const { dates, report } = useSelector((state: RootState) => state.reports);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!dates.isLoaded) {
      shouldLog("Loading report dates...");
      dispatch(loadReportDates());
    }
    //eslint-disable-next-line
  }, []);

  const changeYear = React.useCallback((value: string) => {
    setYear(value);
    setMonth("...");
    setDay("...");
  }, []);

  const changeMonth = React.useCallback((value: string) => {
    setMonth(value);
    setDay("...");
  }, []);

  const changeDay = React.useCallback((value: string) => {
    setDay(value);
  }, []);

  const years = React.useMemo(() => {
    if (dates.byDate) {
      let yearKeys = Object.keys(dates.byDate);
      return yearKeys;
    } else {
      return null;
    }
  }, [dates.byDate]);

  const months = React.useMemo(() => {
    if (dates.byDate && selectedYear !== "...") {
      let monthKeys = Object.keys(dates.byDate[selectedYear]);
      return monthKeys;
    } else {
      return null;
    }
  }, [dates.byDate, selectedYear]);

  const days = React.useMemo(() => {
    if (dates.byDate && selectedMonth !== "...") {
      let days = dates.byDate[selectedYear][selectedMonth];
      return days;
    } else {
      return null;
    }
  }, [dates.byDate, selectedYear, selectedMonth]);

  const dateArrays = {
    years,
    months,
    days
  } as IDateArrays;

  const isButtonDisabled = React.useMemo(() => {
    if ([selectedYear, selectedMonth, selectedDay].includes("...")) {
      return true;
    } else {
      return false;
    }
  }, [selectedYear, selectedMonth, selectedDay]);

  const onLoadReport = React.useCallback(() => {
    let date = {
      year: selectedYear,
      month: addZero(selectedMonth),
      day: addZero(selectedDay)
    };
    dispatch(loadReport(date));
  }, [selectedYear, selectedMonth, selectedDay, dispatch]);

  const selected = React.useMemo(
    () => ({
      year: selectedYear,
      month: selectedMonth,
      day: selectedDay
    }),
    [selectedYear, selectedMonth, selectedDay]
  );

  const setDate = {
    changeYear,
    changeMonth,
    changeDay
  };

  return [
    dates,
    dateArrays,
    selected,
    setDate,
    report,
    onLoadReport,
    isButtonDisabled
  ];
};

export default useReports;
