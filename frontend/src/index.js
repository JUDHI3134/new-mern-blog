import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './Components/Layout';
import ErrorPage from './Pages/ErrorPage'
import Home from './Pages/Home'
import PostDetail from './Pages/PostDetail'
import Register from './Pages/Register'
import Login from './Pages/Login'
import UserProfile from './Pages/UserProfile'
import Authors from './Pages/Authors'
import CreatePost from './Pages/CreatePost'
import CategoryPosts from './Pages/CategoryPosts'
import AuthorPosts from './Pages/AuthorPosts'
import Dashboard from './Pages/Dashboard'
import EditPost from './Pages/EditPost'
import DeletePost from './Pages/DeletePost'
import Logout from './Pages/Logout'
import UserProvider from './context/userContext';


const router = createBrowserRouter([
  {
    path: "/",
    element: <UserProvider><Layout/></UserProvider>,
    errorElement: <ErrorPage/>,
    children:[
      {index:true, element: <Home/>},
      {path: "posts/:id", element:<PostDetail/>},
      {path: "register", element:<Register/>},
      {path: "login", element:<Login/>},
      {path: "profile/:id", element:<UserProfile/>},
      {path: "authors", element:<Authors/>},
      {path: "create", element:<CreatePost/>},
      {path: "posts/categories/:category", element:<CategoryPosts/>},
      {path: "post/users/:id", element:<AuthorPosts/>},
      {path: "myposts/:id", element:<Dashboard/>},
      {path: "post/:id/edit", element:<EditPost/>},
      {path: "posts/:id/delete", element:<DeletePost/>},
      {path: "logout", element:<Logout/>},
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <RouterProvider router={router}/>
  </React.StrictMode>
);

