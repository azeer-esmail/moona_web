const express = require("express");
const dotenv = require("dotenv");
const { localDB } = require("./data/localDB");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const controlsRoutes = require("./routes/controlsRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const { protectSock } = require("./middleware/authSockMiddleware");

const { serialCom } = require("./controllers/serialPortControlles");

const app = express();
dotenv.config();
connectDB();

app.use(express.json()); // to accept json data

app.use("/api/user", userRoutes);
app.use("/api/controls", controlsRoutes);
serialCom();
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
const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`.yellow.bold)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    if (protectSock(userData.token)) {
      socket.join(userData._id);
      console.log("userData",userData);
      socket.emit("connected", {conneced: true});
    }
  });
});

module.exports = { io };

