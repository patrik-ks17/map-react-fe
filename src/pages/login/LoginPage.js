import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import "../../assets/style/login/Login.css";
import Nav from "../../components/Nav";

function LoginPage() {
  const alert = useAlert();
  const navigate = useNavigate();
  const initialValues = { user: "", password: "" };
  const [formValues, setFormValues] = useState(initialValues);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:9000/login", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        usern: formValues.user,
        password: formValues.password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          window.localStorage.setItem("token", data.data.token);
          window.localStorage.setItem("loggedIn", true);
          window.localStorage.setItem("userType", data.data.usertype);
          alert.success("Sikeres bejelentkezés!");
          setTimeout(() => navigate("/home"), 2000);
        } else {
          alert.error("Sikertelen bejelentkezés!");
        }
      });
  };

  return (
    <div className="back-login-page">
      <div>
        <div className="login-page">
          <Nav />
          <form className="login-form" onSubmit={handleSubmit}>
            <h1>Belépés</h1>
            <label htmlFor="user">Felhasználónév/Email</label>
            <input
              value={formValues.user}
              onChange={handleChange}
              type="text"
              placeholder="Felhasznalo / Email"
              id="user"
              name="user"
            ></input>
            <label htmlFor="password">Jelszó</label>
            <input
              value={formValues.password}
              onChange={handleChange}
              type="password"
              placeholder="*********"
              id="password"
              name="password"
            ></input>

            <a className="link-btn" onClick={() => navigate("/register")}>
              Nincs még fiókom.
            </a>
            <button className="login-btn" type="submit">
              Belépés
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
