import { connection } from "../connect.js";
import jwt from "jsonwebtoken";

export const getLikes = (req, res) => {
  const q = "SELECT likeUserId FROM likes WHERE likePostId = ?";

  connection.query(q, [req.query.postId], (err, data) => {
    console.log(err);
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.map((like) => like.likeUserId));
  });
};

export const addLike = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "INSERT INTO likes (`likeUserId`,`likePostId`) VALUES (?)";
    const values = [userInfo.id, req.body.postId];

    connection.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been liked.");
    });
  });
};

export const deleteLike = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM likes WHERE `likeUserId` = ? AND `likePostId` = ?";

    connection.query(q, [userInfo.id, req.query.postId], (err, data) => {
      console.log(err);
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been disliked.");
    });
  });
};
