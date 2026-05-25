import React, { useEffect, useRef, useState } from "react";
import {
  AppBar,
  Button,
  Checkbox,
  FormControlLabel,
  Toolbar,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

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
function TopBar ({
    advancedFeatures,
    loggedInUser,
    onAdvancedFeaturesChange,
    onLogout,
    onPhotoAdded,
}) {
    const location = useLocation();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [contextText, setContextText] = useState("Users");
    const [uploading, setUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState("");

    useEffect(() => {
        let ignore = false;
        const { viewName, userId } = getRouteContext(location.pathname);

        if (!loggedInUser) {
            setContextText("Please Login");
        } else if (viewName === "photos" && userId) {
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
    }, [location.pathname, loggedInUser]);

    const handleLogout = () => {
        fetchModel("/admin/logout", { method: "POST" })
            .catch(() => null)
            .finally(() => {
                onLogout();
                navigate("/login", { replace: true });
            });
    };

    const handlePhotoUpload = (event) => {
        const [photoFile] = event.target.files;

        if (!photoFile) {
            return;
        }

        const formData = new FormData();
        formData.append("photo", photoFile);
        setUploading(true);
        setUploadMessage("");

        fetchModel("/photos/new", {
            method: "POST",
            body: formData,
        })
            .then((photo) => {
                setUploadMessage("Photo added.");
                onPhotoAdded(photo);
                navigate(`/photos/${photo.user_id}/${photo._id}`);
            })
            .catch((uploadError) => {
                setUploadMessage(uploadError.message || "Photo upload failed.");
            })
            .finally(() => {
                setUploading(false);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            });
    };

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
            {loggedInUser && (
              <>
                <Typography color="inherit" variant="body1">
                  Hi {loggedInUser.first_name}
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
                <Button color="inherit" component="label" disabled={uploading} variant="outlined">
                  {uploading ? "Uploading..." : "Add Photo"}
                  <input
                    accept="image/*"
                    hidden
                    onChange={handlePhotoUpload}
                    ref={fileInputRef}
                    type="file"
                  />
                </Button>
                {uploadMessage && (
                  <Typography className="topbar-upload-message" color="inherit" variant="body2">
                    {uploadMessage}
                  </Typography>
                )}
                <Button color="inherit" onClick={handleLogout} variant="outlined">
                  Logout
                </Button>
              </>
            )}
          </div>
        </Toolbar>
      </AppBar>
    );
}

export default TopBar;
