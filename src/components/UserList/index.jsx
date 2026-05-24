import React from "react";
import {
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

import "./styles.css";
import models from "../../modelData/models";

/**
 * Define UserList, a React component of Project 4.
 */
function UserList () {
    const users = models.userListModel();
    return (
      <div className="user-list">
        <Typography className="user-list-title" variant="h6">
          Users
        </Typography>
        <List component="nav" aria-label="user list">
          {users.map((item) => (
            <React.Fragment key={item._id}>
              <ListItemButton component={Link} to={`/users/${item._id}`}>
                <ListItemText
                  primary={`${item.first_name} ${item.last_name}`}
                  secondary={item.occupation}
                />
              </ListItemButton>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </div>
    );
}

export default UserList;
