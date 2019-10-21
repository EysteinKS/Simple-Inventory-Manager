import { IThunkAction } from "./types";
import { IChange, IChangeTypes, IChangeEdit } from "../types";
import { addChange } from "../actions/reportsActions";

export interface generateChangeLogParams {
  type: IChangeTypes;
  section: string;
  name: string;
  id: string;
}

export const pushNewToChangeLog = (
  name: string,
  id: number,
  section: string
): IThunkAction => async dispatch => {
  const type = ("NEW_" +
    section.substring(0, section.length - 1).toUpperCase()) as IChangeTypes;
  dispatch(
    addChange({
      type,
      section,
      name,
      id
    })
  );
};

export const pushEditToChangeLog = (): IThunkAction => async (
  dispatch,
  getState
) => {};
