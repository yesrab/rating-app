import Store from "../model/storeModel.js";
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
export { createStore };
