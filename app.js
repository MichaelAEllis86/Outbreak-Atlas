// app.js

const express = require('express');
const app = express();
const morgan = require("morgan");
const { NotFoundError } = require("./expressError");
const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const reportRoutes =require("./routes/report")
const fluRoutes = require("./routes/delphiflu");
const covidRoutes = require("./routes/delphicovid");


app.use(express.json());
app.use(morgan("dev"));
app.use(authenticateJWT);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/reports", reportRoutes)
app.use("/flu", fluRoutes);
app.use("/covid", covidRoutes);



/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */

app.use(function(err, req, res, next) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    res.status(err.status || 500);

  return res.json({
    status: err.status,
    message: err.message
  });
});

module.exports = app;

