import { useCallback, useState, useRef, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindowF,
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import mapStyles from "./mapStyles";
import TimeRangePicker from '@wojtekmaj/react-timerange-picker';
import {GetMarkers} from "./GetMarkers";


const libraries = ["places"];
const mapContainerStyle = {
  width: "150vh",
  height: "60vh",
};
const center = {
  lat: 43.6532,
  lng: -79.3832,
};
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};

export default function Home() {
  async function addMarkers(markers) {
		const body = JSON.stringify(markers)
		const response = await fetch(`http://localhost:9000/marker/63d3a08f86b7d699776ca56c`, { 
					method: "POST",
					body: body,
					headers: {
						'content-type':'application/json'
					}
				})
		if (!response.ok) {
			alert('Failed to add markers')
			return
		}
	}
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  

  const [markers, setMarkers] = useState([]);
  useEffect(() => {
    async function fetchMarkers() {
      const response = await fetch("http://localhost:9000/markers/63d3a08f86b7d699776ca56c")
      const json = await response.json();
      setMarkers(json.markers);
      }
  })


  const [selected, setSelected] = useState(null);
  const [timerange, setTimerange] = useState(['10:00', '11:00']);

  
  const onMapClick = useCallback((event) => {
    setMarkers((current) => [
      ...current,
      {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        time: new Date().toUTCString(),
      },
    ]);
  }, []);

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
      <div className="functions">
        <h1>Logo</h1>
        <Search panTo={panTo} />
        <Locate panTo={panTo} />
      </div>

      <div style={{display: "flex"}}>
        <div style={{ width: "50%" }}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={8}
            center={center}
            options={options}
            onClick={onMapClick}
            onLoad={onMapLoad}
          >
            {markers.map((marker) => (
              <Marker
                key={`${marker.lat}-${marker.lng}`}
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
                    <span >Sport</span>
                  </h2>
                  <p>Időpont</p>
                  <button
                    onClick={() => {
                      markers.map((marker, index) => {
                        if (JSON.stringify(marker) === JSON.stringify(selected)) {
                          delete markers[index];
                          setSelected(null);
                        }
                      });
                    }}
                  >
                    Törlés
                  </button>
                </div>
              </InfoWindowF>
            ) : null}
          </GoogleMap>
        </div>

        <div className="set-marker">
          <span>Sport</span>
          <input type={"text"}></input>
          <span>Időpont</span>
          <TimeRangePicker disableClock onChange={setTimerange} value={timerange}/>
          <button type={"button"} onClick={() => {addMarkers(markers)}}>Felvesz</button>               
        </div>
      </div>
    </div>
  );
}

function Locate({ panTo }) {
  return (
    <button
      className="locate"
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            panTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => null
        );
      }}
    >
      <img style={{width: '60px'}} src="icon/location.png" alt="compass - locate me" />
    </button>
  );
}

function Search({ panTo }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 43.653225, lng: () => -79.383186 },
      radius: 200 * 1000,
    },
  });

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      panTo({ lat, lng });
    } catch (error) {
      console.log("😱 Error: ", error);
    }
  };

  return (
    <div className="search">
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Enter an address"
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ id, description }) => (
                <ComboboxOption key={id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}
