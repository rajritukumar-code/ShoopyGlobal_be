//Utility function to send a standardized success response.
export function sendSuccessResponse(
  res,
  statusCode = 200,
  data = null,
  message = "",
  token = ""
) {
  const response = {
    success: true,
    statusCode,
  };

  if (message) {
    response.message = message;
  }
  if (token) {
    response.accessToken = token;
  }

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
}
