export const successResponse = (res, payload) => {
  const {
    code = 200,
    message,
    data,
    pagination = false,
    token = false,
  } = payload;
  const response = {
    status: 'success',
    message,
    data,
  };
  if (pagination) {
    response.pagination = pagination;
  }
  if (token) {
    response.token = token;
    delete response.data;
  }
  res.status(code).json(response);
};
export const failedResponse = (res, payload) => {
  const { code, message, details, stack } = payload;
  const response = {
    status: 'failed',
    message,
    stack,
  };
  if (details) {
    response.details = details;
  }
  return res.status(code || 500).json(response);
};
