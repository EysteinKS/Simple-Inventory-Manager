import React from "react";
import useReports from "../../hooks/useReports";
import Report from "./Report";

const Reports = () => {
  const [
    dates,
    dateArrays,
    selected,
    setDate,
    report,
    onLoadReport,
    isButtonDisabled
  ] = useReports();

  const { years, months, days } = dateArrays;
  const { year, month, day } = selected;
  const { changeYear, changeMonth, changeDay } = setDate;

  if (!dates.isLoaded && !dates.loadingError) {
    return <p>Loading...</p>;
  }

  if (dates.loadingError) {
    return <p>Ingen rapporter funnet!</p>;
  }

  return (
    <div>
      {dates.isLoaded && (
        <form
          onSubmit={e => e.preventDefault()}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}
        >
          <DateSelector arr={years} value={year} onChange={changeYear} />
          <DateSelector arr={months} value={month} onChange={changeMonth} />
          <DateSelector arr={days} value={day} onChange={changeDay} />
          <button
            style={{
              gridColumn: "2/3",
              padding: "10px",
              marginTop: "10px",
              borderColor: "darkgray"
            }}
            onClick={onLoadReport}
            disabled={isButtonDisabled}
          >
            Load report
          </button>
        </form>
      )}
      {report.isLoading && <p>Loading report...</p>}
      {report.isLoaded && report.report && <Report />}
    </div>
  );
};

interface ISelectorProps {
  arr: Array<string> | null;
  value: string;
  onChange: (value: string) => void;
}

const DateSelector: React.FC<ISelectorProps> = ({ arr, value, onChange }) => {
  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      onChange(event.target.value);
    },
    [onChange]
  );

  return (
    <select value={value} onChange={handleChange} disabled={!arr && true}>
      <option value="...">...</option>
      {arr &&
        arr.map(dateString => (
          <option value={dateString} key={"date_" + dateString}>
            {dateString}
          </option>
        ))}
    </select>
  );
};

export default Reports;
