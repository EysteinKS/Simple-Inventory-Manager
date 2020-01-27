interface IStringKey {
  [index: string]: any;
}

interface SavingState {
  isSaving: boolean;
  isSaved: boolean;
  savingError: string | boolean | null;
}

interface LoadingState {
  isLoading: boolean;
  isLoaded: boolean;
  loadingError: string | boolean | null;
  error: string | null;
}

interface SectionState extends SavingState, LoadingState, IStringKey {
  currentID: number;
}

//AUTH

export interface LastChanged {
  global: Date | string;
  sections: {
    [index: string]: any;
    categories: Date | string;
    customers: Date | string;
    orders: Date | string;
    sales: Date | string;
    suppliers: Date | string;
    loans: Date | string;
  };
}

export interface UserState {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  locations: string[];
  currentLocation: string;
  settings: {
    isInactiveVisible: boolean;
    showTooltips: boolean;
    language: string;
    useAutoSave: boolean;
    timeToAutoSave: number;
  };
}

export interface LocationState {
  name: string;
  logoUrl: string | null;
  primaryColor: string | null;
  lastChanged: LastChanged;
}

export interface AuthState extends SavingState, LoadingState {
  user: UserState;
  location: LocationState;
  loggingOut: boolean;
  hasNewChanges: boolean;
  isDemo: boolean;
}

//AUTH END

//CATEGORIES

export interface ICategory extends IStringKey {
  categoryID: number;
  color?: string;
  name: string;
}

export interface CategoriesState extends SectionState, IStringKey {
  categories: Array<ICategory>;
}

//CATEGORIES END

//CUSTOMERS

export interface ICustomer extends IStringKey {
  customerID: number;
  name: string;
}

export interface CustomersState extends SectionState, IStringKey {
  customers: ICustomer[];
}

//CUSTOMERS END

//PRODUCTS

export interface IProduct extends IStringKey {
  active: boolean;
  amount: number;
  categoryID: number;
  name: string;
  productID: number;
  comments?: string;
}

export interface ProductsState extends SectionState, IStringKey {
  products: Array<IProduct>;
  currentProduct: IProduct | null;
}

//PRODUCTS END

//ORDERS

export interface IOrderedProduct {
  amount: number;
  productID: number;
}

export interface IOrder {
  dateOrdered: Date | string | null;
  dateReceived: Date | string | null;
  orderID: number;
  supplierID: number;
  ordered: Array<IOrderedProduct>;
  isNew?: boolean;
  active?: boolean;
  isDeleted?: boolean;
}

export interface OrdersState extends SectionState {
  orders: IOrder[];
  currentOrder?: IOrder | any;
  history: IOrder[];
}

//ORDERS END

//SALES

export interface ISale {
  customerID: number;
  dateOrdered: Date | string | null;
  dateSent: Date | string | null;
  ordered: Array<IOrderedProduct>;
  saleID: number;
  isNew?: boolean;
  isDeleted?: boolean;
  isReady?: boolean;
}

export interface SalesState extends SectionState {
  sales: Array<ISale>;
  currentSale: ISale | null;
  history: Array<ISale>;
}

//SALES END

//LOANS

export interface ILoan {
  customerID: number;
  dateOrdered: Date | string | null;
  dateSent: Date | string | null;
  dateReceived: Date | string | null;
  ordered: Array<IOrderedProduct>;
  loanID: number;
  isNew?: boolean;
  isDeleted?: boolean;
}

export interface LoansState extends SectionState {
  loans: Array<ILoan>;
  currentLoan: ILoan | null;
  history: Array<ILoan>;
}

//LOANS END

//SUPPLIERS

export interface ISupplier {
  name: string;
  supplierID: number;
  products: number[];
}

export interface SuppliersState extends SectionState {
  suppliers: Array<ISupplier>;
}

//SUPPLIERS END

//REPORTS

export interface ILoggedChange {
  timeChanged: string;
  changedBy: {
    email: string;
    name: string;
  };
  changes: Changes[];
}

export interface ILoggedProduct {
  productID: number;
  category: {
    categoryID: number;
    name: string;
  };
  name: string;
  amount: number;
  active: boolean;
}

export interface ILoggedOrdered {
  amount: number;
  productID: number;
  name: string;
}

export interface ILoggedOrder {
  orderID: number;
  supplier: {
    supplierID: number;
    name: string;
  };
  dateOrdered: string;
  dateReceived: string | null;
  ordered: ILoggedOrdered[];
}

export interface ILoggedSale {
  saleID: number;
  customer: {
    customerID: number;
    name: string;
  };
  dateOrdered: string;
  dateSent: string | null;
  ordered: ILoggedOrdered[];
}

export interface ILoggedLoan {
  loanID: number;
  customer: {
    customerID: number;
    name: string;
  };
  dateOrdered: string | null;
  dateSent: string | null;
  ordered: ILoggedOrdered[];
}

export interface IReport {
  date: string;
  changeLog: Array<ILoggedChange>;
  products: {
    new: number[] | never[];
    all: ILoggedProduct[];
  };
  orders: {
    new: number[] | never[];
    active: ILoggedOrder[];
    received: number[] | never[];
  };
  sales: {
    new: number[] | never[];
    active: ILoggedSale[];
    received: number[] | never[];
  };
  loans: {
    active: ILoggedLoan[];
  };
}

export interface IDate {
  year: string | number;
  month: string | number;
  day: string | number;
}

export interface IbyDate {
  [key: string]: IbyYear;
}

export interface IbyYear {
  [key: string]: Array<string>;
}

export interface IReportsDates {
  isLoading: boolean;
  isLoaded: boolean;
  loadingError: string | null;
  byDate: IbyDate | null;
}

export interface IReportsReport {
  isLoading: boolean;
  isLoaded: boolean;
  loadingError: string | null;
  report: IReport | null;
}

export type IChangeTypes =
  | "NEW_PRODUCT"
  | "NEW_CATEGORY"
  | "NEW_ORDER"
  | "NEW_SUPPLIER"
  | "NEW_SALE"
  | "NEW_CUSTOMER"
  | "NEW_LOAN"
  | "EDIT_PRODUCT_INFO"
  | "EDIT_CATEGORY_INFO"
  | "EDIT_ORDER_INFO"
  | "EDIT_SUPPLIER_INFO"
  | "EDIT_SALE_INFO"
  | "EDIT_CUSTOMER_INFO"
  | "EDIT_LOAN_INFO"
  | "EDIT_PRODUCT_AMOUNT"
  | "RECEIVED_ORDER"
  | "RECEIVED_LOAN"
  | "SENT_SALE"
  | "SENT_LOAN"
  | "DELETE_ORDER"
  | "DELETE_SALE"
  | "DELETE_LOAN"
  | "UNDO_SALE"
  | "UNDO_ORDER"
  | "UNDO_LOAN";

export interface IChange {
  section: string;
  name?: string;
  id: number;
  type: IChangeTypes;
  reason?: string;
}

export interface IChangeValue {
  key: string;
  oldValue: any;
  newValue: any;
}

export interface IChangeEdit extends IChange {
  changed: IChangeValue[];
}

export type Changes = IChange | IChangeEdit;

export interface ReportsState {
  isSaving: boolean;
  isSaved: boolean;
  savingError: string | null;
  dates: IReportsDates;
  report: IReportsReport;
  changes: Changes[];
}

export type NotificationTypes = "success" | "info" | "warning";

export interface INotification {
  message: string;
  type: NotificationTypes;
  id: number;
  timeout?: number;
}

export interface NotificationState {
  notifications: INotification[];
}

//REPORTS END

export type AnyState =
  | AuthState
  | CategoriesState
  | CustomersState
  | ProductsState
  | OrdersState
  | SalesState
  | SuppliersState
  | LoansState;

export interface RootState {
  readonly auth: AuthState;
  readonly categories: CategoriesState;
  readonly customers: CustomersState;
  readonly products: ProductsState;
  readonly orders: OrdersState;
  readonly sales: SalesState;
  readonly loans: LoansState;
  readonly suppliers: SuppliersState;
  readonly reports: ReportsState;
  readonly notifications: NotificationState;
  [index: string]: any;
}
