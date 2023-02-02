import React, { useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import Validate from './components/Validate';


function RegisterPage(props) {
  const navigate = useNavigate();
  const initialValues = { username: "", email: "", password: "", passagain: "" };
  const [formValues, setFormValues] = useState(initialValues)
  const [formErrors, setFormErrors] = useState({})
  const [isSubmit, setIsSubmit] = useState(false)

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormValues({ ...formValues, [name]: value}); 
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(Validate(formValues))
    if (Object.keys(formErrors).length == 0){
      setIsSubmit(true)
      fetch("http://localhost:9000/register", {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
          username: formValues.username,
          email: formValues.email,
          password: formValues.password
        })
      })
        .then((res) => res.json())
        .then(data => console.log(data,"UserRegister"))
    }
  }
    

  return (
    <div className='auth-form-container'>
      
      <form className='register-form' onSubmit={handleSubmit}>
        <h1>Regisztráció</h1>

        <label htmlFor="username">Felhasználónév</label>
        <input value={formValues.username}
          onChange={handleChange}
          type="text"
          placeholder="Felhasználónév"
          id="username" name="username">
        </input>
        <p>{formErrors.username}</p>

        <label htmlFor="email">Email</label>
        <input value={formValues.email}
          onChange={handleChange}
          type="email"
          placeholder="emailcimed@gmail.com"
          id="email" name="email">
        </input>
        <p>{formErrors.email}</p>

        <label htmlFor="password">Jelszó</label>
        <input value={formValues.password}
          onChange={handleChange}
          type="password"
          placeholder="*********"
          id="password" name="password">
        </input>
        <p>{formErrors.password}</p>

        <label htmlFor="passagain">Jelszó újra</label>
        <input value={formValues.passagain}
          onChange={handleChange}
          type="password"
          placeholder="*********"
          id="passagain" name="passagain">
        </input>
        <p>{formErrors.passagain}</p>

        {Object.keys(formErrors).length === 0 && isSubmit ? (
          <div className='message-success'>Sikeres regisztráció!</div>
        ) : (
          <pre>{JSON.stringify(formValues, undefined, 2)}</pre>
        )}
        <button type="submit">Regisztráció</button>
      </form>
      <button className='link-btn' onClick={() => navigate('login')}>Van már fiókom.</button>
    </div>
  )
}

export default RegisterPage