const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoute = require("./src/router/auth.router");
const companyRoute = require("./src/router/company.router");
const itemRoute = require("./src/router/item.router");
const transactionRoute = require("./src/router/transaction.router");

app.use("/api/auth", authRoute);
app.use("/api/company", companyRoute);
app.use("/api/item", itemRoute);
app.use("/api/transaction", transactionRoute);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
