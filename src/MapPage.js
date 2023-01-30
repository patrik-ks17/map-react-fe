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

export default function MapPage() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });  

  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null); 
  const [timerange, setTimerange] = useState(["",""]);

  async function fetchMarkers() {
    const response = await fetch(
      "http://localhost:9000/markers/63d7924d1b5708dd2fe01f70"
    );
    const json = await response.json();
    setMarkers(json.markers);
  }
  useEffect(() => {
    fetchMarkers();
  }, []);

  async function updateMarkers(selected) {
    const body = JSON.stringify(selected);
    const response = await fetch(
      `http://localhost:9000/markers/63d7924d1b5708dd2fe01f70`,
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

  async function deleteMarker(selected) {
    const body = JSON.stringify(selected);
    const response = await fetch(
      `http://localhost:9000/markers/63d7924d1b5708dd2fe01f70`,
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
    if (sport == "") {
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
        deleteMarker(selected);
        setSelected(null);
      }
    });
  }

  function addMarker() {
    const sport = document.querySelector(
      "form[id='markerform'] input[name='sport']"
    ).value;
    markers.map((marker, index) => {
      if (marker.lat == selected.lat && marker.lng == selected.lng) {
        markers[index].sport = sport;
        markers[index].timerange = timerange;
      }
    });
    updateMarkers(selected);
  }

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
  }, []);

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
        {/* Google Map */}
        <div style={{ width: "50%" }}>
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
