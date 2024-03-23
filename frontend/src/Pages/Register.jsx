import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const changeHandler = (e) => {
    setUserData(prevState => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  const registerUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/users/register`,
        userData
      );
      const newUser = await response.data;
      console.log(newUser);
      if(!newUser){
        setError("couldn't register user. please try again")
      }
      navigate('/login')
    } catch (err) {
      setError(err.response.data.message);
    }
  };
  return (
    <section className="register">
      <div className="container">
        <h2>Sign Up</h2>
        <form className="form register-form" onSubmit={registerUser}>
          {error && <p className="form-error-message">{error}</p>}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={userData.name}
            onChange={changeHandler}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={userData.email}
            onChange={changeHandler}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={userData.password}
            onChange={changeHandler}
          />
          <input
            type="password"
            name="password2"
            placeholder="Confirm Password"
            value={userData.password2}
            onChange={changeHandler}
          />
          <button type="submit" className="btn primary">
            Register
          </button>
        </form>
        <small>
          Already have an Account ? <Link to="/login">Sign In</Link>
        </small>
      </div>
    </section>
  );
};

export default Register;
