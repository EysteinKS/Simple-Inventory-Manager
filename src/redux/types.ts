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

interface SectionState extends SavingState, LoadingState, IStringKey {
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
  currentLocation: string,
  email: string,
  firstName: string,
  lastName: string,
  locations: string[],
  role: string,
  settings: {
    isInactiveVisible: boolean,
    language: string
  }
}

export interface AuthState extends SavingState, LoadingState, IStringKey {
  firstName: string,
  lastName: string,
  email: string,
  role: string,
  currentLocation: string | null,
  locationName: string,
  logoUrl: string | null,
  primaryColor: string | null,
  locations: string[],
  settings: {
    language: string,
    isInactiveVisible: boolean
  },
  lastChanged: LastChanged,
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
  history: Array<ISale>
}

export interface ISupplier {
  name: string,
  supplierID: number
}

export interface SuppliersState extends SectionState {
  suppliers: Array<ISupplier>
}

export type AnyState  = 
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
  [index: string]: any
}