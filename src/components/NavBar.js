import React from 'react'
import {useNavigate} from "react-router-dom"

function NavBar() {
	const navigate = useNavigate();
	function handleClick(element) {
		const page = element.target.getAttribute('data-name');
		navigate('/' + page);
			
	}
	
  return (
	 <div className='navbar'>
		<ul>
			<li><img data-name={"setting"} src='icon/navbar/setting.png' onClick={(e) => handleClick(e)}></img></li>
			<li><img data-name={"user"} src='icon/navbar/user.png' onClick={(e) => handleClick(e)}></img></li>
			<li><img data-name={"chat"} src='icon/navbar/fire.png' onClick={(e) => handleClick(e)}></img></li>
			<li><img data-name={"sports"} src='icon/navbar/sports.png' onClick={(e) => handleClick(e)}></img></li>
			<li><img data-name={"map"} src='icon/navbar/location.png' onClick={(e) => handleClick(e)}></img></li>
			<li><img data-name={"info"} src='icon/navbar/information.png' onClick={(e) => handleClick(e)}></img></li>
		</ul>
	 </div>
  )
}

export default NavBar