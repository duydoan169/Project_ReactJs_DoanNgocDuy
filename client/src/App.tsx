import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import MainLayout from './layout/MainLayout'
import HomePage from './pages/HomePage'
import Categories from './pages/Categories'
import Vocabularies from './pages/Vocabulary'

export default function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout></MainLayout>,
      children: [
        {
          index: true,
          element: <HomePage></HomePage>
        },
        {
          path: "/categories",
          element: <Categories></Categories>
        },
        {
          path: "/vocabularies",
          element: <Vocabularies></Vocabularies>
        }
      ]
    },
    {
      path: "/register",
      element: <Register></Register>
    },
    {
      path: "/login",
      element: <Login></Login>
    }
  ])
  return (
    <div>
      <RouterProvider router={routes}></RouterProvider>
    </div>
  )
}
