import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";

import "./styles.css";
import models from "../../modelData/models";

const studentName = "Le Duy Hung";

function getContextText(pathname) {
    const pathParts = pathname.split("/").filter(Boolean);
    const viewName = pathParts[0];
    const userId = pathParts[1];

    if (viewName === "photos" && userId) {
        const user = models.userModel(userId);
        return user ? `Photos of ${user.first_name} ${user.last_name}` : "Photos";
    }

    if (viewName === "users" && userId) {
        const user = models.userModel(userId);
        return user ? `${user.first_name} ${user.last_name}` : "User not found";
    }

    return "Users";
}

/**
 * Define TopBar, a React component of Project 4.
 */
function TopBar () {
    const location = useLocation();
    const contextText = getContextText(location.pathname);

    return (
      <AppBar className="topbar-appBar" position="absolute">
        <Toolbar className="topbar-toolbar">
          <Typography variant="h5" color="inherit">
            {studentName}
          </Typography>
          <Typography className="topbar-context" variant="h6" color="inherit">
            {contextText}
          </Typography>
        </Toolbar>
      </AppBar>
    );
}

export default TopBar;
