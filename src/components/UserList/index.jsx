import React, { useEffect, useState } from "react";
import {
  Box,
  Chip,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

/**
 * Define UserList, a React component of Project 4.
 */
function UserList ({ loggedInUser }) {
    const [users, setUsers] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
      let ignore = false;

      if (!loggedInUser) {
        setUsers(null);
        setError("");
        return () => {
          ignore = true;
        };
      }

      fetchModel("/user/list")
        .then((userList) => {
          if (!ignore) {
            setUsers(userList || []);
          }
        })
        .catch(() => {
          if (!ignore) {
            setError("Could not load users.");
          }
        });

      return () => {
        ignore = true;
      };
    }, [loggedInUser]);

    if (!loggedInUser) {
      return null;
    }

    if (error) {
      return <Typography color="error">{error}</Typography>;
    }

    if (!users) {
      return <Typography color="text.secondary">Loading users...</Typography>;
    }

    return (
      <div className="user-list">
        <Typography className="user-list-title" variant="h6">
          Users
        </Typography>
        <List component="nav" aria-label="user list">
          {users.map((item) => (
            <React.Fragment key={item._id}>
              <Box className="user-list-row">
                <ListItemButton
                  className="user-list-name"
                  component={Link}
                  to={`/users/${item._id}`}
                >
                  <ListItemText primary={`${item.first_name} ${item.last_name}`} />
                </ListItemButton>
                <Box className="user-list-counts">
                  <Chip
                    className="user-list-photo-count"
                    component={Link}
                    label={item.photo_count || 0}
                    size="small"
                    to={`/photos/${item._id}`}
                  />
                  <Chip
                    className="user-list-comment-count"
                    component={Link}
                    label={item.comment_count || 0}
                    size="small"
                    to={`/comments/${item._id}`}
                  />
                </Box>
              </Box>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </div>
    );
}

export default UserList;
