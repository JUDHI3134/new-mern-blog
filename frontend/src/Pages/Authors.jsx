import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'
import Loader from '../Components/Loader'




const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(false)


  useEffect(()=>{
    const getAuthors = async ()=>{
      setIsLoading(true)
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users`)
        setAuthors(response.data)
      } catch (error) {
        console.log(error)
      }
      setIsLoading(false)

    }
    getAuthors();
  },[])

  if(isLoading){
    return <Loader/>
  }

  return (
    <section className="authors">
      {authors.length > 0 ? (
        <div className="container authors-container">
          {authors.map(({_id: id, avatar, name, posts }) => {
            return (
              <Link key={id} to={`/post/users/${id}`} className="author">
                <div className="author-avatar">
                  <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${avatar}`} alt={`Image of ${name}`} />
                </div>
                <div className="author-info">
                  <h4>{name}</h4>
                  <p>{posts}</p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <h2 className="center">No authors/users found</h2>
      )}
    </section>
  );
};

export default Authors;
