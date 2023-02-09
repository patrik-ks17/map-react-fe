export default function Validate(values) { 
	const errors = {};
	const regex = /^[0-9a-z\.-]+@([0-9a-z-]+\.)+[a-z]{2,4}$/i;
	const filter = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])/;
	if (!values.username) {
	  errors.username = "Felhasználónév kötelező!"
	} else if (values.username.length < 4) { 
	  errors.username = "Felhasználónév túl rövid!"
	}
	if (!values.email) {
	  errors.email = "Email cím kötelező!"
	} else if (!regex.test(values.email)) {
	  errors.email = "Nem érvényes email cím formátum!"
	}
	if (!values.password) {
	  errors.password = "Jelszó kötelező!"
	} else if (!filter.test(values.password)) { 
	  errors.password = "Tartalmaznia kell kis- és nagybetűket és számokat!";
	}else if (values.password.length < 4) {
	  errors.password = "A jelszó túl rövid!"
	} else if (values.password.length > 15) {
	  errors.password = "A jelszó túl hosszú!"
	} 
	if (!values.passagain) {
	  errors.passagain = "Ismételje meg a jelszót!"
	} else if (values.password !== values.passagain) {
	  errors.passagain = "A két jelszó nem eggyezik!"
	} 
	return errors;
 }