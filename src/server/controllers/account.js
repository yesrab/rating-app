const testAccount = (req, res) => {
  res.json({ message: "route functional" });
};

import Accounts from "../model/accountModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const secrete = process.env.JWT_SUPER_SEACRETE || "superGupthKey";
const generateToken = (idObj) => {
  return jwt.sign(idObj, secrete);
};

const signUp = async (req, res) => {
  const { name, email, password, address, persona } = req.body;
  const salt = await bcrypt.genSalt();
  const encryptedPassword = await bcrypt.hash(password, salt);
  const createdAccount = await Accounts.create({
    name,
    email,
    password: encryptedPassword,
    address,
    persona: persona ? persona : "user",
  });
  const { _id } = createdAccount;
  const id = _id.toString();
  const token = generateToken({
    id,
    name: createdAccount.name,
    email: createdAccount.email,
    persona: createdAccount.persona,
  });
  res.status(201).json({
    message: "account created",
    id,
    name: createdAccount.name,
    email: createdAccount.email,
    persona: createdAccount.persona,
    token,
    status: "success",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  const existingUser = await Accounts.login(email, password);
  if (!existingUser) {
    return res.status(404).json({
      status: "error",
      message: "Account not found",
    });
  }

  const token = generateToken({
    id: existingUser._id.toString(),
    name: existingUser.name,
    email: existingUser.email,
    persona: existingUser.persona,
  });
  res.status(202).json({
    message: "account logged in",
    id: existingUser._id.toString(),
    name: existingUser.name,
    email: existingUser.email,
    persona: existingUser.persona,
    token,
    status: "success",
  });
};

export { testAccount, signUp, login };
