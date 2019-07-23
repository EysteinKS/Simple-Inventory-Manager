import ProductName from "../components/ProductName";

interface IStringKey {
  [index: string]: any 
}

interface SavingState {
  isSaving: boolean,
  isSaved: boolean,
  savingError: string | boolean | null
}

interface LoadingState {
  isLoading: boolean,
  isLoaded: boolean,
  loadingError: string | boolean | null,
  error: string | null
}

interface SectionState extends SavingState, LoadingState {
  currentID: number
}

export interface LastChanged {
  global: Date | string,
  sections: {
    [index: string]: any,
    categories: Date | string,
    customers: Date | string,
    orders: Date | string,
    sales: Date | string,
    suppliers: Date | string
  }
}

export interface UserState {
  firstName: string,
  lastName: string,
  email: string,
  role: string,
  locations: string[],
  currentLocation: string,
  settings: {
    isInactiveVisible: boolean,
    language: string
  }
}

export interface LocationState {
  name: string,
  logoUrl: string | null,
  primaryColor: string | null,
  lastChanged: LastChanged
}

export interface AuthState extends SavingState, LoadingState {
  user: UserState,
  location: LocationState
  loggingOut: boolean
}

export interface ICategory extends IStringKey {
  categoryID: number,
  color?: string,
  name: string
}

export interface CategoriesState extends SectionState, IStringKey {
  categories: Array<ICategory>
}

export interface ICustomer extends IStringKey {
  customerID: number,
  name: string
}

export interface CustomersState extends SectionState, IStringKey {
  customers: ICustomer[]
}

export interface IProduct extends IStringKey {
  active: boolean,
  amount: number,
  categoryID: number,
  name: string,
  productID: number,
  comments?: string
}

export interface ProductsState extends SectionState, IStringKey {
  products: Array<IProduct>,
  sortedProducts: Array<IProduct>
}

export interface IOrderedProduct {
  amount: number,
  productID: number
}

export interface IOrder {
  dateOrdered: Date | string | null,
  dateReceived: Date | string | null,
  orderID: number,
  supplierID: number,
  ordered: Array<IOrderedProduct>,
  isNew?: boolean,
  active?: boolean
}

export interface OrdersState extends SectionState {
  orders: IOrder[],
  sortedOrders: IOrder[],
  currentOrder?: IOrder | any,
  history: IOrder[]
}

export interface ISale {
  customerID: number,
  dateOrdered: Date | string | null,
  dateSent: Date | string | null,
  ordered: Array<IOrderedProduct>,
  saleID: number,
  isNew?: boolean
}

export interface SalesState extends SectionState {
  sales: Array<ISale>,
  sortedSales: Array<ISale>,
  currentSale: ISale | null,
  history: Array<ISale>
}

export interface ISupplier {
  name: string,
  supplierID: number
}

export interface SuppliersState extends SectionState {
  suppliers: Array<ISupplier>
}

export interface ILoggedChange {
  timeChanged: string
  changedBy: {
    email: string
    name: string
  }
}

export interface ILoggedProduct {
  productID: number
  category: {
    categoryID: number
    name: string
  }
  name: string
  amount: number
  active: boolean
}

export interface ILoggedOrdered {
  amount: number
  productID: number
  name: string
}

export interface ILoggedOrder {
  orderID: number
  supplier: {
    supplierID: number
    name: string
  }
  dateOrdered: string
  dateReceived: string | null
  ordered: ILoggedOrdered[]
}

export interface ILoggedSale {
  saleID: number
  customer: {
    customerID: number
    name: string
  }
  dateOrdered: string
  dateSent: string | null
  ordered: ILoggedOrdered[]
}

export interface IReport {
  date: string
  changeLog: Array<ILoggedChange>
  products: {
    new: number[] | never[]
    all: ILoggedProduct[]
  }
  orders: {
    new: number[] | never[]
    active: ILoggedOrder[]
    received: number[] | never[]
  }
  sales: {
    new: number[] | never []
    active: ILoggedSale[]
    received: number[] | never[]
  }
}

export interface IDate {
  year: string,
  month: string,
  day: string
}

export interface IbyDate {
  [key: string]: IbyYear
}

export interface IbyYear {
  [key: string]: Array<string>
}

export interface IReportsDates {
  isLoading: boolean
  isLoaded: boolean
  loadingError: string | null
  byDate: IbyDate | null
}

export interface IReportsReport {
  isLoading: boolean
  isLoaded: boolean
  loadingError: string | null
  report: IReport | null
}

export interface ReportsState {
  isSaving: boolean
  isSaved: boolean
  savingError: string | null
  dates: IReportsDates
  report: IReportsReport
}

export type AnyState = 
  AuthState | 
  CategoriesState |
  CustomersState |
  ProductsState |
  OrdersState |
  SalesState |
  SuppliersState

export interface RootState {
  readonly auth: AuthState,
  readonly categories: CategoriesState,
  readonly customers: CustomersState,
  readonly products: ProductsState,
  readonly orders: OrdersState,
  readonly sales: SalesState,
  readonly suppliers: SuppliersState,
  readonly reports: ReportsState,
  [index: string]: any
}