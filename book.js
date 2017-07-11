	var clicked = false;

	
	//Funkcja akcji dla kliknięcia przycisku Rezerwuj.
	// Pokazuje ekran rezerwacji do wypełnienia danymi użytkownika tj. imię oraz nazwisko
	function bookTicket(getNrLotu, element) {

	    var drawDoc = document.getElementsByClassName("w3-panel w3-card")[0];
	    element = element.parentElement.parentElement;

	    var findhour = element.getElementsByTagName("p")[0].innerHTML;
	    var cut = findhour.indexOf(":") - 2;
	    findhour = findhour.slice(cut, cut + 8);
	    var drawDoc = element;

	    var checkhour =
	        alasql(`
	SELECT distinct(NR_LOTU) AS NR_LOTU,DZIEN, GODZINA,NAZWA
FROM TRASA T, LOTY L, MIASTA M
WHERE MIASTA_NR_MIASTA=` + nrMiastaA + ` and MIASTA_NR_MIASTA2=` + nrMiastaB + ` AND L.TRASA_ID_TRASY=T.ID_TRASY  AND M.NR_MIASTA=T.MIASTA_NR_MIASTA2 AND L.DZIEN='` + userChoice.fromData + `' AND L.GODZINA ='` + findhour + `'
	`);

	    var nrLotu = checkhour[0].NR_LOTU;
	    console.log(checkhour[0].NR_LOTU, "checkhour[0].NR_LOTU");
	    var whichfly = alasql(`
		SELECT NR_BILETU
		FROM BILETY
		WHERE BILETY_NR_LOTU=` + nrLotu + `AND
		DOSTEPNOSC=1
		
		`);

	    var nrBiletu = whichfly[0].NR_BILETU;
	    console.log(nrBiletu, " nrBiletu");
	    var addtoHTML = `

		
		<div class="w3-container w3-blue">
  <h2>Rezerwacja biletu</h2>
</div>

<div class="w3-row">
  <p>
  <label>Imię</label>
  <input class="imie w3-input" type="text"></p>
  <p>
  <label>Nazwisko</label>
  <input class="nazwisko w3-input" type="text"></p>
  <p onclick = "checkCheckbox()">Jestem klientem i posiadam id pasażera
  <input type="checkbox" id="chkbox" name="vehicle" value="Bike" ><p/>
  <input class="id_pasazera w3-input" id="id_pas" type="number" disabled><br>
  
 <button class="w3-button w3-green" onclick="makeReservation(` + nrBiletu + `)">REZERWUJ</button>
</div>`;

	    drawDoc.innerHTML = addtoHTML;


	}
	//Funkcja sprawdzająca czy użytkownik był już klientem, poprzez zaznaczenie checkboxa z id pasażera
function checkCheckbox(){
	if(document.getElementById("chkbox").checked === true){	
	 document.getElementById("chkbox").checked = false;
	 document.getElementById("id_pas").disabled = true;
	}
	else if(document.getElementById("chkbox").checked === false){
		document.getElementById("chkbox").checked = true;
		 document.getElementById("id_pas").disabled = false;
		
	}
}
	// Funkcja akcji dla kliknięcia przycisku Rezerwuj. Po wypełnieniu danych tj. imię i nazwisko oraz jeśli był już klientem id pasażera.
	// W przypadku nowego klienta nadaje użytkownikowi unikalne id, dzięki, kóremu użytkownik, może sprawdzić swoje rezerwacje.
	function makeReservation(nrbiletu) {
	    var id_pasazera;
	    var imie = document.getElementsByClassName("imie")[0].value;
	    imie = imie.toUpperCase();
	    var nazwisko = document.getElementsByClassName("nazwisko")[0].value;
	    nazwisko = nazwisko.toUpperCase();
	    if (imie === "" && nazwisko === "") {
	        document.getElementsByClassName("imie")[0].style.outline = "1px solid red";;
	        document.getElementsByClassName("nazwisko")[0].style.outline = "1px solid red";
	        return;
	    }
	    if (imie === "") {
	        document.getElementsByClassName("imie")[0].style.outline = "1px solid red";
	        return;
	    } else if (nazwisko === "") {
	        document.getElementsByClassName("nazwisko")[0].style.outline = "1px solid red";
	        return;
	    }
		
		var id_pas_from_user =  document.getElementById("id_pas").value;
		if(id_pas_from_user===""){
			id_pas_from_user = -2;//puste
		}
	   var id_pas = alasql(`
		SELECT ID_PAS
		FROM PASAZER 
		WHERE IMIE = '` + imie + `' AND
		NAZWISKO = '` + nazwisko + `' AND
		ID_PAS = `+id_pas_from_user+`
		;
		`);
		
	    if (id_pas.length > 0) {
		//znalazł w bazie
	        id_pas = id_pas[0].ID_PAS;

	        id_pasazera = id_pas;

	        alasql(`
			INSERT INTO ZAKUPIONE (NR_BILETU, ID_PAS) VALUES(` + nrbiletu + `,` + id_pas + `);
		`);

	    } 
		else {
			// nie ma w bazie 
			if(id_pas_from_user!==-2){
		id_pas_from_user=-1; //nieprawidłowe
			}
	        alasql(`
				INSERT INTO PASAZER (ID_PAS, IMIE, NAZWISKO) VALUES (NULL,'` + imie + `','` + nazwisko + `');
				`);

	        id_pasazera = alasql(`
				SELECT ID_PAS
			FROM PASAZER 
			WHERE IMIE = '` + imie + `' AND
			NAZWISKO = '` + nazwisko + `';
			`);

	        id_pasazera = id_pasazera[0].ID_PAS;

	        var showit = `
				INSERT INTO ZAKUPIONE (NR_BILETU, ID_PAS) VALUES( ` + nrbiletu + ` , ` + id_pasazera + ` )
			`;

	        alasql(showit);
	    }
	    alasql(`UPDATE BILETY SET DOSTEPNOSC = 0 WHERE NR_BILETU =` + nrbiletu + ` ;`)
		
		if(id_pas_from_user===-1){
			
	    document.getElementsByClassName("w3-panel w3-card")[0].innerHTML = `<p>Gratulacje. Twój bilet został zarezerwowany. Twoje id było nieprawidłowe, nadaliśmy Ci nowe. </p><p>Twój id: ` + id_pasazera + ` </p><p>Nr biletu: ` + nrbiletu + ` </p>`;			
		}

		else{
	    document.getElementsByClassName("w3-panel w3-card")[0].innerHTML = `<p>Gratulacje. Twój bilet został zarezerwowany. Za pomocą id możesz sprawdzić swój stan rezerwacji.</p><p>Twój id: ` + id_pasazera + ` </p><p>Nr biletu: ` + nrbiletu + ` </p>`;
		}
	}