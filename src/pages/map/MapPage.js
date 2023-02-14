import "@reach/combobox/styles.css";
import "../../assets/style/map/Functions.css";
import "../../assets/style/map/UserList.css";
import "../../assets/style/map/MapPage.css";
import "../../assets/style/map/MarkerSetting.css";
import { useState, useEffect, useRef, useCallback } from "react";
import { useLoadScript } from "@react-google-maps/api";
import Header from "../../components/map/header/Header";
import UserList from "../../components/map/UserList";
import Map from "../../components/map/Map";
import MarkerSetting from "../../components/map/MarkerSetting";
import DeleteMarker from "./../../hooks/DeleteMarker";
import FetchMarkers from "../../hooks/FetchMarkers";
import FetchUsers from "./../../hooks/FetchUsers";
import Nav from "../../components/Nav"

const libraries = ["places"];

export default function MapPage() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [loggedUser, setLoggedUser] = useState();
  const [users, setUsers] = useState([]);
  const [markers, setMarkers] = useState([{}]);
  const [selected, setSelected] = useState({});
  const [startTime, setStartTime] = useState("0:00");
  const [endTime, setEndTime] = useState("0:00");
  const [showingInfo, setShowingInfo] = useState(false);
  const [markerPending, setMarkerPending] = useState({});

  // get user's markers
  useEffect(() => {
    FetchMarkers(setMarkers, setLoggedUser);
  }, []);

  // get all users data
  useEffect(() => {
    FetchUsers(setUsers);
  }, []);

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = useCallback(({ lat, lng }, zoom) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(zoom);
  }, []);

  if (loadError) return "Error Loading Map";
  if (!isLoaded) return "Loading Map";
  return (
    <div className="back-map-page">
      <div>
        <div className="map-page">
        {/* <Nav/> */}
          <Header panTo={panTo} />
          <div className="Main">
            <UserList
              users={users}
              loggedUser={loggedUser}
              setMarkers={setMarkers}
              panTo={panTo}
            />
            <Map
              showingInfo={showingInfo}
              setShowingInfo={setShowingInfo}
              markers={markers}
              setMarkers={setMarkers}
              selected={selected}
              setSelected={setSelected}
              startTime={startTime}
              endTime={endTime}
              markerPending={markerPending}
              setMarkerPending={setMarkerPending}
              DeleteMarker={DeleteMarker}
              onMapLoad={onMapLoad}
              loggedUser={loggedUser}
            />
            <MarkerSetting
              markers={markers}
              selected={selected}
              setSelected={setSelected}
              startTime={startTime}
              setStartTime={setStartTime}
              endTime={endTime}
              setEndTime={setEndTime}
              setMarkerPending={setMarkerPending}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
