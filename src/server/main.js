import express from "express";
import ViteExpress from "vite-express";
import "dotenv/config";
import "express-async-errors";
import connect from "./db/connect.js";
const PORT = 3000;
const DB_URI = process.env.DB || "";
const app = express();

//express body json parsing middleware
app.use(express.json());

//express url parsing middleware
app.use(express.urlencoded({ extended: false }));

app.get("/hello", (req, res) => {
  res.send("Hello Vite + React!");
});

//account router
import accountRouter from "./routes/account.js";
app.use("/api/v1/account", accountRouter);
//account router

//error handler middleware
import globalErrorHandler from "./middleware/globalErrorHandler.js";
app.use(globalErrorHandler);
//error handler middleware

const startServer = async () => {
  try {
    await connect(DB_URI);
    ViteExpress.listen(app, 3000, () => {
      console.clear();
      console.log(`Server Started at port ${PORT}`);
      console.log("");
      console.log("\x1b[36m%s\x1b[0m", `http://localhost:${PORT}/`);
      console.log("^ click here");
      console.log("");
    });
  } catch (e) {
    console.log(e);
  }
};
startServer();
