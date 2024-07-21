import React from 'react'
import { Link } from 'react-router-dom'

const About = () => {
  return (
    <div className="hero bg-base-200 min-h-screen">
    <div className="hero-content flex-col lg:flex-row-reverse">
      <img
        src="../public/Unseeing logo.png"
        className="max-w-sm rounded-lg shadow-2xl" />
      <div>
        <h1 className="text-5xl font-bold">Welcome!!</h1>
        <p className="py-6">
       This is a website for the anonymous activities within the Amity University have fun with out getting seen 
        </p>
        <Link to={"/signup"} className="btn btn-primary">Get Started</Link>
      </div>
    </div>
  </div>
  )
}

export default About