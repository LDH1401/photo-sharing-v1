import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Link as MuiLink, Typography } from "@mui/material";

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

function UserComments() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    setLoading(true);
    setError("");

    Promise.all([
      fetchModel(`/user/${encodeURIComponent(userId)}`),
      fetchModel(`/commentsOfUser/${encodeURIComponent(userId)}`),
    ])
      .then(([userModel, commentModels]) => {
        if (!ignore) {
          setUser(userModel);
          setComments(commentModels || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!ignore) {
          setError("Could not load comments.");
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [userId]);

  if (loading) {
    return <Typography color="text.secondary">Loading comments...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!user) {
    return <Typography>User not found.</Typography>;
  }

  return (
    <div className="user-comments">
      <div>
        <Typography variant="h4">
          Comments by {user.first_name} {user.last_name}
        </Typography>
        <Typography color="text.secondary" variant="subtitle1">
          {comments.length} comment{comments.length === 1 ? "" : "s"}
        </Typography>
      </div>

      {comments.length === 0 ? (
        <Typography>No comments available.</Typography>
      ) : (
        comments.map((comment) => (
          <MuiLink
            className="user-comment"
            component={Link}
            key={comment._id}
            to={`/photos/${comment.photo.user_id}/${comment.photo._id}`}
            underline="none"
          >
            <img
              alt="Commented item thumbnail"
              className="user-comment-thumbnail"
              src={getPhotoSrc(comment.photo.file_name)}
            />
            <Typography color="text.primary" variant="body1">
              {comment.comment}
            </Typography>
          </MuiLink>
        ))
      )}
    </div>
  );
}

export default UserComments;
