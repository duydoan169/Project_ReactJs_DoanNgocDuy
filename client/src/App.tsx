import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Register from './pages/Register'

export default function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <h1>Trang chu</h1>
    },
    {
      path: "/register",
      element: <Register></Register>
    },
    {
      path: "/login",
      element: <h1>Login</h1>
    }
  ])
  return (
    <div>
      <RouterProvider router={routes}></RouterProvider>
    </div>
  )
}
