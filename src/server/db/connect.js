// const mongoose = require("mongoose");
import mongoose from "mongoose";
const connectDB = (url) => {
  return mongoose.connect(url);
};

export default connectDB;