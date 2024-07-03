const globalErrorHandler = (error, request, response, next) => {
  console.log(
    "\x1b[31m",
    "You have triggered the server's global error handler"
  );

  return response.status(error.statusCode || 500).json({
    message: "You have triggered the server's global error handler",
    error: error.message,
    status: "Error",
  });
};
export default globalErrorHandler;
