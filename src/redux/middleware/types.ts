import { ThunkDispatch, ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import { RootState } from "../types";

export interface IAction {
  readonly type: string;
}

export type TDispatch = ThunkDispatch<RootState, {}, AnyAction>;

export type IDispatch = (action: IThunkAction) => void;
export type IGetState = () => RootState;

//type TThunkAction = ThunkAction<Promise<any>, RootState, {}, Action>

export type IThunkAction = ThunkAction<Promise<any>, RootState, {}, AnyAction>;

// A thunk action interface, easing use of thunks
/* export interface IThunkAction {
  dispatch: IDispatch,
  getState?: IGetState
} */
