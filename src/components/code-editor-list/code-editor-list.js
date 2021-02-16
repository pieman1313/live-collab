import React, { useContext } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Tooltip from "@material-ui/core/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faJsSquare } from "@fortawesome/free-brands-svg-icons";
import { faCss3 } from "@fortawesome/free-brands-svg-icons";
import { faHtml5 } from "@fortawesome/free-brands-svg-icons";
import { Badge } from "@material-ui/core";
import { AppContext } from "../../context/app-context";

const useStyles = makeStyles((theme) => ({
  js: {
    color: "#f0db4f",
  },
  css: {
    color: "#2965f1",
  },
  html: {
    color: "#e34c26",
  },
  htmlIcon: {
    position: "relative",
    left: "2px",
  },
}));

export default function CodeEditorList(props) {
  const classes = useStyles();

  const { jsNotification, cssNotification, htmlNotification } = useContext(
    AppContext
  );

  const {
    isJsEditorOpen,
    isCssEditorOpen,
    isHtmlEditorOpen,
    toggleJsEditor,
    toggleCssEditor,
    toggleHtmlEditor,
  } = props;

  return (
    <List>
      <ListItem button onClick={toggleJsEditor}>
        <Tooltip title="JavaScript editor">
          <ListItemIcon>
            <FontAwesomeIcon
              icon={faJsSquare}
              size="2x"
              className={clsx({
                [classes.js]: isJsEditorOpen,
              })}
            />
            <Badge
              color="secondary"
              variant="dot"
              invisible={!jsNotification}
            ></Badge>
          </ListItemIcon>
        </Tooltip>
        <ListItemText primary="JavaScript editor" />
      </ListItem>
      <ListItem button onClick={toggleHtmlEditor}>
        <Tooltip title="HTML editor">
          <ListItemIcon>
            <FontAwesomeIcon
              icon={faHtml5}
              size="2x"
              className={clsx({
                [classes.htmlIcon]: true,
                [classes.html]: isHtmlEditorOpen,
              })}
            />
            <Badge
              color="secondary"
              variant="dot"
              invisible={!htmlNotification}
            ></Badge>
          </ListItemIcon>
        </Tooltip>
        <ListItemText primary="HTML editor" />
      </ListItem>
      <ListItem button onClick={toggleCssEditor}>
        <Tooltip title="CSS editor">
          <ListItemIcon>
            <FontAwesomeIcon
              icon={faCss3}
              size="2x"
              className={clsx({
                [classes.css]: isCssEditorOpen,
              })}
            />
            <Badge
              color="secondary"
              variant="dot"
              invisible={!cssNotification}
            ></Badge>
          </ListItemIcon>
        </Tooltip>
        <ListItemText primary="CSS editor" />
      </ListItem>
    </List>
  );
}
