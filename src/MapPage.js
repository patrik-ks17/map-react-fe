import { useCallback, useState, useRef, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindowF,
} from "@react-google-maps/api";
import "@reach/combobox/styles.css";
import mapStyles from "./mapStyles";
import TimeRangePicker from "@wojtekmaj/react-timerange-picker";
import Search from "./components/Search";
import Locate from "./components/Locate";


const libraries = ["places"];
const mapContainerStyle = {
  width: "150vh",
  height: "60vh",
};
const center = {
  lat: 47.22238413761323,
  lng: 19.1766162408318,
};
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};
let id = "63d3a0b686b7d699776ca56d"


export default function MapPage() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });  

  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null); 
  const [timerange, setTimerange] = useState(["",""]);
  const [users, setUsers] = useState([]);

  async function fetchMarkers(id) {
    const response = await fetch(
      `http://localhost:9000/markers/${id}`
    );
    const json = await response.json();
    setMarkers(json.markers);
  }
  useEffect(() => {
    fetchMarkers(id);
  }, []);

  async function updateMarkers(selected, id) {
    const body = JSON.stringify(selected);
    const response = await fetch(
      `http://localhost:9000/markers/${id}`,
      {
        method: "POST",
        body: body,
        headers: {
          "content-type": "application/json",
        },
      }
    );
    if (!response.ok) {
      alert("Failed to add marker");
      return;
    }
  }

  async function deleteMarker(selected, id) {
    const body = JSON.stringify(selected);
    const response = await fetch(
      `http://localhost:9000/markers/${id}`,
      {
        method: "DELETE",
        body: body,
        headers: {
          "content-type": "application/json",
        },
      }
    );
    if (!response.ok) {
      alert("Failed to delete marker");
      return;
    }
  }

  const onMapClick = useCallback((event) => {
    const sport = document.querySelector("form[id='markerform'] input[name='sport']").value;
    if (sport === "") {
      alert("Please add a Sport to your marker");
      return;
    } else {
      setMarkers((current) => [
        ...current,
        {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
          sport: null,
          timerange: ["00:00","00:00"],
        },
      ]);
    }
  }, []);

  function removeMarker() {
    markers.map((marker, index) => {
      if (JSON.stringify(marker) === JSON.stringify(selected)) {
        delete markers[index];
        deleteMarker(selected, id);
        setSelected(null);
      }
    });
  }

  function addMarker() {
    const sport = document.querySelector(
      "form[id='markerform'] input[name='sport']"
    ).value;
    markers.map((marker, index) => {
      if (marker.lat === selected.lat && marker.lng === selected.lng) {
        markers[index].sport = sport;
        markers[index].timerange = timerange;
      }
    });
    updateMarkers(selected, id);
  }

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
  }, []);
  
  // ----------------------------------------------------
	async function fetchUsers() {
		const response = await fetch(
		  "http://localhost:9000/users"
		);
		const json = await response.json();
		setUsers(json)
	}
	useEffect(() => {
		fetchUsers();
	});




	
	if (loadError) return "Error loading maps";
	if (!isLoaded) return "Loading Maps";
  return (
    <div>
      {/* Menu bar */}
      <div className="functions">
        <h1>Logo</h1>
        <Search panTo={panTo} />
        <Locate panTo={panTo} />
      </div>

      <div style={{ display: "flex" }}>
			{/* Users list */}
			<div className="users-list">
				<ul>
					{users.map((user, index) => {
						return (
							<div key={index} className="user-box" onClick={() => { 
								id = user._id;
								fetchMarkers(user._id)
							}}
							>
								<li key={user._id}>{user.username}</li>
								<ul>
									{user.markers.map((marker, index) => {
										return (
											<li key={index}>
												<p>lat: {marker.lat}</p>
												<p>lng: {marker.lng}</p>
											</li>
										)
									})}
								</ul>
							</div>
						)
					})}
				</ul>
			</div>
        {/* Google Map */}
        <div className="google-map">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={7}
            center={center}
            options={options}
            onClick={onMapClick}
            onLoad={onMapLoad}
          >
            {markers.map((marker, index) => (
              <Marker
                key={index}
                position={{
                  lat: marker.lat,
                  lng: marker.lng,
                }}
                onClick={() => {
                  setSelected(marker);
                }}
              />
            ))}

            {selected ? (
              <InfoWindowF
                position={{ lat: selected.lat, lng: selected.lng }}
                onCloseClick={() => {
                  setSelected(null);
                }}
              >
                <div>
                  <h2>
                    <span>{selected.sport}</span>
                  </h2>
                  <p>{selected.timerange[0] + " - " + selected.timerange[1]}</p>
                  <button onClick={removeMarker}>Törlés</button>
                </div>
              </InfoWindowF>
            ) : null}
          </GoogleMap>
        </div>
        {/* Marker Settings */}
        <div className="set-marker">
          <form id="markerform">
            <span>Sport</span>
            <input type={"text"} name={"sport"} defaultValue=""></input>
            <span>Schedule</span>
            <TimeRangePicker
              disableClock
              onChange={setTimerange}
				  value={timerange}
				  />
            <button type={"button"} onClick={addMarker}>
              Felvesz
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
