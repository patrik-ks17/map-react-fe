import React from "react";
import NavBar from "./components/NavBar";
import Welcome from "./components/Welcome";
import "./style/Home.css";

function HomePage() {
  return (
    <div>
      <h1>Move It</h1>
      <div className="center">
			<NavBar />
		</div>
      <Welcome />
    </div>
  );
}

export default HomePage;
