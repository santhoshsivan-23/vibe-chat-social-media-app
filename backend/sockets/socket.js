const { Server } = require("socket.io");
const Message = require("../models/Message"); // you will create this later

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", (userId) => {
      socket.join(userId);
    });

    socket.on("send_message", async (data) => {
      const { sender, receiver, text, postImage, postText } = data;

      const msg = await Message.create({
        sender,
        receiver,
        text,
        postImage,
        postText
      });

      io.to(receiver).emit("receive_message", msg);
      io.to(sender).emit("receive_message", msg);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = initSocket;