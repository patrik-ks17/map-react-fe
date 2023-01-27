import { useState, useEffect } from 'react';


export function GetMarkers() {
	const [markers, setMarkers] = useState([]);
	  fetch("http://localhost:9000/markers/63d3a08f86b7d699776ca56c")
		 .then((res) => res.json())
		 .then((resp) => setMarkers(resp.markers)
		 )
		 .catch(console.log)
		
	return (
		<div>
				{markers.map((marker) => (
					<div key={marker.lat}>
						<p>{marker.lat}</p>
						<p>{marker.lng}</p>
					</div>
				))}
		</div>
	);
}
 