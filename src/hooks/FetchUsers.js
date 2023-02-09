async function FetchUsers(setUsers) {
	const response = await fetch(`http://localhost:9000/get-alldata`, {
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
	});
	if (!response.ok) {
	  alert.error("Sikertelen adat lekérdezés");
	  return;
	}
	const json = await response.json();
	if (json.data==='token expired') {
		alert("token expired, login again");
		window.localStorage.removeItem("token");
		window.localStorage.setItem("loggedIn", false);
	}
	else {
		setUsers(json.data);
	}
 }

export default FetchUsers