const express = require("express");
const dotenv = require("dotenv");
const { localDB } = require("./data/localDB");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const controlsRoutes = require("./routes/controlsRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
dotenv.config();
connectDB();

app.use(express.json()); // to accept json data

app.use("/api/user", userRoutes);
app.use("/api/controls", controlsRoutes);
// app.get("/", (req, res) => {
//     res.send("API Running.");
// });

// app.get("/local_storage", (req, res) => {
//     res.send(localDB);
// });

// app.get("/local_storage/:id", (req, res) => {
//     const element = localDB.find((entry) => entry._id == req.params.id);
//     res.send(element);
// });

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`Server started on port ${PORT}`.yellow.bold));