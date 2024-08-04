const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = socketIo(httpServer);

  // Store client IDs and their corresponding socket IDs
  const clients = new Map();

  io.on("connection", (socket) => {
    const clientId = socket.handshake.query.clientId;
    if (clientId) {
      clients.set(clientId, socket.id);
    }

    socket.on("send-location", (data) => {
      const clientId = socket.handshake.query.clientId;
      if (clientId) {
        io.emit("receive-location", { id: clientId, ...data });
      }
    });

    socket.on("disconnect", () => {
      const clientId = socket.handshake.query.clientId;
      if (clientId) {
        clients.delete(clientId);
        io.emit("remove-location", clientId);
      }
      console.log(`Server disconnected ${socket.id}`);
    });
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
