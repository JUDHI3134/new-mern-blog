import React, { useEffect, useContext,useState } from "react";
import { UserContext } from "../context/userContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Loader from "../Components/Loader";

const DeletePost = ({ postId: id }) => {

  const [isLoading,setIsLoading] = useState(false)

  const navigate = useNavigate();
  const location = useLocation();

  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  //redirect to to login page who is not a logged in user
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  const removePost = async () => {
    setIsLoading(true)
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/posts/${id}`,{withCredentials:true, headers: {Authorization: `Bearer ${token}`}}
      );

      if(response.status == 200){
        if(location.pathname == `/myposts/${currentUser.id}`){
          navigate(0)
        }else{
          navigate("/")
        }
      }
      setIsLoading(false)
    } catch (error) {
      console.log("could not delete the post");
    }
  };

  if(isLoading){
    return <Loader/>
  }

  return (
    <div>
      <Link className="btn sm danger" onClick={() => removePost(id)}>
        Delete
      </Link>
    </div>
  );
};

export default DeletePost;
