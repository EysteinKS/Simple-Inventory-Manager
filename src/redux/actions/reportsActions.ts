import {
  IbyDate,
  IReport,
  IDate,
  RootState,
  ILoggedOrder,
  ILoggedSale,
  Changes,
  ILoggedLoan
} from "../types";
import {
  getSectionFromFirestore,
  getCurrentLocation
} from "../middleware/thunks";
import { IThunkAction } from "../middleware/types";
import { firebase, secondaryFirestore } from "../../firebase/firebase";
import { findInArray, addZero, shouldLog } from "../../constants/util";

const thisSection = "reports";

export const INITIALIZE_REPORTS = "INITIALIZE_REPORTS";
export const initializeReports = () => ({
  type: INITIALIZE_REPORTS
});

//REPORT DATES
export const LOAD_REPORT_DATES_BEGIN = "LOAD_REPORT_DATES_BEGIN";
export const loadReportDatesBegin = () => ({
  type: LOAD_REPORT_DATES_BEGIN
});

export const LOAD_REPORT_DATES_SUCCESS = "LOAD_REPORT_DATES_SUCCESS";
export const loadReportDatesSuccess = (byDate: IbyDate) => ({
  type: LOAD_REPORT_DATES_SUCCESS,
  payload: byDate
});

export const LOAD_REPORT_DATES_FAILURE = "LOAD_REPORT_DATES_FAILURE";
export const loadReportDatesFailure = (error: string) => ({
  type: LOAD_REPORT_DATES_FAILURE,
  payload: error
});

export const loadReportDates = () =>
  getSectionFromFirestore(
    thisSection,
    loadReportDatesBegin,
    loadReportDatesSuccess,
    loadReportDatesFailure,
    data => {
      return data.byDate;
    }
  );

export const LOAD_REPORT_BEGIN = "LOAD_REPORT_BEGIN";
export const loadReportBegin = () => ({
  type: LOAD_REPORT_BEGIN
});

export const LOAD_REPORT_SUCCESS = "LOAD_REPORT_SUCCESS";
export const loadReportSuccess = (report: IReport) => ({
  type: LOAD_REPORT_SUCCESS,
  payload: report
});

export const LOAD_REPORT_FAILURE = "LOAD_REPORT_FAILURE";
export const loadReportFailure = (error: string) => ({
  type: LOAD_REPORT_FAILURE,
  payload: error
});

export const loadReport = (date: IDate): IThunkAction => async (
  dispatch,
  getState
) => {
  let state = getState();
  let location = getCurrentLocation(state);
  //let { day, month, year } = state.reports.dateSelected
  let { day, month, year } = date;
  let reportRef = `${month}-${day}`;
  dispatch(loadReportBegin());
  secondaryFirestore
    .doc(`${location}/Reports/${year}/${reportRef}`)
    .get()
    .then(doc => {
      let data = doc.data() as IReport;
      dispatch(loadReportSuccess(data));
    })
    .catch(err => dispatch(loadReportFailure(err)));
};

export const SAVE_REPORT_BEGIN = "SAVE_REPORT_BEGIN";
export const saveReportBegin = () => {
  return {
    type: SAVE_REPORT_BEGIN
  };
};

export const SAVE_REPORT_SUCCESS = "SAVE_REPORT_SUCCESS";
export const saveReportSuccess = () => {
  shouldLog("Saved report");
  return {
    type: SAVE_REPORT_SUCCESS
  };
};

export const SAVE_REPORT_FAILURE = "SAVE_REPORT_FAILURE";
export const saveReportFailure = (error: string) => ({
  type: SAVE_REPORT_FAILURE,
  payload: error
});

const generateReport = (date: Date, state: RootState): IReport => {
  let products = state.products.products;
  let categories = state.categories.categories;
  let orders = state.orders.orders;
  let suppliers = state.suppliers.suppliers;
  let sales = state.sales.sales;
  let customers = state.customers.customers;
  let loans = state.loans.loans;

  let loggedChange = {
    timeChanged: date.toISOString(),
    changedBy: {
      email: state.auth.user.email,
      name: state.auth.user.firstName + " " + state.auth.user.lastName
    },
    changes: state.reports.changes
  };

  let allProducts = products.map(p => {
    return {
      productID: p.productID,
      category: {
        categoryID: p.categoryID,
        name: findInArray(categories, "categoryID", p.categoryID).name
      },
      name: p.name,
      amount: p.amount,
      active: p.active
    };
  });

  const dateToString = (date: Date | string | null) => {
    if (typeof date === "string" || date == null) {
      return date;
    } else {
      return new Date(date).toISOString();
    }
  };

  let allOrders = orders.map(o => {
    return {
      orderID: o.orderID,
      supplier: {
        supplierID: o.supplierID,
        name: findInArray(suppliers, "supplierID", o.supplierID).name
      },
      dateOrdered: dateToString(o.dateOrdered),
      dateReceived: o.dateReceived,
      ordered: o.ordered.map(ordered => {
        return {
          amount: ordered.amount,
          productID: ordered.productID,
          name: findInArray(products, "productID", ordered.productID).name
        };
      })
    } as ILoggedOrder;
  });

  let allSales = sales.map(s => {
    return {
      saleID: s.saleID,
      customer: {
        customerID: s.customerID,
        name: findInArray(customers, "customerID", s.customerID).name
      },
      dateOrdered: dateToString(s.dateOrdered),
      dateSent: s.dateSent,
      ordered: s.ordered.map(ordered => {
        return {
          amount: ordered.amount,
          productID: ordered.productID,
          name: findInArray(products, "productID", ordered.productID).name
        };
      })
    } as ILoggedSale;
  });

  let allLoans: ILoggedLoan[] = loans.map(l => {
    return {
      loanID: l.loanID,
      customer: {
        customerID: l.customerID,
        name: findInArray(customers, "customerID", l.customerID).name
      },
      dateOrdered: dateToString(l.dateOrdered),
      dateSent: dateToString(l.dateSent),
      ordered: l.ordered.map(ordered => {
        return {
          amount: ordered.amount,
          productID: ordered.productID,
          name: findInArray(products, "productID", ordered.productID).name
        };
      })
    };
  });

  let report: IReport = {
    date: date.toISOString(),
    changeLog: [loggedChange],
    products: {
      new: [],
      all: allProducts
    },
    orders: {
      new: [],
      active: allOrders,
      received: []
    },
    sales: {
      new: [],
      active: allSales,
      received: []
    },
    loans: {
      active: allLoans
    }
  };
  return report;
};

export const saveReport = (date: Date): IThunkAction => async (
  dispatch,
  getState
) => {
  let state = getState();
  let location = getCurrentLocation(state);

  let currentYear = date.getFullYear();
  let currentMonth = date.getMonth() + 1;
  let currentDay = date.getDate();

  let docName = `${addZero(currentMonth.toString())}-${addZero(
    currentDay.toString()
  )}`;

  let report = generateReport(date, state);
  shouldLog("Saving report: ", report);

  dispatch(saveReportBegin());

  // { a: { b: { c: [].push(value) } } } just longer
  await secondaryFirestore
    .doc(`${location}/Reports`)
    .update({
      [`byDate.${currentYear}.${currentMonth}`]: firebase.firestore.FieldValue.arrayUnion(
        addZero(currentDay.toString())
      )
    })
    .then()
    .catch(err => dispatch(saveReportFailure(err)));

  await secondaryFirestore
    .doc(`${location}/Reports/${currentYear}/${docName}`)
    .set(
      {
        ...report,
        changeLog: firebase.firestore.FieldValue.arrayUnion(report.changeLog[0])
      },
      { merge: true }
    )
    .then(() => dispatch(saveReportSuccess()))
    .catch(err => dispatch(saveReportFailure(err)));
};

export const ADD_CHANGE = "ADD_CHANGE";
export const addChange = (change: Changes) => ({
  type: ADD_CHANGE,
  payload: change
});

export const RESET_REPORTS = "RESET_REPORTS";
export const resetReports = () => ({
  type: RESET_REPORTS
});
