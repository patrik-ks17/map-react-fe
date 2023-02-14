import React from 'react'
import { useNavigate } from "react-router-dom";
import "../assets/style/Header.css"

function Header() {
	const navigate = useNavigate();
  return (
	 <div className='header'><img src={`icon/home.png`} onClick={(e) =>{navigate('/')}}></img></div>
  )
}

export default Header