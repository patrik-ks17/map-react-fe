import { useCallback, useRef } from "react";
import mapStyles from "../../assets/mapStyles";
import { GoogleMap, Marker, InfoWindowF } from "@react-google-maps/api";
import { useAlert } from "react-alert";

const mapContainerStyle = {
  width: "45rem",
  height: "25rem",
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

function Map({
  showingInfo,
  setShowingInfo,
  markers,
  setMarkers,
  selected,
  setSelected,
  startTime,
  endTime,
  markerPending,
  setMarkerPending,
  deleteMarker,
}) {
  // a
  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    
  }, []);
  // pass them to header
  

  const alert = useAlert();
  
  const onMapClick = (event) => {
    if (Object.keys(markerPending).length === 0) {
      const sport = document.querySelector(
        "form[id='markerform'] input[name='sport']"
      ).value;
      if (sport === "") {
        alert.show("Add meg a sport tevékenységet!");
        return;
      } else if (startTime === "0:00" || endTime === "0:00") {
        alert.show("Add meg az időpontot!");
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
        setShowingInfo(true);
        setMarkers((current) => [...current, newMarker]);
      }
    } else {
      return alert.show("Van kijelölt jelölő!");
    }
  };

  function Information() {
    if (showingInfo && Object.keys(selected).length > 0) {
      return (
        <InfoWindowF
          position={{ lat: selected.lat, lng: selected.lng }}
          onCloseClick={() => {
            setShowingInfo(false);
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
      );
    }
    return null;
  }

  function lc_removeMarker() {
    markers.map((marker, index) => {
      if (JSON.stringify(marker) === JSON.stringify(selected)) {
        markers.splice(index, 1);
        deleteMarker(selected);
        alert.success("Jelölő sikeresen törölve!");
        setSelected({});
        if (JSON.stringify(marker) === JSON.stringify(markerPending)) {
          setMarkerPending({});
        }
      }
    });
  }

  return (
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
              setShowingInfo(true);
            }}
          />
        ))}
        <Information />
      </GoogleMap>
    </div>
  );
}

export default Map;
