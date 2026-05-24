import React, { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

/**
 * Define UserDetail, a React component of Project 4.
 */
function UserDetail() {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignore = false;

        setLoading(true);
        setError("");

        fetchModel(`/user/${encodeURIComponent(userId)}`)
            .then((userModel) => {
                if (!ignore) {
                    setUser(userModel);
                    setLoading(false);
                }
            })
            .catch(() => {
                if (!ignore) {
                    setError("Could not load user details.");
                    setLoading(false);
                }
            });

        return () => {
            ignore = true;
        };
    }, [userId]);

    if (loading) {
        return (
            <Typography color="text.secondary" variant="body1">
                Loading user details...
            </Typography>
        );
    }

    if (error) {
        return (
            <Typography color="error" variant="body1">
                {error}
            </Typography>
        );
    }

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
