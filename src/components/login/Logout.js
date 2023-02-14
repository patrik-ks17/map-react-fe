export default function Logout(alert) {
	window.localStorage.setItem("loggedIn", false);
	window.localStorage.removeItem("token");
	window.localStorage.removeItem("userType");
	alert.success("Sikeresen Kijelentkezett!");
	setTimeout(() => {
		window.location.reload(false);	
	}, 2000);
 }