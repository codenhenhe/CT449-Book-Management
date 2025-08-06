import express from "express";
import ApiError from "./app/api-error.js";
import cors from "cors";
import AdminRoute from "./app/routes/admin.route.js";
import StaffRoute from "./app/routes/staff.route.js";
import ReaderRoute from "./app/routes/reader.route.js";
import BookRoute from "./app/routes/book.route.js";
import CategoryRoute from "./app/routes/category.routes.js";
import AuthorRoutes from "./app/routes/author.route.js";
import { login } from "./app/controllers/login.controller.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/admin", AdminRoute);
app.use("/api/staff", StaffRoute);
app.use("/api/reader", ReaderRoute);
app.use("/api/books", BookRoute);
app.use("/api/categories", CategoryRoute);
app.use("/api/authors", AuthorRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to book management application." });
});

app.post("/api/login", login);
// handle 404 response
app.use((req, res, next) => {
  return next(new ApiError(404, "Resource not found"));
});

// define error-handling middleware last
app.use((err, req, res, next) => {
  return res
    .status(err.statusCode || 500)
    .json({ message: err.message || "Internal Server Error" });
});

export default app;
