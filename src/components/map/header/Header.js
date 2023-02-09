import {React, useRef, useCallback} from "react";
import Search from "./Search";
import Locate from "./Locate";

function Header() {

  const center = {
    lat: parseFloat(47.22238413761323),
    lng: parseFloat(19.1766162408318),
  };
  
  const panTo = useCallback(({ lat, lng }, zoom) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(zoom);
    console.log(mapRef.current)
  }, []);
  panTo(center, 10)
  return (
    <div className="functions">
      <h1>Térkép</h1>
      <div>
        <Search panTo={panTo} />
        <Locate panTo={panTo} />
      </div>
    </div>
  );
}

export default Header;
