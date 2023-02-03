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

export default function Search({ panTo }) {
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
		 panTo({ lat, lng }, 8);
	  } catch (error) {
		 console.log("Error: ", error);
	  }
	};
 
	return (
	  <div className="search">
		<img src="icon/search.png" alt="search icon" />
		 <Combobox onSelect={handleSelect}>
			<ComboboxInput
			  value={value}
			  onChange={handleInput}
			  disabled={!ready}
			  placeholder="Írj be egy címet"
			/>
			<ComboboxPopover className="search-list">
			  <ComboboxList>
				 {status === "OK" &&
					data.map(({ id, description }) => (
					  <ComboboxOption key={id} value={description} className="search-options"/>
					))}
			  </ComboboxList>
			</ComboboxPopover>
		 </Combobox>
	  </div>
	);
 }