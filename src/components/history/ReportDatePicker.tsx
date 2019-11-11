import React from "react";
import DatePicker from "react-datepicker";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/types";
import {
  loadReportDates,
  loadReport
} from "../../redux/actions/reportsActions";

import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";

const ReportDatePicker = () => {
  const [date, setDate] = React.useState(null as null | Date);
  const dates = useSelector((state: RootState) => state.reports.dates);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!dates.isLoading && !dates.isLoaded) {
      dispatch(loadReportDates());
    }
    //eslint-disable-next-line
  }, []);

  const validDates = React.useMemo(() => {
    if (!dates.isLoaded) return null;

    let dateArr: Date[] = [];

    for (let year in dates.byDate) {
      let currentYear = dates.byDate[year];
      for (let month in currentYear) {
        let currentMonth = currentYear[month];
        currentMonth.forEach(day => {
          if (day.length < 2) {
            day = "0" + day;
          }
          let mString;
          if (month.length > 1) {
            mString = month;
          } else {
            mString = "0" + month;
          }
          let dateString = `${year}-${mString}-${day}T01:00:00`;
          let newDate = new Date(dateString);
          dateArr.push(newDate);
        });
      }
    }

    return dateArr;
  }, [dates.byDate, dates.isLoaded]);

  const lastChanged = useSelector(
    (state: RootState) => state.auth.location.lastChanged.global
  );
  const [isReloadingDates, setReloadingDates] = React.useState(false);
  React.useEffect(() => {
    if (validDates == null) return;
    //Use the global lastChanged date to create a date without time
    let lCDate = new Date(lastChanged);
    const LCDay = () => {
      let date = lCDate.getDate();
      if (date < 10) {
        return "0" + date;
      } else {
        return date;
      }
    };
    let dateString = `${lCDate.getFullYear()}-${lCDate.getMonth() +
      1}-${LCDay()}T01:00:00`;
    let sanitizedDate = new Date(dateString);
    //Get the last date of the valid dates array
    let lastDate = validDates[validDates.length - 1];
    //Reload report dates if numbers are inequal
    if (
      !isReloadingDates &&
      sanitizedDate.getTime() !== lastDate.getTime() &&
      dates.isLoaded
    ) {
      setReloadingDates(true);
      dispatch(loadReportDates());
    }
    //eslint-disable-next-line
  }, [lastChanged, validDates, isReloadingDates, setReloadingDates]);

  const onLoadReport = () => {
    if (date === null) return;

    const year = date.getFullYear();
    let month: string | number = date.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }

    let day: string | number = date.getDate();
    if (day < 10) {
      day = "0" + day;
    }
    const reportDate = { year, month, day };

    dispatch(loadReport(reportDate));
  };

  if (!dates.isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <PickerWrapper>
      <DatePicker
        selected={date}
        onChange={setDate}
        dateFormat={"dd/MM/yyyy"}
        placeholderText={"Velg dato..."}
        includeDates={validDates ? validDates : undefined}
      />
      <button disabled={date === null} onClick={onLoadReport}>
        Last inn
      </button>
    </PickerWrapper>
  );
};

const PickerWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  place-items: center;

  & > div {
    width: 60%;
    justify-self: end;
  }

  & > button {
    width: 40%;
    justify-self: start;
  }

  & > div > div > input {
    width: 100%;
    text-align: center;
  }
`;

export default ReportDatePicker;
