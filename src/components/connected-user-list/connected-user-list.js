import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Tooltip from "@material-ui/core/Tooltip";
import Avatar from "@material-ui/core/Avatar";

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: "30px",
    height: "30px",
    position: "relative",
    left: "-3px",
  },
}));

export default function ConnectedUserList(props) {
  const classes = useStyles();

  const { users } = props;

  return (
    <List>
      {users.map((user) => (
        <ListItem key={user.id}>
          <Tooltip title={user.name}>
            <ListItemIcon>
              <Avatar
                className={classes.avatar}
                style={{ backgroundColor: user.color }}
              >
                {user.name[0]}
              </Avatar>
            </ListItemIcon>
          </Tooltip>
          <ListItemText primary={user.name} />
        </ListItem>
      ))}
    </List>
  );
}
