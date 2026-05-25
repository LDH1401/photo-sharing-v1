import './App.css';

import React, { useEffect, useState } from "react";
import { Grid, Paper, Typography } from "@mui/material";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";

import LoginRegister from "./components/LoginRegister";
import TopBar from "./components/TopBar";
import UserComments from "./components/UserComments";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import fetchModel from "./lib/fetchModelData";

const App = () => {
  const [advancedFeatures, setAdvancedFeatures] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [photoRefreshKey, setPhotoRefreshKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    fetchModel("/admin/current")
      .then((user) => {
        if (!ignore) {
          setLoggedInUser(user);
        }
      })
      .catch(() => {
        if (!ignore) {
          setLoggedInUser(null);
        }
      })
      .finally(() => {
        if (!ignore) {
          setAuthChecked(true);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleLogout = () => {
    setLoggedInUser(null);
    setAdvancedFeatures(false);
  };

  const handlePhotoAdded = () => {
    setPhotoRefreshKey((currentKey) => currentKey + 1);
  };

  const defaultRoute = loggedInUser ? `/users/${loggedInUser._id}` : "/login";

  return (
      <Router>
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TopBar
                advancedFeatures={advancedFeatures}
                loggedInUser={loggedInUser}
                onAdvancedFeaturesChange={setAdvancedFeatures}
                onLogout={handleLogout}
                onPhotoAdded={handlePhotoAdded}
              />
            </Grid>
            <div className="main-topbar-buffer" />
            <Grid item sm={3}>
              <Paper className="main-grid-item">
                <UserList loggedInUser={loggedInUser} />
              </Paper>
            </Grid>
            <Grid item sm={9}>
              <Paper className="main-grid-item">
                {!authChecked ? (
                  <Typography color="text.secondary">Checking login...</Typography>
                ) : (
                  <Routes>
                    <Route
                      path="/login"
                      element={
                        loggedInUser ? (
                          <Navigate replace to={`/users/${loggedInUser._id}`} />
                        ) : (
                          <LoginRegister onLogin={setLoggedInUser} />
                        )
                      }
                    />
                    <Route
                        path="/users/:userId"
                        element = {
                          loggedInUser ? <UserDetail /> : <Navigate replace to="/login" />
                        }
                    />
                    <Route
                        path="/photos/:userId"
                        element = {
                          loggedInUser ? (
                            <UserPhotos
                              advancedFeatures={advancedFeatures}
                              photoRefreshKey={photoRefreshKey}
                            />
                          ) : (
                            <Navigate replace to="/login" />
                          )
                        }
                    />
                    <Route
                        path="/photos/:userId/:photoId"
                        element = {
                          loggedInUser ? (
                            <UserPhotos
                              advancedFeatures={advancedFeatures}
                              photoRefreshKey={photoRefreshKey}
                            />
                          ) : (
                            <Navigate replace to="/login" />
                          )
                        }
                    />
                    <Route
                        path="/comments/:userId"
                        element = {
                          loggedInUser ? <UserComments /> : <Navigate replace to="/login" />
                        }
                    />
                    <Route
                      path="/users"
                      element={
                        loggedInUser ? (
                          <UserList loggedInUser={loggedInUser} />
                        ) : (
                          <Navigate replace to="/login" />
                        )
                      }
                    />
                    <Route path="*" element={<Navigate replace to={defaultRoute} />} />
                  </Routes>
                )}
              </Paper>
            </Grid>
          </Grid>
        </div>
      </Router>
  );
}

export default App;
