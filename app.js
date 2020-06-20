const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");

// *! Declareted routers
const routerProducts = require("./routes/products");

// *! Morgan check logs
app.use(morgan("dev"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Header",
    "Origin, X-Requested-With, Content-Type, Accpet, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).send({});
  }
  next();
});

// *! Name routers
app.use("/product", routerProducts);

// ? Notfound router
app.use((req, res, next) => {
  const message = "ops, notfound page";
  const error = new Error(message);
  error.status = 404;
  next(error);
});

// ? Error stack trace
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  return res.send({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
