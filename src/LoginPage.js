import React, {useState} from 'react'
import {useNavigate} from "react-router-dom"

function LoginPage(props) {
	const navigate = useNavigate();
	const initialValues = {user: "", password: ""};
  	const [formValues, setFormValues] = useState(initialValues)

   const handleChange = (e) => {
	  const {name, value} = e.target;
	  setFormValues({ ...formValues, [name]: value}); 
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		fetch("http://localhost:9000/login", {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
          usern: formValues.user,
          password: formValues.password
        })
      })
        .then((res) => res.json())
        .then(data => {
			if (data.status=="ok") { 
				alert("Belépés sikeres")
				window.localStorage.setItem("token",data.data);
				navigate("/mappage")
			}
		})
	}



 	return (
		<div className='auth-form-container'>
			<form className='login-form' onSubmit={handleSubmit}>
				<h1>Belépés</h1>
				<label htmlFor="user">Felhasználónév/Email</label>
				<input value={formValues.user}
          		onChange={handleChange}
					type="text" 
					placeholder="felhasznalonev/emailcimed@gmail.com" 
					id="user" name="user">
				</input>
				<label htmlFor="password">Jelszó</label>
				<input value={formValues.password}
          		onChange={handleChange}
					type="password" 
					placeholder="*********" 
					id="password" name="password">
				</input>
				<button type="submit">Belépés</button>
			</form>
			<button className='link-btn' onClick={() => navigate("/register")}>Nincs még fiókom.</button>
	 	</div>
  )
}

export default LoginPage