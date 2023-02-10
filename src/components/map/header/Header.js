import React from "react";
import Search from "./Search";
import Location from "./Location";

function Header({panTo}) {

  const center = {
    lat: parseFloat(47.22238413761323),
    lng: parseFloat(19.1766162408318),
  };
  
  return (
    <div className="functions">
      <h1>Térkép</h1>
      <div>
        <Search panTo={panTo} />
        <Location panTo={panTo} />
      </div>
    </div>
  );
}

export default Header;
