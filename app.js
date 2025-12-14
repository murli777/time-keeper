const cookieParser = require("cookie-parser");
require("dotenv").config();
const { connectToDatabase } = require("./db/connect");
const express = require("express");
const app = express();

const authRouter = require("./routes/auth");
const refreshRouter = require("./routes/refresh");
const tasksRouter = require("./routes/tasks");

const {
  authentication,
  errorHandler,
  notFound,
} = require("./middleware");

app.use(cookieParser());
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    return res.status(200).json({});
  }
  next();
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/refresh", refreshRouter);

app.use("/api/v1/tasks", authentication, tasksRouter);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3001;
const http = require("http");
const server = http.createServer(app);

const start = async () => {
  try {
    await connectToDatabase();
    server.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
    process.exit(1); // Exit on DB connection failure
  }
};

// Graceful shutdown
process.on("SIGTERM", () => {
  console.info("SIGTERM signal received.");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});

// Handle CTRL+C
process.on("SIGINT", () => {
  console.info("SIGINT signal received.");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});

start();
