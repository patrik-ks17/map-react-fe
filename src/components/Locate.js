export default function Locate({ panTo }) {
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