async function FetchMarkers(setMarkers, setLoggedUser) {
  fetch(`http://localhost:9000/get-userdata`, {
    method: "POST",
    crossDomain: true,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      token: window.localStorage.getItem("token"),
    }),
  })
    .then((response) =>
      !response.ok ? alert.error("Sikertelen lekérdezés") : response.json()
    )
    .then((data) => {
      if (data.data === 'token expired') {
        alert("token expired, login again");
        window.localStorage.removeItem("token");
        window.localStorage.setItem("loggedIn", false);
      }
      else {
        setMarkers(data.data.markers);
        setLoggedUser(data.data);
      }
      
    });
}

export default FetchMarkers;
