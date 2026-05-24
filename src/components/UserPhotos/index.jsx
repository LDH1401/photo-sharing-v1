import React, { useEffect, useState } from "react";
import { Button, Link as MuiLink, Typography } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

import kenobi1 from "../../images/kenobi1.jpg";
import kenobi2 from "../../images/kenobi2.jpg";
import kenobi3 from "../../images/kenobi3.jpg";
import kenobi4 from "../../images/kenobi4.jpg";
import ludgate1 from "../../images/ludgate1.jpg";
import malcolm1 from "../../images/malcolm1.jpg";
import malcolm2 from "../../images/malcolm2.jpg";
import ouster from "../../images/ouster.jpg";
import ripley1 from "../../images/ripley1.jpg";
import ripley2 from "../../images/ripley2.jpg";
import took1 from "../../images/took1.jpg";
import took2 from "../../images/took2.jpg";

const photoImages = {
    "kenobi1.jpg": kenobi1,
    "kenobi2.jpg": kenobi2,
    "kenobi3.jpg": kenobi3,
    "kenobi4.jpg": kenobi4,
    "ludgate1.jpg": ludgate1,
    "malcolm1.jpg": malcolm1,
    "malcolm2.jpg": malcolm2,
    "ouster.jpg": ouster,
    "ripley1.jpg": ripley1,
    "ripley2.jpg": ripley2,
    "took1.jpg": took1,
    "took2.jpg": took2,
};

function formatDateTime(dateTime) {
    const date = new Date(dateTime);

    if (Number.isNaN(date.getTime())) {
        return dateTime;
    }

    return date.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    });
}

/**
 * Define UserPhotos, a React component of Project 4.
 */
function UserPhotos ({ advancedFeatures = false }) {
    const { userId, photoId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignore = false;

        setLoading(true);
        setError("");

        Promise.all([
            fetchModel(`/user/${encodeURIComponent(userId)}`),
            fetchModel(`/photosOfUser/${encodeURIComponent(userId)}`),
        ])
            .then(([userModel, photoModels]) => {
                if (!ignore) {
                    setUser(userModel);
                    setPhotos(photoModels || []);
                    setLoading(false);
                }
            })
            .catch(() => {
                if (!ignore) {
                    setError("Could not load photos.");
                    setLoading(false);
                }
            });

        return () => {
            ignore = true;
        };
    }, [userId]);

    const selectedIndex = photos.findIndex((photo) => photo._id === photoId);
    const currentIndex = selectedIndex >= 0 ? selectedIndex : 0;
    const selectedPhoto = photos[currentIndex];

    useEffect(() => {
        if (!advancedFeatures || loading || photos.length === 0) {
            return;
        }

        const hasPhotoId = photos.some((photo) => photo._id === photoId);

        if (!hasPhotoId) {
            navigate(`/photos/${userId}/${photos[0]._id}`, { replace: true });
        }
    }, [advancedFeatures, loading, navigate, photoId, photos, userId]);

    const goToPhoto = (photoIndex) => {
        navigate(`/photos/${userId}/${photos[photoIndex]._id}`);
    };

    const renderPhoto = (photo) => (
        <div className="photo-entry" key={photo._id}>
            <Typography color="text.secondary" variant="body2">
                {formatDateTime(photo.date_time)}
            </Typography>

            <img
                alt={`${user.first_name} ${user.last_name}`}
                className="photo-image"
                src={photoImages[photo.file_name]}
            />

            <div className="comments">
                <Typography variant="h6">Comments</Typography>

                {photo.comments && photo.comments.length > 0 ? (
                    photo.comments.map((comment) => (
                        <div className="comment" key={comment._id}>
                            <Typography color="text.secondary" variant="body2">
                                <MuiLink
                                    component={Link}
                                    to={`/users/${comment.user._id}`}
                                    underline="hover"
                                >
                                    {comment.user.first_name} {comment.user.last_name}
                                </MuiLink>
                                {" on "}
                                {formatDateTime(comment.date_time)}
                            </Typography>
                            <Typography variant="body1">{comment.comment}</Typography>
                        </div>
                    ))
                ) : (
                    <Typography color="text.secondary" variant="body2">
                        No comments yet.
                    </Typography>
                )}
            </div>
        </div>
    );

    if (loading) {
        return (
            <Typography color="text.secondary" variant="body1">
                Loading photos...
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
      <div className="user-photos">
        <div className="user-photos-header">
          <div>
            <Typography variant="h4">
              {user.first_name} {user.last_name}'s Photos
            </Typography>
            <Typography color="text.secondary" variant="subtitle1">
              {photos.length} photo{photos.length === 1 ? "" : "s"}
            </Typography>
          </div>

          <Button component={Link} to={`/users/${user._id}`} variant="outlined">
            Back to profile
          </Button>
        </div>

        {photos.length === 0 ? (
          <Typography variant="body1">No photos available.</Typography>
        ) : advancedFeatures ? (
          <div className="photo-stepper">
            <div className="photo-stepper-controls">
              <Button
                disabled={currentIndex === 0}
                onClick={() => goToPhoto(currentIndex - 1)}
                variant="outlined"
              >
                Previous
              </Button>
              <Typography variant="body1">
                Photo {currentIndex + 1} of {photos.length}
              </Typography>
              <Button
                disabled={currentIndex === photos.length - 1}
                onClick={() => goToPhoto(currentIndex + 1)}
                variant="outlined"
              >
                Next
              </Button>
            </div>
            {renderPhoto(selectedPhoto)}
          </div>
        ) : (
          photos.map((photo) => renderPhoto(photo))
        )}
      </div>
    );
}

export default UserPhotos;
