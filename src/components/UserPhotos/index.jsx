import React from "react";
import { Button, Link as MuiLink, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";

import "./styles.css";
import models from "../../modelData/models";

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
function UserPhotos () {
    const { userId } = useParams();
    const user = models.userModel(userId);
    const photos = models.photoOfUserModel(userId);

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
        ) : (
          photos.map((photo) => (
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
          ))
        )}
      </div>
    );
}

export default UserPhotos;
