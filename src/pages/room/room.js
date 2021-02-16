import React, { useContext, useEffect, useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { AppContext } from "../../context/app-context";
import { validate as isValidUuid } from "uuid";
import { CircularProgress, Container, Typography } from "@material-ui/core";
import { Redirect, useParams } from "react-router-dom";

import Editor from "../../components/editor/editor";

const useStyles = makeStyles((theme) => ({
  room: {
    width: "100%",
    height: "100%",
    display: "flex",
  },
  editors: {
    width: "100%",
    height: "100%",
    display: "grid",
    columnGap: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      display: "block",
    },
  },
  single: {
    gridTemplateColumns: "1fr",
  },
  double: {
    gridTemplateColumns: "1fr 1fr",
  },
  tripple: {
    gridTemplateColumns: "1fr 1fr 1fr",
  },
  editor: {
    overflow: "hidden",
    [theme.breakpoints.down("sm")]: {
      height: "80vh",
      marginBottom: theme.spacing(2),
    },
  },
  spinner: {
    margin: "0 auto",
    alignSelf: "center",
  },
  uhoh: {
    textAlign: "center",
  },
  uhohcontainer: {
    marginTop: theme.spacing(8),
  },
}));

export default function Room() {
  const classes = useStyles();

  let { roomId } = useParams();

  const [validUuid] = useState(isValidUuid(roomId));

  const {
    name,
    room,
    jsOpen,
    cssOpen,
    htmlOpen,
    jsEditorValue,
    setJsEditorValue,
    cssEditorValue,
    setCssEditorValue,
    htmlEditorValue,
    setHtmlEditorValue,
    openWsConnection,
    reset,
    ws,
    cursors,
    ranges,
    roomFull,
    setRoomFull,
  } = useContext(AppContext);

  const openEditorsNumber = () => jsOpen + cssOpen + htmlOpen;

  useEffect(() => {
    let ws;
    if (name && validUuid) {
      setRoomFull(false);
      ws = openWsConnection(name, roomId);
    }
    return () => {
      ws && ws.close();
      reset();
    };
  }, []);

  const setJsValue = (value) => {
    setJsEditorValue(value);
    ws.send(
      JSON.stringify({
        type: "update-js",
        value,
      })
    );
  };

  const setHtmlValue = (value) => {
    setHtmlEditorValue(value);
    ws.send(
      JSON.stringify({
        type: "update-html",
        value,
      })
    );
  };

  const setCssValue = (value) => {
    setCssEditorValue(value);
    ws.send(
      JSON.stringify({
        type: "update-css",
        value,
      })
    );
  };

  const setJsCursor = (value) => {
    ws.send(
      JSON.stringify({
        type: "update-cursor-js",
        value,
      })
    );
  };

  const setHtmlCursor = (value) => {
    ws.send(
      JSON.stringify({
        type: "update-cursor-html",
        value,
      })
    );
  };

  const setCssCursor = (value) => {
    ws.send(
      JSON.stringify({
        type: "update-cursor-css",
        value,
      })
    );
  };

  const changeJsRange = (value) => {
    ws.send(
      JSON.stringify({
        type: "update-range-js",
        value,
      })
    );
  };

  const changeHtmlRange = (value) => {
    ws.send(
      JSON.stringify({
        type: "update-range-html",
        value,
      })
    );
  };

  const changeCssRange = (value) => {
    ws.send(
      JSON.stringify({
        type: "update-range-css",
        value,
      })
    );
  };

  let ret;

  if (!name) {
    ret = <Redirect to={`/join/${roomId}`}></Redirect>;
  } else if (!validUuid) {
    ret = <div>Invalid UUID</div>;
  } else if (roomFull) {
    ret = (
      <Container maxWidth="xs" className={classes.uhohcontainer}>
        <Typography variant="h5" className={classes.uhoh}>
          Whoops!
        </Typography>
        <Typography variant="h5" className={classes.uhoh}>
          Room full :(
        </Typography>
      </Container>
    );
  } else if (room) {
    ret = (
      <div
        className={clsx({
          [classes.editors]: true,
          [classes.single]: openEditorsNumber() === 1,
          [classes.double]: openEditorsNumber() === 2,
          [classes.tripple]: openEditorsNumber() === 3,
        })}
      >
        {jsOpen && (
          <div className={classes.editor}>
            <Editor
              title="JavaScript"
              mode="javascript"
              value={jsEditorValue}
              setValue={setJsValue}
              setCursor={setJsCursor}
              cursors={cursors.js}
              ranges={ranges.js}
              changeRange={changeJsRange}
            ></Editor>
          </div>
        )}
        {htmlOpen && (
          <div className={classes.editor}>
            <Editor
              autoCursor="true"
              title="HTML"
              mode="htmlmixed"
              value={htmlEditorValue}
              setValue={setHtmlValue}
              setCursor={setHtmlCursor}
              cursors={cursors.html}
              ranges={ranges.html}
              changeRange={changeHtmlRange}
            ></Editor>
          </div>
        )}
        {cssOpen && (
          <div className={classes.editor}>
            <Editor
              autoCursor="true"
              title="CSS"
              mode="css"
              value={cssEditorValue}
              setValue={setCssValue}
              setCursor={setCssCursor}
              cursors={cursors.css}
              ranges={ranges.css}
              changeRange={changeCssRange}
            ></Editor>
          </div>
        )}
      </div>
    );
  } else {
    ret = <CircularProgress className={classes.spinner} />;
  }

  return <div className={classes.room}>{ret}</div>;
}
