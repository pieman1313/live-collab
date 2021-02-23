import React, { useContext, useEffect, useState } from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { AppContext } from "../../context/app-context";
import { validate as isValidUuid } from "uuid";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  CircularProgress,
  Container,
  Typography,
} from "@material-ui/core";
import { Redirect, useParams } from "react-router-dom";

import Editor from "../../components/editor/editor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCss3,
  faHtml5,
  faJsSquare,
} from "@fortawesome/free-brands-svg-icons";

const useStyles = makeStyles((theme) => ({
  room: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  editors: {
    width: "100%",
    height: "100%",
    display: "grid",
    columnGap: theme.spacing(2),
    overflow: "hidden",
    [theme.breakpoints.down("sm")]: {
      display: "block",
      height: "auto",
      overflow: "auto",
    },
    padding: theme.spacing(2),
    paddingTop: 0,
    paddingBottom: theme.spacing(4),
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
    height: "100%",
    overflow: "hidden",
    flexGrow: 1,
    [theme.breakpoints.down("sm")]: {
      height: "calc(100vh - 216px)",
      marginBottom: theme.spacing(2),
    },
  },
  spinner: {
    margin: "0 auto",
    position: "relative",
    top: "calc(50% - 40px)",
  },
  uhoh: {
    textAlign: "center",
  },
  uhohcontainer: {
    marginTop: theme.spacing(8),
  },
  iframe: {
    width: "100%",
    height: "300px",
    maxHeight: "30vh",
  },
  jsAvatar: {
    backgroundColor: "#f0db4f",
    position: "relative",
    top: "23px",
    left: "10px",
  },
  cssAvatar: {
    backgroundColor: "#2965f1",
    position: "relative",
    top: "23px",
    left: "10px",
  },
  htmlAvatar: {
    backgroundColor: "#e34c26",
    position: "relative",
    top: "23px",
    left: "10px",
  },
  editorContainer: {
    position: "relative",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  accordion: {
    backgroundColor: "#00887C",
    color: "white",
    height: "64px",
  },
  expand: {
    color: "white",
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
    setJsOpen,
    setCssOpen,
    setHtmlOpen,
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
    previewOpen,
    setPreviewOpen,
    previewRefreshToken,
    setPreviewRefreshForcer,
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
    previewOpen && setPreviewRefreshForcer(Math.random());
  };

  const setHtmlValue = (value) => {
    setHtmlEditorValue(value);
    ws.send(
      JSON.stringify({
        type: "update-html",
        value,
      })
    );
    previewOpen && setPreviewRefreshForcer(Math.random());
  };

  const setCssValue = (value) => {
    setCssEditorValue(value);
    ws.send(
      JSON.stringify({
        type: "update-css",
        value,
      })
    );
    previewOpen && setPreviewRefreshForcer(Math.random());
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

  const closeJs = () => {
    setJsOpen(false);
  };

  const closeCss = () => {
    setCssOpen(false);
  };

  const closeHtml = () => {
    setHtmlOpen(false);
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
      <>
        <div
          className={clsx({
            [classes.editors]: true,
            [classes.single]: openEditorsNumber() === 1,
            [classes.double]: openEditorsNumber() === 2,
            [classes.tripple]: openEditorsNumber() === 3,
          })}
        >
          {jsOpen && (
            <div className={classes.editorContainer}>
              <Avatar className={classes.jsAvatar}>
                <FontAwesomeIcon icon={faJsSquare} size="lg" />
              </Avatar>
              <div className={classes.editor}>
                <Editor
                  mode="javascript"
                  value={jsEditorValue}
                  setValue={setJsValue}
                  setCursor={setJsCursor}
                  cursors={cursors.js}
                  ranges={ranges.js}
                  changeRange={changeJsRange}
                  onClose={closeJs}
                ></Editor>
              </div>
            </div>
          )}
          {htmlOpen && (
            <div className={classes.editorContainer}>
              <Avatar className={classes.htmlAvatar}>
                <FontAwesomeIcon icon={faHtml5} size="lg" />
              </Avatar>
              <div className={classes.editor}>
                <Editor
                  mode="htmlmixed"
                  value={htmlEditorValue}
                  setValue={setHtmlValue}
                  setCursor={setHtmlCursor}
                  cursors={cursors.html}
                  ranges={ranges.html}
                  changeRange={changeHtmlRange}
                  onClose={closeHtml}
                ></Editor>
              </div>
            </div>
          )}
          {cssOpen && (
            <div className={classes.editorContainer}>
              <Avatar className={classes.cssAvatar}>
                <FontAwesomeIcon icon={faCss3} size="lg" />
              </Avatar>
              <div className={classes.editor}>
                <Editor
                  mode="css"
                  value={cssEditorValue}
                  setValue={setCssValue}
                  setCursor={setCssCursor}
                  cursors={cursors.css}
                  ranges={ranges.css}
                  changeRange={changeCssRange}
                  onClose={closeCss}
                ></Editor>
              </div>
            </div>
          )}
        </div>
        {(jsOpen || cssOpen || htmlOpen) && (
          <Accordion
            expanded={previewOpen}
            onChange={() => {
              setPreviewOpen(!previewOpen);
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon className={classes.expand} />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              className={classes.accordion}
            >
              <Typography className={classes.heading}>Preview</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {previewOpen && (
                <iframe
                  className={classes.iframe}
                  src={
                    process.env.NODE_ENV === "production"
                      ? `/preview/room/${roomId}/?${previewRefreshToken}`
                      : `http://localhost/preview/room/${roomId}/?${previewRefreshToken}`
                  }
                  title="preview"
                ></iframe>
              )}
            </AccordionDetails>
          </Accordion>
        )}
      </>
    );
  } else {
    ret = <CircularProgress className={classes.spinner} />;
  }

  return <div className={classes.room}>{ret}</div>;
}
