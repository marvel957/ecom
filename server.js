const express = require("express");
const session = require("express-session");
const passport = require("passport");
require("./config/passport");
const app = express();
const mongoose = require("mongoose");

const PORT = 5000;
const db_URI = "mongodb://127.0.0.1:27017/crud-app";
const productRoute = require("./routes/products.route");
const userRoute = require("./routes/auth.route");

//middle wares
app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).send("Hello from node api");
});
app.use("/api/products", productRoute);
app.use("/auth", userRoute);

mongoose.connection.once("open", () => {
  console.log("connection successful");
});
mongoose.connection.on("error", (error) => {
  console.log(error.message);
});

async function startServer() {
  await mongoose.connect(db_URI);
  app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}`);
  });
}
startServer();
