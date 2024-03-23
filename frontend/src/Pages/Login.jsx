import React,{useState, useContext} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import axios from 'axios'

import { UserContext } from '../context/userContext.js'

const Login = () => {
  const [userData,setUserData] = useState({
      email:"",
      password:"",
  })

  const [error,setError] = useState("")
  const navigate = useNavigate();

  const {setCurrentUser} = useContext(UserContext)

  const changeHandler = (e)=>{
     setUserData(prevState => {
      return {...prevState, [e.target.name] : e.target.value}
     })
  }

  const loginUser = async(e)=>{
     e.preventDefault();
     setError("")
     try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/login`, userData);
      const user = await response.data;
      setCurrentUser(user)
      navigate("/")
     } catch (err) {
      setError(err.response.data.message)
     }
  }
  return (
    <section className='login'>
      <div className="container">
        <h2>Sign Up</h2>
        <form className='form login-form' onSubmit={loginUser}>
         { error && <p className="form-error-message">{error}</p>}
          <input type="email" name="email" placeholder='Email' value={userData.email} onChange={changeHandler}  autoFocus/>
          <input type="password" name="password" placeholder='Password' value={userData.password} onChange={changeHandler} />
          <button type="submit" className='btn primary'>Login</button>
        </form>
        <small>Don't Have an Account ? <Link to="/register">Sign Up</Link></small>
      </div>
    </section>
  )
}

export default Login
