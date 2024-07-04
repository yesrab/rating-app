import mongoose from "mongoose";
import accountError from "../errors/accountError.js";

const globalErrorHandler = (error, request, response, next) => {
  console.log("\x1b[31m", "You have triggered the server's global error handler");

  console.log(error);
  let accErr = false;
  if (error?.errorResponse?.errmsg?.includes("accounts")) {
    accErr = true;
  }
  if (error.code === 11000 && accErr) {
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
