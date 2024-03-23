import React,{useState, useContext, useEffect} from 'react'
import { Link, useNavigate,useParams } from 'react-router-dom'

import {UserContext} from '../context/userContext'
import axios from 'axios'
import Loader from '../Components/Loader'
import DeletePost from './DeletePost'

const Dashboard = () => {

  const [posts,setPosts] = useState([]);
  const [isLoading,setIsLoading] = useState(false)

  const navigate = useNavigate();
  const {id} = useParams()

  const {currentUser} = useContext(UserContext)
  const token = currentUser?.token;

//redirect to to login page who is not a logged in user
  useEffect(()=>{
    if(!token){
      navigate("/login")
    }
  },[])


  useEffect(()=>{
   const fetchPosts = async ()=>{
    setIsLoading(true)
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/users/${id}`,
      {withCredentials:true, headers:{Authorization:`Bearer ${token}`}})
      setPosts(response.data)
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
   }
   fetchPosts()
  },[])

  if(isLoading){
    return <Loader/>
  }

  return (
    <section className='dashboard'>
      {
        posts.length ? <div className='container dashboard-container'>
         {posts.map(post=>{
          return <article key={post.id} className='dashboard-post'>
           <div className="dashboard-post-info">
            <div className="dashboard-post-thumbnail">
              <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${post.thumbnail}`} alt="" />
            </div>
            <h5>{post.title}</h5>
           </div>
           <div className="dashboard-post-actions">
            <Link to={`/posts/${post._id}`} className='btn sm'>View</Link>
            <Link to={`/post/${post._id}/edit`} className='btn sm primary'>Edit</Link>
            <DeletePost postId={post._id}/>
           </div>
          </article>
         })}
        </div> : <h2 className='center'>You Have No post yet</h2>
      }
    </section>
  )
}

export default Dashboard
