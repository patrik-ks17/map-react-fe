/* #region  Imports */
import { useCallback, useState, useRef, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindowF,
} from "@react-google-maps/api";
import "@reach/combobox/styles.css";
import mapStyles from "./mapStyles";
import Search from "./components/Search";
import Locate from "./components/Locate";
import TimePicker from "react-time-picker";
import "./style/mapPagestyle.css"
/* #endregion */

/* #region  Constans */
const libraries = ["places"];
const mapContainerStyle = {
  width: "150vh",
  height: "60vh",
};
const center = {
  lat: parseFloat(47.22238413761323),
  lng: parseFloat(19.1766162408318),
};
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};
/* #endregion */

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
  const [showingInfo, setSInfo] = useState(false);
  const [markerPending, setMarkerPending] = useState({});

  /* #region  Fetching */
  // get markers
  useEffect(() => {
    async function fetchMarkers() {
      fetch(`http://localhost:9000/get-userdata`, {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          token: window.localStorage.getItem("token"),
        }),
      })
        .then((response) =>
          !response.ok ? alert("Sikertelen lekérdezés") : response.json()
        )
        .then((data) => {
          setMarkers(data.data.markers);
          setLoggedUser(data.data);
        });
    }
    fetchMarkers();
  }, []);

  // get all data
  useEffect(() => {
    async function fetchUsers() {
      const response = await fetch(`http://localhost:9000/get-alldata`, {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          token: window.localStorage.getItem("token"),
        }),
      });
      if (!response.ok) {
        alert("Sikertelen adat lekérdezés");
        return;
      }
      const json = await response.json();
      setUsers(json.data);
    }
    fetchUsers();
  }, []);

  async function pushMarker(selected) {
    const response = await fetch(`http://localhost:9000/add-marker`, {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        token: window.localStorage.getItem("token"),
        selected,
      }),
    });
    if (!response.ok) {
      alert("Marker hozzáadás sikertelen");
      return;
    }
    // const json = await response.json();
  }

  async function deleteMarker(selected) {
    const response = await fetch(`http://localhost:9000/delete-marker`, {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        token: window.localStorage.getItem("token"),
        selected,
      }),
    });
    if (!response.ok) {
      alert("Marker törlése sikertelen");
      return;
    }
    //const json = await response.json();
  }
  /* #endregion */

  /* #region Functions  */
  const onMapClick = (event) => {
    if (Object.keys(markerPending).length === 0) {
      const sport = document.querySelector(
        "form[id='markerform'] input[name='sport']"
      ).value;
      if (sport === "") {
        alert("Add meg a sport tevékenységet!");
        return;
      } else if (startTime === "0:00" || endTime === "0:00") {
        alert("Add meg az időpontot!");
        return;
      } else {
        const timerange = {
          start: startTime,
          end: endTime,
        };
        const newMarker = {
          lat: parseFloat(event.latLng.lat()),
          lng: parseFloat(event.latLng.lng()),
          sport: sport,
          time: timerange,
        };
        setSelected(newMarker);
        setMarkerPending(newMarker);
        setSInfo(true);
        setMarkers((current) => [...current, newMarker]);
      }
    }
    else {
      return alert("Van kijelölt marker!");
    }
  };

  function lc_removeMarker() {
    markers.map((marker, index) => {
      if (JSON.stringify(marker) === JSON.stringify(selected)) {
        markers.splice(index, 1);
        deleteMarker(selected);
        setSelected({});
        if (JSON.stringify(marker) === JSON.stringify(markerPending)) {
          setMarkerPending({});
        }
      }
    });
  }

  function lc_editMarker() {
    const sport = document.querySelector(
      "form[id='markerform'] input[name='sport']"
    ).value;
    const timerange = {
      start: startTime,
      end: endTime,
    };
    markers.map((marker, index) => {
      if (marker.lat === selected.lat && marker.lng === selected.lng) {
        markers[index].sport = sport;
        markers[index].time = timerange;
      }
    });
    pushMarker(selected);
    setSelected({});
    setMarkerPending({});
  }

  function Information() {
    if (showingInfo && Object.keys(selected).length > 0) {
    return (
      <InfoWindowF
        position={{ lat: selected.lat, lng: selected.lng }}
        onCloseClick={() => {
          setSInfo(false)
        }}
      >
        <div>
          <h2>
            <span>{selected.sport}</span>
          </h2>
          <p>{selected.time.start + " - " + selected.time.end}</p>
          <button onClick={lc_removeMarker}>Törlés</button>
        </div>
      </InfoWindowF>
    );}
    return null;
  }



  /* #endregion */

  /* #region  Locate Me */
  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
  }, []);
  /* #endregion */

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

      <div className="Main">
        {/* Users list */}
        <div className="users-list">
          <button onClick={() => setMarkers(loggedUser.markers)}>MY markers</button>
          <div>
            <ul>
              {users.map((user, index) => {
                return (
                  <div
                    key={index}
                    className="user-box"
                    onClick={() => {
                      setMarkers(user.markers)
                    }}
                  >
                    <span key={user._id}>{user.username}</span>
                    <ul>
                      {user.markers.map((marker, index) => {
                        return (
                          <li className="listed-marker" key={index}>
                            <span>{marker.sport}</span>
                            <span>{marker.time.start + " - " + marker.time.end}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </ul>
          </div>
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
                  lat: parseFloat(marker.lat),
                  lng: parseFloat(marker.lng),
                }}
                onClick={() => {
                  setSelected(marker);
                  setSInfo(true);
                }}
              />
            ))}
            <Information />
          </GoogleMap>
        </div>
        {/* Marker Settings */}
        <div className="set-marker">
          <form id="markerform">
            <span>Sport</span>
            <input type={"text"} name={"sport"} defaultValue=""></input>
            <span>Kezdés</span>
            <TimePicker
              disableClock
              onChange={setStartTime}
              value={startTime}
            />
            <span>Vége</span>
            <TimePicker
              disableClock
              onChange={(e) => setEndTime(e)}
              value={endTime}
            />
            <button type={"button"} onClick={lc_editMarker}>
              Felvesz
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
