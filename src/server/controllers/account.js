const testAccount = (req, res) => {
  res.json({ message: "route functional" });
};

import Accounts from "../model/accountModel.js";
import Store from "../model/storeModel.js";
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

const userList = async (req, res) => {
  const { type } = req.params;
  const owners = await Accounts.find({ persona: type }).select("-password");
  res.status(200).json({
    status: "success",
    data: owners,
    userType: type,
  });
};

const userCount = async (req, res) => {
  const userCount = await Accounts.countDocuments();
  const storeCount = await Store.countDocuments();
  const rating = await Store.aggregate([
    {
      $group: {
        _id: null,
        totalRatingsCountSum: {
          $sum: "$totalRatingsCount",
        },
      },
    },
  ]);
  res.status(200).json({
    status: "success",
    userCount,
    storeCount,
    ratingsCount: rating?.length ? rating[0].totalRatingsCountSum : 0,
  });
};

const getAdminStoreTable = async (req, res) => {
  const allStores = await Store.find().select("-ratings");
  const ownerIds = allStores.map((store) => store.owner);
  const owners = await Accounts.find({ _id: { $in: ownerIds } }).select("name");

  const ownerMap = owners.reduce((map, owner) => {
    map[owner._id] = owner.name;
    return map;
  }, {});

  const storesWithOwnerNames = allStores.map((store) => ({
    ...store.toObject(),
    owner: ownerMap[store.owner] || store.owner,
  }));

  // console.log(storesWithOwnerNames);
  return storesWithOwnerNames;
};

const getStoreTables = async (req, res) => {
  const adminStore = await getAdminStoreTable(req, res);
  res.json({
    message: "all tables as per admin acc",
    status: "success",
    adminStore,
  });
};

const getAdminUserTable = async () => {
  const allusers = await Accounts.find().select("-password");
  const redactedUsers = allusers.map((user) => ({ ...user.toObject(), password: "Encrypted" }));
  return redactedUsers;
};

const userTable = async (req, res) => {
  const userInfo = await getAdminUserTable();
  res.json({ status: "success", userInfo });
};

const getUserStoreTabel = async (req, res) => {
  const { userID } = req.params;
  const allStores = await Store.find();
  const userStores = allStores.map((store) => {
    const userRating = store.ratings.find((rating) => rating.userId.toString() === userID);
    return {
      _id: store._id,
      storename: store.name,
      storeaddress: store.address,
      overallRating: store.OverallRatings,
      myrating: userRating ? userRating.userRating : 0,
    };
  });
  res.json({ status: "success", userStores });
};

export {
  testAccount,
  signUp,
  login,
  userList,
  userCount,
  getStoreTables,
  userTable,
  getUserStoreTabel,
};
