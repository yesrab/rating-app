import Store from "../model/storeModel.js";
import Accounts from "../model/accountModel.js";
const createStore = async (req, res) => {
  const { name, address, owner, email } = req.body;
  const createdStore = await Store.create({
    name,
    address,
    owner,
    email,
  });
  res.status(201).json({
    message: `Store ${name} created`,
    status: "success",
    createStore,
  });
};

const addReview = async (req, res) => {
  const { userID, storeId, userRating } = req.body;
  const store = await Store.findById(storeId);

  if (!store) {
    return res.status(404).json({ message: "Store not found", status: "error" });
  }

  const user = await Accounts.findById(userID);
  if (!user) {
    return res.status(404).json({ message: "User not found", status: "error" });
  }

  const existingRatingIndex = store.ratings.findIndex(
    (rating) => rating.userId.toString() === userID,
  );

  if (existingRatingIndex !== -1) {
    store.ratings[existingRatingIndex].userRating = userRating;
  } else {
    store.ratings.push({ userId: userID, userRating, userName: user.name });
  }

  await store.save();

  res.json({ message: "Rating added/updated successfully", store, status: "success" });
};

export { createStore, addReview };
