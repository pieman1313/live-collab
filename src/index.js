import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { AppProvider } from "./context/app-context";
import { SnackbarProvider } from "notistack";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.render(
  <Router>
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
    >
      <AppProvider>
        <App />
      </AppProvider>
    </SnackbarProvider>
  </Router>,
  document.getElementById("root")
);
