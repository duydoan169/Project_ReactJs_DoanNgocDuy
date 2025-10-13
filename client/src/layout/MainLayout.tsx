import React, { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import "../css/mainLayout.css"
import type { User } from '../utils/type';
import Swal from 'sweetalert2';
export default function MainLayout() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(JSON.parse(localStorage.getItem("currentUser") || "null"));  
  const location = useLocation();
  useEffect(()=>{
    setCurrentUser(JSON.parse(localStorage.getItem("currentUser") || "null"));
    if(currentUser == null && (location.pathname != "/login" && location.pathname != "/register")){
      Swal.fire("Bạn chưa đăng nhập");
      navigate("/login");
    }
  }, [location, navigate]);
  const handleLogout=()=>{
    Swal.fire({
      title: "Bạn có chắc chắn muốn đăng xuất?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Đăng xuất thành công",
          icon: "success"
        });
        localStorage.setItem("currentUser", JSON.stringify(null));
        navigate("/login");
      }
    });
  }
  return (
    <div style={{display: 'flex',minHeight: '100vh' , flexDirection: "column", justifyContent: 'space-between'}}>
      <div>
        <div className='header'>
          <nav>
              <NavLink id='logo' to={"/"}>VocabApp</NavLink>
              <NavLink to={"/dashboard"}>Dashboard</NavLink>
              <NavLink to={"/categories"}>Categories</NavLink>
              <NavLink to={"/vocabularies"}>Vocabulary</NavLink>
              <NavLink to={"/flashcard"}>Flashcards</NavLink>
              <NavLink to={"/quizz"}>Quiz</NavLink>
          </nav>
          <button className='logout' onClick={handleLogout}>Logout</button>
        </div>
        <Outlet></Outlet>
      </div>
      <div className='footer'>
        <p>© 2024 VocabApp. All rights reserved.</p>
      </div>
    </div>
  )
}
