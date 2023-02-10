import React from "react";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";
import Logout from "./../login/Logout";

function NavBar() {
  const navigate = useNavigate();
  const alert = useAlert();
  const isLoggedIn = window.localStorage.getItem("loggedIn");
  const userType = window.localStorage.getItem("userType");

  function handleClick(element) {
    const page = element.target.getAttribute("data-name");
    if (page !== "info" && isLoggedIn == "false") {
      if (page === "login") {
        navigate("/" + page);
      } else {
        alert.info("Először jelentkezzen be!");
        navigate("/home");
      }
    } else if (isLoggedIn === "true" && page === "login") {
      if (userType === "admin") {
        navigate("/admin");
      } else {
        navigate("/profile");
      }
    } else {
      navigate("/" + page);
    }
  }

  return (
    <div className="navbar">
      <ul>
        <li>
          <img
            data-name={"login"}
            src="icon/navbar/user.png"
            alt="user"
            onClick={(e) => handleClick(e)}
          ></img>
        </li>
        <li>
          <img
            data-name={"chat"}
            src="icon/navbar/firechat.png"
            alt="chat"
            onClick={(e) => handleClick(e)}
          ></img>
        </li>
        <li>
          <img
            data-name={"sports"}
            src="icon/navbar/sports.png"
            alt="sports"
            onClick={(e) => handleClick(e)}
          ></img>
        </li>
        <li>
          <img
            data-name={"map"}
            src="icon/navbar/map.png"
            alt="map"
            onClick={(e) => handleClick(e)}
          ></img>
        </li>
        <li>
          <img
            data-name={"info"}
            src="icon/navbar/info.png"
            alt="info"
            onClick={(e) => handleClick(e)}
          ></img>
        </li>
        {isLoggedIn === "true" ? (
          <li>
            <img
              src="icon/navbar/logout.png"
              alt="logout"
              onClick={() => Logout(alert)}
            ></img>
          </li>
        ) : null}
      </ul>
    </div>
  );
}

export default NavBar;
