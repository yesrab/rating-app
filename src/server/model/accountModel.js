import mongoose from "mongoose";
import pkg from "validator";
const { isEmail, isStrongPassword } = pkg;
import bcrypt from "bcrypt";
const accountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "please enter your name"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please enter your email"],
      lowercase: true,
      validate: [isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: true,
      validate: [
        (value) => isStrongPassword(value, { minLength: 8, minUppercase: 1, minSymbols: 1 }),
        "Please enter a valid password",
      ],
    },
    address: {
      type: String,
      required: true,
      maxlength: 400,
    },
    persona: {
      type: String,
      default: "user",
      required: [true, "please select a user persona"],
      enum: {
        values: ["admin", "user", "owner"],
        message: "{value} is not a supported persona",
      },
    },
  },
  { timestamps: true },
);

accountSchema.statics.login = async function (email, password) {
  const loginError = new mongoose.Error.ValidationError();
  loginError.message = "Account login failed";
  loginError._message = "Account validation failed";
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw loginError;
  }
  throw loginError;
};

const Accounts = mongoose.model("Account", accountSchema);

export default Accounts;
