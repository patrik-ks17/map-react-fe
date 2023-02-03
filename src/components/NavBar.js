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
			<li><img data-name={"setting"} src='icon/navbar/setting.png' alt="setting" onClick={(e) => handleClick(e)}></img></li>
			<li><img data-name={"login"} src='icon/navbar/user.png' alt="user" onClick={(e) => handleClick(e)}></img></li>
			<li><img data-name={"chat"} src='icon/navbar/firechat.png' alt="chat" onClick={(e) => handleClick(e)}></img></li>
			<li><img data-name={"sports"} src='icon/navbar/sports.png' alt="sports" onClick={(e) => handleClick(e)}></img></li>
			<li><img data-name={"map"} src='icon/navbar/map.png' alt="map" onClick={(e) => handleClick(e)}></img></li>
			<li><img data-name={"info"} src='icon/navbar/info.png' alt="info" onClick={(e) => handleClick(e)}></img></li>
		</ul>
	 </div>
  )
}

export default NavBar