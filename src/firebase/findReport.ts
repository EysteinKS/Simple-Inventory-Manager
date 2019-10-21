import { secondaryFirestore } from "./firebase";

interface IbyDate {
  [key: string]: IbyYear;
}

interface IbyYear {
  [key: string]: Array<string>;
}

interface IDate {
  year: string;
  month: string;
  day: string;
}

export const findReport = async (client: string, date: IDate) => {
  try {
    //Get byDate from firestore
    let reports = (await secondaryFirestore
      .doc(`${client}/Reports`)
      .get()
      .then(doc => doc.data())) as { byDate: IbyDate };
    let byDate = await reports.byDate;
    let reportDate = findDate(byDate, date);
  } catch (err) {}
};

const findDate = (byDate: IbyDate, date: IDate) => {
  let dateToCheck = date;
  if (isValidYear(byDate, date.year)) {
  }
};

const isValidYear = (byDate: IbyDate, year: string) => {
  return year in byDate;
};

const previousYear = (date: IDate): IDate => {
  return { day: "31", month: "12", year: (Number(date.year) - 1).toString() };
};

const previousMonth = (date: IDate): IDate => {
  if (date.month === "01") {
    return previousYear(date);
  } else {
    return {
      day: "31",
      month: (Number(date.month) - 1).toString(),
      year: date.year
    };
  }
};

const isValidMonth = (byYear: IbyYear, month: number) => {
  return month in byYear;
};

const findMonthInYear = (byYear: IbyYear, date: IDate) => {
  if (isValidMonth(byYear, Number(date.month))) {
    return findClosestDayInMonth(byYear[Number(date.month)], date.day);
  } else {
    return false;
  }
};

const findClosestDayInMonth = (byMonth: Array<string>, day: string) => {
  let closestDay: string | boolean = false;
  for (let d of byMonth) {
    if (Number(d) < Number(day)) {
      closestDay = d;
    } else if (d === day) {
      closestDay = day;
      break;
    } else if (Number(d) > Number(day)) {
      break;
    }
  }
  return closestDay;
};

const isValidDate = (date: IDate) =>
  "year" in date && "month" in date && "day" in date;

export async function getReportByDate(date: IDate) {
  if (!isValidDate(date)) {
    throw new Error("Unable to get reports, date object is invalid");
  }

  try {
    const reports = await secondaryFirestore.doc("Barcontrol/Reports").get();
  } catch (err) {
    console.error(
      `Error getting report for ${date.year}-${date.month}-${date.day}:`,
      err
    );
  }
}
