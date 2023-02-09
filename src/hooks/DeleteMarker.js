async function DeleteMarker(selected) {
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
	  alert.error("Marker törlése sikertelen");
	  return;
	}
	//const json = await response.json();
 }

export default DeleteMarker