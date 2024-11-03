const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

//helpers
const errorHandler = require("./helpers/error-handler");
const authJwt = require("./helpers/jwt");

const app = express();
const PORT = 5000;
const api = "/api/v1";
const db_URI = "mongodb://127.0.0.1:27017/ecom";

//routes
const productRoutes = require("./routers/products.router.js");
const categoryRoutes = require("./routers/categories.router.js");
const userRoutes = require("./routers/users.router.js");
const orderRoutes = require("./routers/orders.router.js");

//middle wares
app.use(cors());
app.options("*", cors);
app.use(express.json());
app.use(morgan("tiny"));
app.use(authJwt());

app.use(`${api}/users`, userRoutes);
app.use(`${api}/products`, productRoutes);
app.use(`${api}/categories`, categoryRoutes);
app.use(`${api}/orders`, orderRoutes);

app.use(errorHandler);

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
