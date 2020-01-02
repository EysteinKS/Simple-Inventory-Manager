import { AnyAction } from "redux";
import produce from "immer";
import { NotificationState } from "../types";

import * as actions from "../actions/notificationActions";

const initialState: NotificationState = {
  notifications: []
};

export default (
  state: NotificationState = initialState,
  { type, payload }: AnyAction
) =>
  produce(state, draft => {
    switch (type) {
      case actions.ADD_NOTIFICATION:
        if (state.notifications.findIndex(n => n.id === payload.id) === -1) {
          draft.notifications.push(payload);
        }
        break;
      case actions.REMOVE_NOTIFICATION:
        draft.notifications = state.notifications.filter(n => n.id !== payload);
        break;
      default:
        return state;
    }
  });
