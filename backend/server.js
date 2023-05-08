const express = require("express");
const dotenv = require("dotenv");
const { localDB } = require("./data/localDB");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const controlsRoutes = require("./routes/controlsRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const { protectSock } = require("./middleware/authSockMiddleware");
const { serialCom } = require("./controllers/controlsControllers");

const app = express();
dotenv.config();
connectDB();

app.use(express.json()); // to accept json data

app.use("/api/user", userRoutes);
app.use("/api/controls", controlsRoutes);

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

const plcPort = serialCom();
plcPort.on("open", function() {
  console.log("-- Connection opened --");

});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    if (protectSock(userData.token)) {
      socket.join(userData._id);
      console.log("userData",userData.name, "is connected");
      socket.emit("connected", {conneced: true});

      socket.on("webCMD", (command) => {
          console.log("command",command);
          plcPort.write(command)
      });
    
      var buff = "";
      plcPort.on("data", function(data) {
          // console.log("Data buff: " +  buff);
        buff += data
        if(buff && (buff.match(/^\\|\|/g) || []).length > 1) {
          const buffArr = buff.split("|")
          buff = buffArr[2].length > 0 ? ("|" + buffArr[2]) : ""
          socket.emit("plcRes", buffArr[1]);
          console.log("Data received: " +  buffArr[1]);
        }
      });
  
    }
  });
});

// module.exports = { io };
