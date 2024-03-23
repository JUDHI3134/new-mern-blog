import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Avatar from "../Images/avatar1.jpg";
import axios from "axios";

import ReactTimeAgo from 'react-time-ago'
import TimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en.json'
import ru from 'javascript-time-ago/locale/ru.json'

TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)


const PostAuthor = ({ authorID, createdAt }) => {
  const [author, setAuthor] = useState({});

  useEffect(() => {
    const getAuthor = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/users/${authorID}`
        );
        setAuthor(response?.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAuthor();
  }, []);

  return (
    <div>
      <Link to={`/post/users/${authorID}`} className="post-author">
        <div className="post-author-avatar">
          <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${author?.avatar}`} alt="" />
        </div>
        <div className="post-author-details">
          <h5>By: {author?.name}</h5>
          <small><ReactTimeAgo date={new Date(createdAt)} locale="en-US" /></small>
        </div>
      </Link>
    </div>
  );
};

export default PostAuthor;
