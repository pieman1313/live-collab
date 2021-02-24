import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  pillContainer: {
    position: "absolute",
    left: "0px",
    zIndex: -1,
    display: "block",
    width: "100%",
    height: "100%",
  },
  pill: {
    display: "block",
    transform: "rotate(-45deg)",
    backgroundColor: "#37BEB0",
    width: "200px",
    height: "40px",
    borderRadius: "50px",
    position: "absolute",
    "&:nth-of-type(1)": {
      left: "-52px",
      top: "64px",
    },
    "&:nth-of-type(2)": {
      left: "0px",
      top: "45px",
    },
    "&:nth-of-type(3)": {
      left: "116px",
      top: "-40px",
    },
    "&:nth-of-type(4)": {
      left: "calc(50% - 175px)",
      top: "67px",
      width: "200px",
      height: "80px",
    },
    "&:nth-of-type(5)": {
      left: "calc(100% - 270px)",
      top: "-35px",
      width: "200px",
      height: "80px",
    },
    "&:nth-of-type(6)": {
      left: "calc(100% - 200px)",
      top: "-62px",
      width: "200px",
      height: "80px",
    },
  },
}));

export default function Design(props) {
  const classes = useStyles();

  return (
    <div className={classes.pillContainer}>
      <div className={classes.pill}></div>
      <div className={classes.pill}></div>
      <div className={classes.pill}></div>
      <div className={classes.pill}></div>
      <div className={classes.pill}></div>
      <div className={classes.pill}></div>
    </div>
  );
}
