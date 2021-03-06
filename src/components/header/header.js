import React from "react";
import clsx from "clsx";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { makeStyles } from "@material-ui/core/styles";
import { DRAWER_WIDTH } from "../../constants/constants";
import { useSnackbar } from "notistack";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Tooltip } from "@material-ui/core";
import { Link } from "react-router-dom";
import Design from "../design/design";
import GitHubIcon from "@material-ui/icons/GitHub";

const useStyles = makeStyles((theme) => ({
  appBar: {
    overflow: "hidden",
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: DRAWER_WIDTH,
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  heading: {
    marginLeft: "auto",
    cursor: "pointer",
  },
  link: {
    color: "white",
    textDecoration: "none",
    cursor: "pointer",
  },
  h6: {
    paddingRight: theme.spacing(2),
  },
  git: {
    marginLeft: "auto",
  },
  gitRoom: {
    marginLeft: theme.spacing(2),
  },
}));

export default function Header(props) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const { handleDrawerOpen, drawerOpen, room } = props;

  return (
    <AppBar
      position="fixed"
      className={clsx(classes.appBar, {
        [classes.appBarShift]: drawerOpen,
      })}
    >
      <Toolbar>
        {room && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: drawerOpen,
            })}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Design></Design>
        <Link to="/" className={classes.link}>
          <Typography variant="h6" noWrap className={classes.h6}>
            live-collab
          </Typography>
        </Link>
        {room && (
          <CopyToClipboard
            text={window.location.origin + "/join/" + room.id}
            onCopy={() =>
              enqueueSnackbar("Copied!", {
                autoHideDuration: 1000,
              })
            }
          >
            <Tooltip title="Copy to clipboard">
              <Typography variant="h6" noWrap className={classes.heading}>
                {room.id}
              </Typography>
            </Tooltip>
          </CopyToClipboard>
        )}
        <Tooltip title="Github repo">
          <IconButton
            color="inherit"
            aria-label="github repo link"
            edge="end"
            component="a"
            href="https://github.com/pieman1313/live-collab"
            className={room ? classes.gitRoom : classes.git}
          >
            <GitHubIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
