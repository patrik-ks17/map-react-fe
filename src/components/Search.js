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
		 panTo({ lat, lng });
	  } catch (error) {
		 console.log("Error: ", error);
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