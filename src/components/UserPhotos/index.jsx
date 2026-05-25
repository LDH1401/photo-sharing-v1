import React, { useEffect, useState } from "react";
import {
    Alert,
    Button,
    Link as MuiLink,
    TextField,
    Typography,
} from "@mui/material";
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

function getPhotoSrc(fileName) {
    return photoImages[fileName] || `/images/${fileName}`;
}

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
function UserPhotos ({ advancedFeatures = false, photoRefreshKey = 0 }) {
    const { userId, photoId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [commentTexts, setCommentTexts] = useState({});
    const [commentErrors, setCommentErrors] = useState({});
    const [commentSubmitting, setCommentSubmitting] = useState({});

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
    }, [userId, photoRefreshKey]);

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

    const setCommentText = (photo, value) => {
        setCommentTexts((currentTexts) => ({
            ...currentTexts,
            [photo._id]: value,
        }));
    };

    const setPhotoCommentError = (photo, message) => {
        setCommentErrors((currentErrors) => ({
            ...currentErrors,
            [photo._id]: message,
        }));
    };

    const setPhotoCommentSubmitting = (photo, isSubmitting) => {
        setCommentSubmitting((currentSubmitting) => ({
            ...currentSubmitting,
            [photo._id]: isSubmitting,
        }));
    };

    const handleAddComment = (event, photo) => {
        event.preventDefault();

        const commentText = (commentTexts[photo._id] || "").trim();
        if (!commentText) {
            setPhotoCommentError(photo, "Comment must not be empty.");
            return;
        }

        setPhotoCommentSubmitting(photo, true);
        setPhotoCommentError(photo, "");

        fetchModel(`/commentsOfPhoto/${encodeURIComponent(photo._id)}`, {
            method: "POST",
            body: JSON.stringify({ comment: commentText }),
        })
            .then((comment) => {
                setPhotos((currentPhotos) =>
                    currentPhotos.map((currentPhoto) =>
                        currentPhoto._id === photo._id
                            ? {
                                  ...currentPhoto,
                                  comments: [...(currentPhoto.comments || []), comment],
                              }
                            : currentPhoto
                    )
                );
                setCommentText(photo, "");
            })
            .catch((commentError) => {
                setPhotoCommentError(
                    photo,
                    commentError.message || "Could not add comment."
                );
            })
            .finally(() => {
                setPhotoCommentSubmitting(photo, false);
            });
    };

    const renderPhoto = (photo) => (
        <div className="photo-entry" key={photo._id}>
            <Typography color="text.secondary" variant="body2">
                {formatDateTime(photo.date_time)}
            </Typography>

            <img
                alt={`${user.first_name} ${user.last_name}`}
                className="photo-image"
                src={getPhotoSrc(photo.file_name)}
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
                <form
                    className="comment-form"
                    onSubmit={(event) => handleAddComment(event, photo)}
                >
                    <TextField
                        fullWidth
                        label="Add a comment"
                        multiline
                        onChange={(event) => setCommentText(photo, event.target.value)}
                        rows={2}
                        value={commentTexts[photo._id] || ""}
                    />
                    {commentErrors[photo._id] && (
                        <Alert severity="error">{commentErrors[photo._id]}</Alert>
                    )}
                    <Button
                        disabled={Boolean(commentSubmitting[photo._id])}
                        type="submit"
                        variant="contained"
                    >
                        {commentSubmitting[photo._id] ? "Adding..." : "Add Comment"}
                    </Button>
                </form>
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
