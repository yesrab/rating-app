import mongoose from "mongoose";
const accountError = (error, request, responce) => {
  const errorObject = {
    name: "",
    email: "",
    password: "",
    address: "",
  };
  if (error.code === 11000) {
    const duplicateKey = Object.keys(error.keyPattern);
    for (let key of duplicateKey) {
      errorObject[key] = `This ${key} already exists!`;
    }
    return responce.status(400).json({
      error: errorObject,
      status: "error",
      message: "This account already exists!",
    });
  }

  if (error instanceof mongoose.Error.ValidationError) {
    const validationKeys = Object.keys(error.errors);
    for (let key of validationKeys) {
      errorObject[key] = error.errors[key].message;
    }
    return responce.status(400).json({
      error: errorObject,
      status: "error",
      message: "Validation error!",
    });
  }
};

export default accountError;
