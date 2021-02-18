import React, { createContext, useState } from "react";

export const AppContext = createContext({});

export const AppProvider = (props) => {
  const { children } = props;

  const [name, setName] = useState("");

  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  const [room, setRoom] = useState(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [jsOpen, setJsOpen] = useState(false);
  const [cssOpen, setCssOpen] = useState(false);
  const [htmlOpen, setHtmlOpen] = useState(false);

  const [jsNotification, setJsNotification] = useState(false);
  const [cssNotification, setCssNotification] = useState(false);
  const [htmlNotification, setHtmlNotification] = useState(false);

  const [jsEditorValue, setJsEditorValue] = useState(null);
  const [cssEditorValue, setCssEditorValue] = useState(null);
  const [htmlEditorValue, setHtmlEditorValue] = useState(null);

  const [roomFull, setRoomFull] = useState(false);

  const [cursors, setCursors] = useState({});

  const [ranges, setRanges] = useState({});

  const [ws, setWs] = useState(null);

  const openWsConnection = (name, room) => {
    const HOST =
      process.env.NODE_ENV === "production"
        ? window.location.origin.replace(/^http/, "ws")
        : "ws://localhost/";

    const ws = new WebSocket(`${HOST}?name=${name}&room=${room}`);

    ws.onclose = () => {
      setRoomFull(true);
    };

    setWs(ws);
    return ws;
  };

  const reset = () => {
    setRoom(null);
    setUser(null);
    setUsers([]);
    setDrawerOpen(false);
    setJsOpen(false);
    setCssOpen(false);
    setHtmlOpen(false);
    setJsEditorValue(null);
    setCssEditorValue(null);
    setHtmlEditorValue(null);
    setHtmlNotification(false);
    setCssNotification(false);
    setJsNotification(false);
    setCursors({});
    setRanges({});
    setWs(null);
    setRoomFull(false);
  };

  const appContext = {
    room,
    setRoom,
    drawerOpen,
    setDrawerOpen,
    jsOpen,
    setJsOpen,
    cssOpen,
    setCssOpen,
    htmlOpen,
    setHtmlOpen,
    users,
    setUsers,
    name,
    setName,
    reset,
    jsEditorValue,
    setJsEditorValue,
    cssEditorValue,
    setCssEditorValue,
    htmlEditorValue,
    setHtmlEditorValue,
    openWsConnection,
    jsNotification,
    setJsNotification,
    cssNotification,
    setCssNotification,
    htmlNotification,
    setHtmlNotification,
    cursors,
    setCursors,
    ranges,
    setRanges,
    ws,
    setWs,
    user,
    setUser,
    roomFull,
    setRoomFull,
  };

  return (
    <AppContext.Provider value={appContext}>{children}</AppContext.Provider>
  );
};

export const AppConsumer = AppContext.Consumer;
