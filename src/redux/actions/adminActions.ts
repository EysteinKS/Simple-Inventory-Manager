export const LOAD_ADMIN_REQUESTS_BEGIN = "LOAD_ADMIN_REQUESTS_BEGIN";
export const loadAdminRequestsBegin = () => ({
  type: LOAD_ADMIN_REQUESTS_BEGIN
});

export const LOAD_ADMIN_REQUESTS_SUCCESS = "LOAD_ADMIN_REQUESTS_SUCCESS";
export const loadAdminRequestsSuccess = (data: any) => ({
  type: LOAD_ADMIN_REQUESTS_SUCCESS,
  payload: data
});

export const LOAD_ADMIN_REQUESTS_FAILURE = "LOAD_ADMIN_REQUESTS_FAILURE";
export const loadAdminRequestsFailure = (error: string) => ({
  type: LOAD_ADMIN_REQUESTS_FAILURE,
  payload: error
});

export const loadAdminRequests = () => {};
