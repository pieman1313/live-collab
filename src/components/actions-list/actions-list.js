import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Tooltip from "@material-ui/core/Tooltip";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

export default function ActionsList(props) {
  const { onLeaveRoom } = props;

  return (
    <List>
      <ListItem button onClick={onLeaveRoom}>
        <Tooltip title="Leave room">
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
        </Tooltip>
        <ListItemText primary="Leave room" />
      </ListItem>
    </List>
  );
}
