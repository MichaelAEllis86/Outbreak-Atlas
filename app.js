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
const cors = require("cors");


app.use(express.json());
app.use(morgan("dev"));

const allowedOrigins = [
  "http://localhost:5173",
  "https://outbreak-atlas-cit0.onrender.com"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(authenticateJWT);
// ✅ add /api prefixes so frontend + production match
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/flu", fluRoutes);
app.use("/api/covid", covidRoutes);


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

