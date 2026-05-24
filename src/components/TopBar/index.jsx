import React, { useEffect, useState } from "react";
import {
  AppBar,
  Checkbox,
  FormControlLabel,
  Toolbar,
  Typography,
} from "@mui/material";
import { useLocation } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

const studentName = "Le Duy Hung";

function getRouteContext(pathname) {
    const pathParts = pathname.split("/").filter(Boolean);

    return {
        viewName: pathParts[0],
        userId: pathParts[1],
    };
}

/**
 * Define TopBar, a React component of Project 4.
 */
function TopBar ({ advancedFeatures, onAdvancedFeaturesChange }) {
    const location = useLocation();
    const [contextText, setContextText] = useState("Users");

    useEffect(() => {
        let ignore = false;
        const { viewName, userId } = getRouteContext(location.pathname);

        if (viewName === "photos" && userId) {
            setContextText("Photos");
            fetchModel(`/user/${encodeURIComponent(userId)}`)
                .then((user) => {
                    if (!ignore) {
                        setContextText(
                            user ? `Photos of ${user.first_name} ${user.last_name}` : "Photos"
                        );
                    }
                })
                .catch(() => {
                    if (!ignore) {
                        setContextText("Photos");
                    }
                });
        } else if (viewName === "comments" && userId) {
            setContextText("Comments");
            fetchModel(`/user/${encodeURIComponent(userId)}`)
                .then((user) => {
                    if (!ignore) {
                        setContextText(
                            user ? `Comments by ${user.first_name} ${user.last_name}` : "Comments"
                        );
                    }
                })
                .catch(() => {
                    if (!ignore) {
                        setContextText("Comments");
                    }
                });
        } else if (viewName === "users" && userId) {
            setContextText("User");
            fetchModel(`/user/${encodeURIComponent(userId)}`)
                .then((user) => {
                    if (!ignore) {
                        setContextText(
                            user ? `${user.first_name} ${user.last_name}` : "User not found"
                        );
                    }
                })
                .catch(() => {
                    if (!ignore) {
                        setContextText("User");
                    }
                });
        } else {
            setContextText("Users");
        }

        return () => {
            ignore = true;
        };
    }, [location.pathname]);

    return (
      <AppBar className="topbar-appBar" position="absolute">
        <Toolbar className="topbar-toolbar">
          <Typography variant="h5" color="inherit">
            {studentName}
          </Typography>
          <div className="topbar-right">
            <Typography className="topbar-context" variant="h6" color="inherit">
              {contextText}
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={advancedFeatures}
                  className="topbar-checkbox"
                  onChange={(event) => onAdvancedFeaturesChange(event.target.checked)}
                />
              }
              label="Enable Advanced Features"
            />
          </div>
        </Toolbar>
      </AppBar>
    );
}

export default TopBar;
