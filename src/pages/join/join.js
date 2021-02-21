import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { useHistory, useParams } from "react-router-dom";
import { validate as isValidUuid } from "uuid";

import { AppContext } from "../../context/app-context";

const useStyles = makeStyles((theme) => ({
  root: {
    overflow: "auto",
    height: "100%",
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: theme.spacing(4),
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
    width: "150px",
    height: "150px",
    marginBottom: theme.spacing(2),
  },
  submit: {
    margin: theme.spacing(2),
    padding: theme.spacing(1),
    fontWeight: "bold",
  },
}));

export default function Join() {
  const classes = useStyles();

  let { joinRoomId } = useParams();

  const [roomId, setRoomId] = useState(joinRoomId);
  const [nameError, setNameError] = useState(false);
  const [roomIdError, setRoomIdError] = useState(false);

  const { name, setName } = useContext(AppContext);

  const history = useHistory();

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleRoomIdChange = (e) => {
    setRoomId(e.target.value);
  };

  const onHost = () => {
    history.push(`/`);
  };

  const onJoin = (e) => {
    e.preventDefault();
    if (name && isValidUuid(roomId)) {
      setNameError(false);
      setRoomIdError(false);

      history.push(`/room/${roomId}`);
    } else {
      if (!name) {
        setNameError(true);
      }
      if (!isValidUuid(roomId)) {
        setRoomIdError(true);
      }
    }
  };

  return (
    <Container className={classes.root}>
      <Container maxWidth="xs">
        <CssBaseline />
        <form onSubmit={onJoin}>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <FontAwesomeIcon icon={faUserFriends} size="4x" />
            </Avatar>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Name"
              onChange={handleNameChange}
              value={name}
              error={nameError}
              helperText={nameError ? "Required" : null}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Room"
              onChange={handleRoomIdChange}
              value={roomId}
              error={roomIdError}
              helperText={roomIdError ? "Valid uuid required" : null}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={!roomId}
            >
              Join
            </Button>
            <Typography variant="h6" noWrap>
              - or -
            </Typography>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={onHost}
            >
              Host
            </Button>
          </div>
        </form>
      </Container>
    </Container>
  );
}
