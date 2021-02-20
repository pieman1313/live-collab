import "fontsource-roboto";
import "./App.css";

import React, { useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import Header from "./components/header/header";
import Drawer from "./components/drawer/drawer";
import CodeEditorList from "./components/code-editor-list/code-editor-list";
import ConnectedUserList from "./components/connected-user-list/connected-user-list";
import ActionsList from "./components/actions-list/actions-list";
import { AppContext } from "./context/app-context";
import Home from "./pages/home/home";
import Room from "./pages/room/room";
import Join from "./pages/join/join";
import { useSnackbar } from "notistack";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    width: "100vw",
    height: "100vh",
    backgroundColor: "#DBF5F0",
    overflow: "auto",
  },
  content: {
    flexGrow: 1,
    marginTop: theme.spacing(8),
    position: "relative",
  },
  autoMarginTop: {
    marginTop: "auto",
  },
}));

export default function App() {
  const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar();

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: "#0C6170",
      },
    },
  });

  const history = useHistory();

  const {
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
    reset,
    setJsEditorValue,
    setCssEditorValue,
    setHtmlEditorValue,
    setJsNotification,
    setCssNotification,
    setHtmlNotification,
    setUser,
    setCursors,
    setRanges,
    ws,
    setPreviewRefreshForcer,
    previewOpen,
    setRoomFull,
  } = useContext(AppContext);

  useEffect(() => {
    if (ws) {
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "init":
            setUser(data.user);
            setRoom({ id: data.room.id });
            const roomUsers = data.room.users;
            setUsers(roomUsers);
            setJsEditorValue(data.room.editors.js.value);
            setCssEditorValue(data.room.editors.css.value);
            setHtmlEditorValue(data.room.editors.html.value);
            break;
          case "update-js":
            !jsOpen && setJsNotification(true);
            setJsEditorValue(data.value);
            previewOpen && setPreviewRefreshForcer(Math.random());
            break;
          case "update-css":
            !cssOpen && setCssNotification(true);
            setCssEditorValue(data.value);
            previewOpen && setPreviewRefreshForcer(Math.random());
            break;
          case "update-html":
            !htmlOpen && setHtmlNotification(true);
            setHtmlEditorValue(data.value);
            previewOpen && setPreviewRefreshForcer(Math.random());
            break;
          case "update-cursors":
            setCursors(data.value);
            break;
          case "update-ranges":
            setRanges(data.value);
            break;
          case "user-left-room":
            enqueueSnackbar(`User ${data.user.name} left!`, {
              autoHideDuration: 2000,
            });
            setUsers([...users.filter((user) => user.id !== data.user.id)]);
            break;
          case "user-joined-room":
            setUsers([...users, data.user]);
            enqueueSnackbar(`User ${data.user.name} joined!`, {
              autoHideDuration: 2000,
            });
            break;
          default:
            break;
        }
      };
      ws.onclose = (event) => {
        switch (event.code) {
          case 1005:
            reset();
            history.push("/");
            break;
          case 1006:
            reset();
            enqueueSnackbar(`An error occured.`, {
              autoHideDuration: 2000,
            });
            history.push("/");
            break;
          case 4000:
            setRoomFull(true);
            break;
          default:
            break;
        }
      };
    }
    //TODO VERIFY CALLS
  }, [ws, jsOpen, cssOpen, htmlOpen, users, previewOpen]);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const toggleJsEditor = () => {
    !jsOpen && setJsNotification(false);
    setJsOpen(!jsOpen);
  };

  const toggleCssEditor = () => {
    !cssOpen && setCssNotification(false);
    setCssOpen(!cssOpen);
  };

  const toggleHtmlEditor = () => {
    !htmlOpen && setHtmlNotification(false);
    setHtmlOpen(!htmlOpen);
  };

  const onLeaveRoom = () => {
    ws && ws.close();
    reset();
    history.push("/");
  };

  return (
    <MuiThemeProvider theme={theme}>
      <div className={classes.root}>
        <CssBaseline />
        <Header
          room={room}
          handleDrawerOpen={handleDrawerOpen}
          drawerOpen={drawerOpen}
        ></Header>
        {room && (
          <Drawer handleDrawerClose={handleDrawerClose} drawerOpen={drawerOpen}>
            <CodeEditorList
              isJsEditorOpen={jsOpen}
              isCssEditorOpen={cssOpen}
              isHtmlEditorOpen={htmlOpen}
              toggleJsEditor={toggleJsEditor}
              toggleCssEditor={toggleCssEditor}
              toggleHtmlEditor={toggleHtmlEditor}
            ></CodeEditorList>
            <Divider />
            <Divider className={classes.autoMarginTop} />
            <ConnectedUserList users={users}></ConnectedUserList>
            <Divider />
            <ActionsList onLeaveRoom={onLeaveRoom}></ActionsList>
          </Drawer>
        )}
        <main className={classes.content}>
          <Switch>
            <Route path="/join/:joinRoomId">
              <Join></Join>
            </Route>
            <Route path="/room/:roomId">
              <Room></Room>
            </Route>
            <Route path="/" exact>
              <Home></Home>
            </Route>
            <Route path="**">
              <Redirect to="/"></Redirect>
            </Route>
          </Switch>
        </main>
      </div>
    </MuiThemeProvider>
  );
}
