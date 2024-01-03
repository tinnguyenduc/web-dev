const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const morgan = require("morgan");
const app = express();
const PORT = 8080;

// Custom middleware
const cors = require("cors");
const session = require("express-session");
const logger = require("../middleware/winston");
const healthcheck = require("../middleware/healthcheck");
const notFound = require("../middleware/notFound");
const verifyToken = require("../middleware/authentication");
const validator = require("../middleware/validator");

// ROUTES
const todoRoutes = require("../routes/todo.routes");
const authRoutes = require("../routes/auth.routes");
const userRoutes = require("../routes/user.routes");
const messageRoutes = require("../routes/messages.routes");
const moviesRoutes = require("../routes/movies.routes");

// mongoDB connection
try {
  mongoose.connect("mongodb://localhost:27017/epita");
  logger.info("Connected to MongoDB");
} catch (error) {
  logger.error("Error connecting to MongoDB" + error);
}

// MIDDLEWARE
const registerCoreMiddleWare = async () => {
  try {
    app.use(
      session({
        secret: "1234",
        resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
        saveUninitialized: true, // Forces a session that is "uninitialized" to be saved to the store. A session is uninitialized when it is new but not modified
        cookie: {
          secure: false,
          httpOnly: true,
        },
      })
    );

    app.use(morgan("combined", { stream: logger.stream }));
    app.use(cors());
    app.use(helmet());
    app.use(express.json());

    app.use(validator);
    app.use(healthcheck);
    app.use("/auth", authRoutes);

    app.use(verifyToken);

    // Route registration
    app.use("/todo", todoRoutes);
    app.use("/user", userRoutes);
    app.use("/messages", messageRoutes);
    app.use("/movies", moviesRoutes);

    // 404 handling
    app.use(notFound);

    logger.info("Done registering all middlewares");
  } catch (error) {
    logger.error(
      "Error thrown while executing registerCoreMiddleWare " +
        JSON.stringify(error, undefined, 2)
    );
  }
};

// handling uncaught exceptions
const handleError = () => {
  // 'process' is a built in object in nodejs
  // if uncaught execption, then execute this
  // not that we can catch uncaught exceptions from the process object
  process.on("uncaughtException", (err) => {
    logger.error(`UNCAUGHT_EXCEPTION OCCURED : ${JSON.stringify(err.stack)}`);
    process.exit(1);
  });
};

// start application
const startApp = async () => {
  try {
    // register core application level middleware
    await registerCoreMiddleWare();

    app.listen(PORT, () => {
      logger.info("Server running on http://127.0.0.1:" + PORT);
    });

    // exit on unchaught exception
    handleError();
  } catch (err) {
    logger.error(
      `startup :: Error while booting the applicaiton: ${JSON.stringify(
        err,
        undefined,
        2
      )}`
    );
    throw err;
  }
};

module.exports = { startApp };
