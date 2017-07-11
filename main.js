	//setup
	var userChoice=null;
	// Funkcja inicjalizująca wstępne właściwości obiektów po załadowaniu strony
		function setup(){
			
			var x=document.getElementsByClassName("skad")[0];
			x.addEventListener("keyup", loadFromCitiesToFirstPage);
			x=document.getElementsByClassName("dokad")[0];
			x.addEventListener("keyup", loadToWhereCitiesToFirstPage);			
			
			
			document.getElementsByClassName("szukaj")[0].addEventListener("click", function(){
				userChoice =new userData();
					if(checkCities()){
						
						changeLayout();/*loading.hide();*/showTickets(); 
					}
					else{
						 document.getElementsByClassName("skad")[0].style.outline="6px solid red";
						 document.getElementsByClassName("dokad")[0].style.outline="6px solid red";
					}
				});
			
		}
		window.addEventListener('DOMContentLoaded', setup);
		
		
//Funkcja którą przeszuka tabele z miastami i na podstawie tego co wpisze user do pola "Miejsce wylotu" pokaze pasujące miasta
function loadFromCitiesToFirstPage(){
	var city=document.getElementsByClassName("skad")[0].value;
	city=city.toUpperCase();
	var res = alasql("SELECT NAZWA FROM MIASTA;");
	var temp = document.getElementsByClassName("skad-dropdown-content")[0];
	temp.style.display="block";
	temp.innerHTML="";
	var counter=0;
	var whatType=Object.keys(res[0]);
	for(var i=0;i<res.length;i+=1){
		if(res[i].NAZWA.indexOf(city)>=0)
		{
			var replacecity = res[i][whatType];
			var p ='<p class="list-from-element" onclick="fillCity(this)">'+replacecity+'</p>';
			
			
			temp.innerHTML+=p;
			counter+=1;
		}
		if(counter>=5)
		{break;}
	}
		if(!document.getElementsByClassName("list-from-element")[0]){
		temp.style.display="none";
	}
}

//Funkcja którą przeszuka tabele z miastami i na podstawie tego co wpisze user do pola "Miejsce przylotu" zaprezentuje pasujące miasta w formie listy
function loadToWhereCitiesToFirstPage(){
	var city=document.getElementsByClassName("dokad")[0].value;
	city=city.toUpperCase();	
	var res = alasql("SELECT NAZWA FROM MIASTA;");
	var temp = document.getElementsByClassName("dokad-dropdown-content")[0];
	temp.style.display="block";
	temp.innerHTML="";
	var counter=0;
	var whatType=Object.keys(res[0]);
	for(var i=0;i<res.length;i+=1){
		if(res[i].NAZWA.indexOf(city)>=0)
		{
			var replacecity = res[i][whatType];
			//replacecity = replacecity.replace(" "," , "); //-------------------------------------------------KONKATENACJA
			var p ='<p class="list-to-where-element" onclick="fillCity(this)">'+replacecity+'</p>';
			temp.innerHTML+=p;
			counter+=1;
		}
		if(counter>=5)
		{break;}
	}
	if(!document.getElementsByClassName("list-to-where-element")[0]){
		temp.style.display="none";
	}
	
}
//akcja dla wybrania miasta z listy miast. Dla pól Miejsce wylotu oraz Miejsce przylotu
function fillCity(whichelement){
	
		switch(whichelement.className){
			case "list-from-element":
			whichelement.parentNode.parentNode.getElementsByTagName("input")[0].value=whichelement.innerHTML;
			document.getElementsByClassName("skad-dropdown-content")[0].style.display="none";
			break;
			case "list-to-where-element":
			whichelement.parentNode.parentNode.getElementsByTagName("input")[0].value=whichelement.innerHTML;
			document.getElementsByClassName("dokad-dropdown-content")[0].style.display="none";
			break;
		}
}
// Funkcja tworzy elementu pokazujące bilety wg preferencji wybranych przez użytkownika
function changeLayout(){
	document.getElementsByClassName("w3-content")[0].innerHTML=
	`<div class="w3-row marginBottom">
	<div class="w3-bar">
  <button class="go-back-btn w3-button w3-left w3-black w3-padding-16 w3-margin-bottom w3-margin-left">POWRÓT</button>
  
</div>
  <div class="left-row w3-col w3-container w3-center" style="width:10%"></div>
  <div class="center-row w3-col w3-blue w3-container w3-center" style="background-color:#4caf50!important;width:80%"><p>Loty</p></div>
  <div class="right-row w3-col w3-container w3-center" style="width:10%"></div>
</div>`;

document.getElementsByClassName("w3-content")[0].innerHTML+=`<div class="w3-row">
  <div class="left-content w3-col w3-container w3-center" style="width:20%"></div>
  <div class="center-content w3-col w3-container w3-center" style="width:60%"></div>
  <div class="right-content w3-col w3-container w3-center" style="width:20%"></div>
</div>`;
//dodanie akcji dla przycisku powrotu
var x=document.getElementsByClassName("go-back-btn")[0];
	x.addEventListener("click", goBack);
	
}
// Funkcja pokazująca  lub ukrywająca ładującą animacje
var loading ={
	
		hide:function(){

			document.getElementsByClassName("w3-content")[0].style.opacity=0.2;
			document.getElementsByClassName("w3-center")[0].innerHTML+='<div class="loader-container" ><div class="loader" ></div></div>';
		
		},
		show:function(){

			document.getElementsByClassName("w3-content")[0].style.opacity=1;
			document.getElementsByClassName("loader-container")[0].outerHTML="";
			
			}
	
}
//Funkcja sprawdzająca czy wpisane przez użytkownika miasta są prawidłowe np. czy jedno z miast jest miastem "KATOWICE"
function checkCities(){
	if(userChoice.fromWhere.length===1 && userChoice.fromWhere!==undefined&&
	userChoice.toWhere.length===1&& userChoice.toWhere!==undefined){
		if((userChoice.fromWhere[0].NAZWA.indexOf("KATOWICE")>=0 || userChoice.toWhere[0].NAZWA.indexOf("KATOWICE")>=0) &&
				!(userChoice.fromWhere[0].NAZWA.indexOf("KATOWICE")>=0 && userChoice.toWhere[0].NAZWA.indexOf("KATOWICE")>=0)
				)
		{
			//Nie ma innych miast w bazie
			return true;
		}
	}
	else {return false;}
}
// Funkcja, zapisująca dane wybrane przez użytkownika z odpowiednich pól tj. miasto wylotu, przylotu oraz data wylotu
function init(){
	return{
		fromWhere:function(){
			var x;
			x=document.getElementsByClassName("skad")[0].value;
			var getCity= alasql(`
			SELECT NAZWA FROM MIASTA WHERE NAZWA LIKE '%`+x+`%'`);
			
			return getCity;
			
			
		},
		toWhere:function(){
		var x;
			x=document.getElementsByClassName("dokad")[0].value;
			var getCity= alasql(`
			SELECT NAZWA FROM MIASTA WHERE NAZWA LIKE '%`+x+`%'`);
			return getCity;
		},
		fromData:function(){
		var x;
			x=document.getElementsByClassName("data-skad")[0].value;
			return x;
		}
		
	}
}
// Funkcja, która jest konstruktorem implementującym wybrane przez użytkownika dane tj. miasto wylotu, przylotu oraz data wylotu
function userData(){
	
	this.fromWhere =init().fromWhere();
	this.toWhere =init().toWhere();
	this.fromData =init().fromData();
	this.hour=null;
	
	}
//Akcja dla kliknięcia przycisku "POWRÓT" 
function goBack(){

	document.getElementsByClassName("w3-content")[0].innerHTML=`
	 <div class="w3-container w3-content w3-padding-32" style="max-width:800px" id="contact">
    <h2 class="w3-wide w3-center">Rezerwacja lotów</h2>
    <p class="w3-opacity w3-center"><i>Twoja podróż marzeń!</i></p>
    <div class="w3-row w3-padding-16">
     
      <div class="w3-col m12">
       
          <div class="w3-row-padding" style="margin:0 -16px 8px -16px">
            <div class="w3-half">
			
			
			<div class="dropdown">
 
              <input class="skad w3-input w3-border" type="text" placeholder="Miejsce wylotu" data-name="Od"  name="Od">
			  <div class="skad-dropdown-content">
			  </div>
			</div>

            </div>
		
            <div class="w3-half w3-margin-bottom">
			<div class="dropdown">
              <input class="dokad w3-input w3-border" type="text" placeholder="Miejsce przylotu" required data-name="Do" name="Do">
			   <div class="dokad-dropdown-content">
			  </div>
			</div>
            </div>
			
			 <div class="w3-half ">
          
			Data wylotu
			
			<input class="data-skad w3-input w3-border" id="from-where" type="date" data-name="Data" value="2017-08-14" placeholder="Data"  name="Data">
			<!-- trzeba dodac required-->
		  </div>
		   
		  <div class="w3-center">
          <button class="szukaj w3-button w3-wide w3-xlarge w3-black w3-section" type="text">Szukaj lotu</button>
		  </div>
		   </div>
      
      </div>
    </div>
  </div>
	`;
	setup();
	userChoice=null;
}