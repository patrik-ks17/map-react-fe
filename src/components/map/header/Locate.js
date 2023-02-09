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
          (error) => console.log(error)
        );
      }}
    >
      <img src="icon/map/location.png" alt="compass - locate me" />
      <span>My location</span>
    </button>
  );
}
