async function PushMarker(selected) {
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
    alert.error("Marker hozzáadás sikertelen");
    return;
  }
  // const json = await response.json();
}

export default PushMarker;
