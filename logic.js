var cena;
var timer;
var timer2;
var nrMiastaA;
var nrMiastaB;
var nr_lotu;
//Funkcja pokazująca podstawowe informacje o lotach wybranych przez użytkownika
function showTickets() {

    var container = document.getElementsByClassName("w3-content")[0];
    nrMiastaA = alasql(`
	SELECT NR_MIASTA
FROM  MIASTA
WHERE NAZWA="` + userChoice.fromWhere[0].NAZWA + `"
	`);
    nrMiastaA = nrMiastaA[0].NR_MIASTA;
    nrMiastaB = alasql(`
	SELECT NR_MIASTA
FROM  MIASTA
WHERE NAZWA="` + userChoice.toWhere[0].NAZWA + `"
	`);
    nrMiastaB = nrMiastaB[0].NR_MIASTA;
    var rootCity = alasql(`
	SELECT NAZWA
FROM  MIASTA
WHERE NR_MIASTA=` + nrMiastaA + `
	`);
    rootCity = rootCity[0].NAZWA;
    var arrayOfData = alasql(`
	SELECT distinct(NR_LOTU) AS NR_LOTU,DZIEN, GODZINA,NAZWA
FROM TRASA T, LOTY L, MIASTA M
WHERE MIASTA_NR_MIASTA=` + nrMiastaA + ` and MIASTA_NR_MIASTA2=` + nrMiastaB + ` AND L.TRASA_ID_TRASY=T.ID_TRASY  AND M.NR_MIASTA=T.MIASTA_NR_MIASTA2 AND L.DZIEN="` + userChoice.fromData + `"
	`);
    var dataContainer = document.getElementsByClassName("center-content")[0];


    if (arrayOfData.length <= 0) {
        dataContainer.innerHTML += '<div class="w3-panel w3-card"><p>Niestety, wszystkie bilety zostały wyprzedane w tym dniu</p></div>';
        return
    }

    nr_lotu = arrayOfData[0].NR_LOTU;

    var checkFreeTickets = alasql(`SELECT CENA FROM BILETY WHERE DOSTEPNOSC=1 AND BILETY.BILETY_NR_LOTU=` + nr_lotu + `;`);
    if (checkFreeTickets.length <= 0) {
        dataContainer.innerHTML += '<div class="w3-panel w3-card"><p>Niestety, wszystkie bilety zostały wyprzedane w tym dniu</p></div>';
        return;
    }


    if (arrayOfData.length > 0) {

        for (var i = 0; i < arrayOfData.length; i++) {
            cena = checkFreeTickets[0].CENA;
            nr_lotu = arrayOfData[i].NR_LOTU;

            if (alasql(`SELECT CENA FROM BILETY WHERE DOSTEPNOSC=1 AND BILETY.BILETY_NR_LOTU=` + nr_lotu + `;`).length == 0) {
                console.log("continue");
                continue;
            }
            console.log(i, 'i');

            dataContainer.innerHTML += '<div class="w3-panel w3-card"><p>' + arrayOfData[i].DZIEN + ' ' + arrayOfData[i].GODZINA + ' <b>' + rootCity + ' - ' + arrayOfData[i].NAZWA + `</b></p>
	<div class="w3-section">
        <button class="show-details w3-button w3-green" onclick="showDetails(this)">Szczegóły</button>
        <button class="w3-button w3-red" onclick="bookTicket(` + nr_lotu + `,this)">Rezerwuj</button>
      </div>
	</div>`;
        }
        timer = setTimeout(callback, 2);
        loading.hide();

    } else {
        dataContainer.innerHTML += '<div class="w3-panel w3-card"><p>Niestety nie ma lotów w tym dniu</p></div>';
        return;
    }


}


// Funkcja dla polepszenia asynchroniczności - pokazanie animacji ładowania zanim zacznie przeszukiwać tabele
// a także ukrycie szczegółowych informacji o locie
function callback() {

    var z = document.getElementsByClassName("show-details");
    for (var i = z.length - 1; i >= 0; i--) {
        showDetails(z[i]);
    }
    loading.show();
    clearTimeout(timer);

    var x = document.getElementsByClassName("w3-table");
    for (var i = 0; i < x.length; i++) {
        if (x[i].style.display == "table") {
            x[i].style.display = "none";
        }
    }
}

// Pokazanie szczegółowych informacji o locie, poniżej klikniętego przycisku
function showDetails(elem) {



    var z = elem.parentElement.parentElement;

    var x = document.getElementsByClassName("w3-table");
    for (var i = 0; i < x.length; i++) {
        if (x[i].style.display == "table") {
            x[i].style.display = "none";

        }
    }


    //check if user clicked same element


    if (document.getElementsByClassName("w3-table").length > 0 &&
        z.getElementsByClassName("w3-table")[0] != null) {
        if (z.getElementsByClassName("w3-table")[0].style.display == "none")

        {
            z.getElementsByTagName("table")[0].style.display = "table";
            return;
        }
    }
    elem = elem.parentElement.parentElement;


    var addToHtml = elem;



    elem = elem.getElementsByTagName("p")[0].innerHTML;


    var cut = elem.indexOf(":") - 2;
    elem = elem.slice(cut, cut + 8);


    var zapytanie = `
		SELECT NR_LOTU, ODLEGLOSC
		FROM TRASA T, LOTY L, MIASTA M
		WHERE MIASTA_NR_MIASTA=` + nrMiastaA + ` and 
		MIASTA_NR_MIASTA2=` + nrMiastaB + ` AND 
		L.TRASA_ID_TRASY=T.ID_TRASY  AND 
		M.NR_MIASTA=T.MIASTA_NR_MIASTA2 AND 
		L.TRASA_ID_TRASY=T.ID_TRASY  AND 
		M.NR_MIASTA=T.MIASTA_NR_MIASTA2 AND
		L.GODZINA ='` + elem + `' AND
		L.DZIEN = '` + userChoice.fromData + `' 
		order by NR_LOTU;
		`;
    var dataFromSql = alasql(zapytanie);
    var pilot = alasql(`SELECT IMIE,NAZWISKO
		FROM PILOTUJE_LOT PILOTUJE, PILOT PIL
		WHERE 
		PILOTUJE.PILOT_NR_PESEL=PIL.NR_PESEL AND
		PILOTUJE.LOTY_NR_LOTU = 1;`);


    var samolot = alasql(`
		SELECT DISTINCT(NR_LOTU) AS NR_LOTU, NAZWA_PRZEW, NAZWA_SAMOLOTU FROM
		PRZEWOZNIK PRZEW, SAMOLOT S, LOTY L
		WHERE 
		L.NR_LOTU = PRZEW.PRZEW_NR_LOTU AND
		S.NR_ID = L.SAMOLOT_NR_ID AND
		PRZEW_NR_LOTU=` + dataFromSql[0].NR_LOTU + `;
`);
    samolot = samolot[0];



    addToHtml.innerHTML += `
	<table class="w3-table" style="display:table;">
    <tr>
      <th>Nr lotu</th>
      <th>Odległość</th>
      <th>Pilot</th>
      <th>Przewoźnik</th>
      <th>Samolot</th>
      <th>Cena</th>
    </tr>
    <tr>
      <td>` + dataFromSql[0].NR_LOTU + `</td>
      <td>` + dataFromSql[0].ODLEGLOSC + ` km</td>
      <td>` + pilot[0].IMIE + ` ` + pilot[0].NAZWISKO + `</td>
      <td>` + samolot.NAZWA_PRZEW + `</td>
      <td>` + samolot.NAZWA_SAMOLOTU + `</td>
      <td>` + cena + ` zł</td>
    </tr>
    
  </table>`;


}