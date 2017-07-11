//Funkcja rysująca zakładke "SPRAWDŹ REZERWACJĘ"
function drawCheckReserv() {
    var drawDoc = document.getElementsByClassName("w3-content")[0];
    drawDoc.innerHTML = `
	  <!-- The Contact Section -->
  <div class="w3-container w3-content w3-padding-32" style="max-width:800px" id="contact">
    <h2 class="w3-wide w3-center">Sprawdź rezerwację</h2>
    <p class="w3-opacity w3-center"><i>Twoja podróż marzeń!</i></p>
    <div class="w3-row w3-padding-16">
     
      <div class="w3-col m12">
       
          <div class="w3-row-padding" style="margin:0 -16px 8px -16px">
            <div class="w3-half">
			
			
			<div class="dropdown">
				Imię
              <input class="imie w3-input w3-border" type="text"  id="imie" placeholder="Podaj swoje imię" data-name="imie"  name="Imie">
			  <div class="skad-dropdown-content">
			  </div>
			</div>

            </div>
		
            <div class="w3-half w3-margin-bottom">
			<div class="dropdown">
			Nazwisko
              <input class="nazwisko w3-input w3-border" id="nazwisko" type="text" placeholder="Podaj swoje nazwisko" required data-name="nazwisko" name="nazwisko">
			   <div class="dokad-dropdown-content">
			  </div>
			</div>
            </div>
			
			 <div class="w3-half ">
          
			ID pasażera
			<input class="id_pasazera-skad w3-input w3-border" id="id_pasazera" type="text" data-name="id_pasazera" placeholder="Podaj swoje id nadane, przy rezerwacji"  name="id_pasazera">
			<!-- trzeba dodac required-->
		  </div>
		   
		  <div class="w3-center">
          <button class="checkbtn w3-button w3-wide w3-xlarge w3-black w3-section" onclick="checkReservation()" type="text">Sprawdź</button>
		  </div>
		  
		   </div>
      
      </div>
    </div>
  </div>
	`;



    // DO USUNIECA
    document.getElementById("imie").value = "GRZEGORZ";
    document.getElementById("nazwisko").value = "BIEDROŃ";
    document.getElementById("id_pasazera").value = 3;
}

//Funkcja która na podstawie wpisanych danych w zakładce "SPRAWDZ REZERWACJĘ" sprawdza czy dane wpisane przez 
// uzytkownika są prawidłowe oraz sprawdza czy użytkownik ma zarezerwowane bilety.
//W przypadku nieprawidłowych danych lub danych, które nie znajdują się w bazie pokazuje stosowny komunikat.
function checkReservation() {
    var container = document.getElementsByClassName("w3-row w3-padding-16")[0];



    var imie = document.getElementById("imie").value;
    imie = imie.toUpperCase();
    var nazwisko = document.getElementById("nazwisko").value;
    nazwisko = nazwisko.toUpperCase();
    var idPasazera = document.getElementById("id_pasazera").value;

    var dataPassenger = alasql(`
	SELECT B.NR_BILETU, B.CENA, B.MIEJSCE, L.NR_LOTU, P.IMIE, P.NAZWISKO, L.DZIEN,L.GODZINA 
		FROM 
		BILETY B, ZAKUPIONE Z, PASAZER P, LOTY L 
		WHERE 
		B.BILETY_NR_LOTU = L.NR_LOTU AND 
		B.NR_BILETU=Z.NR_BILETU AND 
		P.ID_PAS = Z.ID_PAS AND 
		P.IMIE = '` + imie + `' AND 
		P.NAZWISKO = '` + nazwisko + `' AND 
		P.ID_PAS = ` + idPasazera + ` 
		ORDER BY NR_BILETU 
`);


    if (dataPassenger.length <= 0) {
        if (!document.getElementById("wrongdata")) {
            document.getElementsByClassName("w3-container w3-content w3-padding-32")[0].innerHTML += `<p id="wrongdata">Nieprawidłowe dane<p>`;

        }
        return;
    }


    var addToHtml = `  <div class="w3-panel w3-card"><p>Imie i nazwisko pasażera: <b>` + dataPassenger[0].IMIE + ` ` + dataPassenger[0].NAZWISKO + `</b></p></div>`;

    addToHtml += `
<table class="w3-table w3-small  w3-centered" style="display:table;">
    <tr>
      <th>NR BILETU</th>
	  <th>NR_LOTU</th>
      <th>CENA</th>
      <th>MIEJSCE</th>
      <th>DZIEN</th>
      <th>GODZINA</th>
      <th>WYLOT Z </th>
      <th>PRZYLOT DO</th>
    </tr>
	`;
    for (var i = 0; i < dataPassenger.length; i++) {

        var miastoA = alasql(`
		Select NAZWA
		FROM LOTY L, MIASTA M, TRASA T
		WHERE
		T.ID_TRASY = L.TRASA_ID_TRASY AND
		M.NR_MIASTA = T.MIASTA_NR_MIASTA AND
		L.NR_LOTU=` + dataPassenger[i].NR_LOTU + `		
		;
  `);
        var miastoB = alasql(`
		Select NAZWA
		FROM LOTY L, MIASTA M, TRASA T
		WHERE
		T.ID_TRASY = L.TRASA_ID_TRASY AND
		M.NR_MIASTA = T.MIASTA_NR_MIASTA2 AND
		L.NR_LOTU=` + dataPassenger[i].NR_LOTU + `		
		;
  `);
        miastoA = miastoA[0].NAZWA;
        miastoB = miastoB[0].NAZWA;

        addToHtml += ` <tr> 
      <td>` + dataPassenger[i].NR_BILETU + `</td>
	  <td>` + dataPassenger[i].NR_LOTU + `</td>
      <td>` + dataPassenger[i].CENA + ` zł</td>
      <td>` + dataPassenger[i].MIEJSCE + `</td>
      <td>` + dataPassenger[i].DZIEN + `</td>
      <td>` + dataPassenger[i].GODZINA + `</td>
      <td>` + miastoA + `</td>
      <td>` + miastoB + `</td>
    </tr> `;

    }
    addToHtml += ` </table>`;




    container.innerHTML = addToHtml;
}