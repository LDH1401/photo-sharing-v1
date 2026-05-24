import React from "react";
import { Button, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";

import "./styles.css";
import models from "../../modelData/models";

/**
 * Define UserDetail, a React component of Project 4.
 */
function UserDetail() {
    const { userId } = useParams();
    const user = models.userModel(userId);

    if (!user) {
        return (
            <Typography variant="body1">
                User not found.
            </Typography>
        );
    }

    return (
        <div className="user-detail">
            <div>
                <Typography variant="h4">
                    {user.first_name} {user.last_name}
                </Typography>
                <Typography color="text.secondary" variant="subtitle1">
                    {user.occupation}
                </Typography>
            </div>

            <div className="user-detail-fields">
                <div className="user-detail-row">
                    <Typography className="user-detail-label" variant="body2">
                        Location
                    </Typography>
                    <Typography variant="body1">{user.location}</Typography>
                </div>
                <div className="user-detail-row">
                    <Typography className="user-detail-label" variant="body2">
                        Description
                    </Typography>
                    <Typography variant="body1">{user.description}</Typography>
                </div>
            </div>

            <Button
                className="user-detail-button"
                component={Link}
                to={`/photos/${user._id}`}
                variant="contained"
            >
                View photos
            </Button>
        </div>
    );
}

export default UserDetail;
