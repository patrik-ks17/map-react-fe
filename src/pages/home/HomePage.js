import {React, useEffect} from "react";
import NavBar from "../../components/home/NavBar";
import Welcome from "../../components/home/Welcome";
import "../../assets/style/Home.css";


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
