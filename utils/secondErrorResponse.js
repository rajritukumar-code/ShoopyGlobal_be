//Utility function to send a standardized error response.
export function sendErrorResponse(res, statusCode, title, message) {
  return res.status(statusCode).json({
    success: false,
    statusCode,
    error: {
      title,
      message,
    },
  });
}
