import mongoose from "mongoose";
import accountError from "../errors/accountError.js";

const globalErrorHandler = (error, request, response, next) => {
  console.log("\x1b[31m", "You have triggered the server's global error handler");
  console.error(error);
  if (error.code === 11000) {
    return accountError(error, request, response);
  }
  if (
    error instanceof mongoose.Error.ValidationError &&
    error._message === "Account validation failed"
  ) {
    return accountError(error, request, response);
  }

  return response.status(error.statusCode || 500).json({
    message: "You have triggered the server's global error handler",
    error: error.message,
    status: "Error",
  });
};
export default globalErrorHandler;
