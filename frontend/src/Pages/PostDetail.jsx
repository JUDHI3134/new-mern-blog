import React, { useState, useEffect, useContext } from "react";
import PostAuthor from "../Components/PostAuthor";
import { Link, useParams } from "react-router-dom";


import Loader from "../Components/Loader";
import DeletePost from "./DeletePost";
import { UserContext } from "../context/userContext";
import axios from "axios";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  // const [creatorId, setCreatorId] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const getPosts = async ()=>{
      setIsLoading(true)
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/${id}`);
        setPost(response.data);
        // setCreatorId(response.data.creator)
      } catch (error) {
        setError(error)
      }
      setIsLoading(false)
    }
    getPosts();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="post-detail">
      {error && <p className="error">{error}</p>}
      {post && (
        <div className="container post-detail-container">
          <div className="post-detail-header">
            <PostAuthor authorId={post.creator} createdAt={post.createdAt} />
            {currentUser?.id == post?.creator && (
              <div className="post-detail-buttons">
                <Link to={`/post/${post?._id}/edit`} className="btn sm primary">
                  Edit
                </Link>
                <DeletePost postId={id} />
              </div>
            )}
          </div>
          <h1>{post.title}</h1>
          <div className="post-detail-thumbnail">
            <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${post.thumbnail}`} alt="" />
          </div>
          <p dangerouslySetInnerHTML={{__html: post.description}}></p>
        </div>
      )}
    </section>
  );
};

export default PostDetail;
