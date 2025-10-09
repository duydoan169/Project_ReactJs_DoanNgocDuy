import React from 'react'
import "../css/homePage.css"
import { useNavigate } from 'react-router-dom'
export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div className='container'>
      <h1>Welcome to VocabApp</h1>
      <p>Learn and practice vocabulary with flashcards and quizzes</p>
      <div className='buttons'>
        <button onClick={()=>navigate("/quizz")} className='getStartedButton'>Get Started</button>
        <button onClick={()=>navigate("/register")} className='createAccountButton'>Create Account</button>
      </div>
    </div>
  )
}
