const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");
const url = require("url");

const PORT = process.env.PORT || 80;

var app = express();

app.set("view engine", "ejs");

app.use(express.static("build"));

app.get("/preview/room/:roomId", function (req, res) {
  const roomId = req.params.roomId;
  const roomState = state.rooms[roomId];
  roomState &&
    res.render("preview", {
      js: state.rooms[roomId].editors.js.value,
      css: state.rooms[roomId].editors.css.value,
      html: state.rooms[roomId].editors.html.value,
    });
});

app.get("*", function (req, res) {
  res.sendfile("./build/index.html");
});

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

server.listen(PORT);

const state = {
  rooms: {},
  connections: {},
};

wss.on("connection", function (connection, req) {
  const parameters = url.parse(req.url, true);

  const roomId = parameters.query.room || uuidv4();
  const name = parameters.query.name;

  if (state.rooms[roomId] && state.rooms[roomId].users.length === 4) {
    connection.close(4000);
    return;
  }

  init(connection, name, roomId);

  connection.on(
    "message",
    function incoming(event) {
      const data = JSON.parse(event);
      const usersToAnnounce = getOtherUsers(this.roomId, this.user.id);
      switch (data.type) {
        case "update-js":
          state.rooms[this.roomId].editors.js.value = data.value;
          announce(usersToAnnounce, data);
          break;
        case "update-css":
          state.rooms[this.roomId].editors.css.value = data.value;
          announce(usersToAnnounce, data);
          break;
        case "update-html":
          state.rooms[this.roomId].editors.html.value = data.value;
          announce(usersToAnnounce, data);
          break;
        case "update-cursor-js":
          state.rooms[this.roomId].cursors.js = {
            ...state.rooms[this.roomId].cursors.js,
            [this.user.id]: {
              ...data.value,
              color: this.user.color,
              user: this.user.id,
            },
          };
          announce(usersToAnnounce, {
            type: "update-cursors",
            value: state.rooms[this.roomId].cursors,
          });
          break;
        case "update-cursor-css":
          state.rooms[this.roomId].cursors.css = {
            ...state.rooms[this.roomId].cursors.css,
            [this.user.id]: {
              ...data.value,
              color: this.user.color,
              user: this.user.id,
            },
          };
          announce(usersToAnnounce, {
            type: "update-cursors",
            value: state.rooms[this.roomId].cursors,
          });
          break;
        case "update-cursor-html":
          state.rooms[this.roomId].cursors.html = {
            ...state.rooms[this.roomId].cursors.html,
            [this.user.id]: {
              ...data.value,
              color: this.user.color,
              user: this.user.id,
            },
          };
          announce(usersToAnnounce, {
            type: "update-cursors",
            value: state.rooms[this.roomId].cursors,
          });
          break;
        case "update-range-js":
          state.rooms[this.roomId].ranges.js = {
            ...state.rooms[this.roomId].ranges.js,
            [this.user.id]: {
              ...data.value,
              color: this.user.color,
              user: this.user.id,
            },
          };
          announce(usersToAnnounce, {
            type: "update-ranges",
            value: state.rooms[this.roomId].ranges,
          });
          break;
        case "update-range-css":
          state.rooms[this.roomId].ranges.css = {
            ...state.rooms[this.roomId].ranges.css,
            [this.user.id]: {
              ...data.value,
              color: this.user.color,
              user: this.user.id,
            },
          };
          announce(usersToAnnounce, {
            type: "update-ranges",
            value: state.rooms[this.roomId].ranges,
          });
          break;
        case "update-range-html":
          state.rooms[this.roomId].ranges.html = {
            ...state.rooms[this.roomId].ranges.html,
            [this.user.id]: {
              ...data.value,
              color: this.user.color,
              user: this.user.id,
            },
          };
          announce(usersToAnnounce, {
            type: "update-ranges",
            value: state.rooms[this.roomId].ranges,
          });
          break;
      }
    }.bind(connection)
  );

  connection.on(
    "close",
    function close() {
      const usersToAnnounce = getOtherUsers(this.roomId, this.user.id);
      announce(usersToAnnounce, {
        type: "user-left-room",
        user: this.user,
      });
      state.rooms[this.roomId].colors.push(this.user.color);
      state.rooms[this.roomId].users = state.rooms[this.roomId].users.filter(
        (user) => user.id !== this.user.id
      );
      delete state.rooms[this.roomId].cursors.js[this.user.id];
      delete state.rooms[this.roomId].cursors.css[this.user.id];
      delete state.rooms[this.roomId].cursors.html[this.user.id];
      delete state.rooms[this.roomId].ranges.js[this.user.id];
      delete state.rooms[this.roomId].ranges.css[this.user.id];
      delete state.rooms[this.roomId].ranges.html[this.user.id];
      announce(usersToAnnounce, {
        type: "update-cursors",
        value: state.rooms[this.roomId].cursors,
      });
      announce(usersToAnnounce, {
        type: "update-ranges",
        value: state.rooms[this.roomId].ranges,
      });
      !state.rooms[this.roomId].users.length && delete state.rooms[this.roomId];
      delete state.connections[this.user.id];
    }.bind(connection)
  );

  send(connection, {
    type: "init",
    room: state.rooms[roomId],
    user: connection.user,
  });

  const usersToAnnounce = getOtherUsers(connection.roomId, connection.user.id);
  announce(usersToAnnounce, {
    type: "user-joined-room",
    user: connection.user,
  });
});

function init(connection, name, roomId) {
  if (!state.rooms[roomId]) {
    const room = getNewRoom(roomId);

    const user = getNewUser(name, room.colors.shift());

    connection.user = user;
    connection.roomId = roomId;
    state.connections[user.id] = connection;

    room.users.push(user);

    state.rooms[roomId] = room;
  } else {
    const room = state.rooms[roomId];

    const user = getNewUser(name, room.colors.shift());

    room.users.push(user);

    connection.user = user;
    connection.roomId = roomId;
    state.connections[user.id] = connection;
  }
}

function getNewUser(name, color) {
  return {
    id: uuidv4(),
    name,
    color,
  };
}

function getNewRoom(roomId) {
  return {
    id: roomId,
    users: [],
    colors: ["#CD5C5C", "#FFD700", "#87CEFA", "#3CB371"],
    editors: {
      js: {
        value: null,
      },
      css: {
        value: null,
      },
      html: {
        value: null,
      },
    },
    cursors: {
      js: {},
      css: {},
      html: {},
    },
    ranges: {
      js: {},
      css: {},
      html: {},
    },
  };
}

function getOtherUsers(roomId, userId) {
  return state.rooms[roomId].users.filter((user) => user.id !== userId);
}

function send(connection, payload) {
  connection.send(JSON.stringify(payload));
}

function announce(users, payload) {
  users.forEach((user) => send(state.connections[user.id], payload));
}
