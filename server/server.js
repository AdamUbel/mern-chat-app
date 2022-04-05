const express = require("express");
const cors = require("cors");
const { Message } = require("./models/message.model");
const { User } = require("./models/user.model");
const app = express();

// require("dotenv").config();
// const cron = require("node-cron");
// cron.schedule("* * * * *", function () {
//   // API call goes here
//   console.log("running a task every minute");
//   request("http://www.google.com", function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//       console.log(body); // Print the google web page.
//     }
//   });
// });

// const cronitor = require("cronitor")(process.env.CRONITOR_API_KEY);
// const setRooms = async () => {
//   const monitor = cronitor.Monitor.put({
//     type: "get-rooms",
//     key: "room-call",
//     schedule: "/5 * * * Mon-Fri",
//   });

const rooms = [
  "General",
  "Apex Legends",
  "World of Warcraft",
  "League of Leagends",
  "New World",
  "Call of Duty: Warzone",
];

//   cronitor.wrap("room-call", function () {
//     const request = require("request");
//     request("steamspy.com/api.php?request=top100in2weeks", function (error, response, body) {
//       if (!error && response.statusCode == 200) {
//         rooms.push(response.json(body)); // Show the HTML for the Google homepage.
//       }
//     });
//   });
// };
// setRooms();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

require("./configs/mongoose.config");
require("./routes/user.routes")(app);

const server = require("http").createServer(app);
const port = 5000;
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.get("/rooms", (req, res) => {
  res.json(rooms);
});

const getRoomMessages = async (room) => {
  let roomMessages = await Message.aggregate([
    { $match: { to: room } },
    { $group: { _id: "$date", messagesByDate: { $push: "$$ROOT" } } },
  ]);
  return roomMessages;
};

const sortMessagesByDate = (messages) => {
  return messages.sort(function (a, b) {
    let dateOne = a._id.split("/");
    let dateTwo = b._id.split("/");

    dateOne = dateOne[2] + dateOne[0] + dateOne[1];
    dateTwo = dateTwo[2] + dateTwo[0] + dateTwo[1];

    return dateOne < dateTwo ? -1 : 1;
  });
};

// NOTE Socket connection

io.on("connection", (socket) => {
  socket.on("new-user", async () => {
    const members = await User.find();
    io.emit("new-user", members);
  });

  socket.on("join-room", async (room) => {
    socket.join(room);
    let roomMessages = await getRoomMessages(room);
    roomMessages = sortMessagesByDate(roomMessages);
    socket.emit("room-messages", roomMessages);
  });

  socket.on("message-room", async (room, content, sender, time, date) => {
    console.log(content, sender);
    const newMessage = await Message.create({ content, from: sender, time, date, to: room });
    let roomMessages = await getRoomMessages(room);
    roomMessages = sortMessagesByDate(roomMessages);

    io.to(room).emit("room-messages", roomMessages);

    socket.broadcast.emit("notifications", room);
  });

  app.delete("/logout");
});

server.listen(port, () => console.log(`Listening to port: ${port}`));
