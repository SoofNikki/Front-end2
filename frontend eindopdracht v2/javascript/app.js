// Instantie - Nieuwe versie van een blauwdruk (eigenlijk gewoon een variable)
// Object literal kan je maar 1 keer tegelijk gebruiken, object constructor kun je vaker gebruiken. Er wordt steeds een nieuwe versie van de blauwdruk gemaakt. -> zie instantie. 
// var Persoon heeft als propertie twee benen, en als methode (functie) lopen. 
// Parameter is iets wat je mee geeft aan een functie

//namespace > domready Checkt of namespace (een scope) bestaat, of hij maakt een nieuw object aan met naam APP
var APP = APP || {};

//anonieme functie self invoking functie, voert zichzelf gelijk uit
(function () {

/* breakdown
- APP	
	- Settings
	- Controller
		- Init
		
	- Data
		- Post
	- Router
		- Ranking
		- Schedule
		- Game
		- All
	- Page
	- Directives
		- Schedule
	- Domready
*/

// nieuwe variabele loader wordt aangemaakt, wordt gekoppeld aan div id cirlceG.
var loader = document.getElementById('circleG'); 

// Nieuwe variable mySwiper wordt aangemaakt. mySwiper is nieuwe instantie van het object Swiper. Dit object constructor wordt in een ander bestandje aangemaakt. Nieuw object Swiper wordt aangemaakt met twee parameters. 
var mySwiper = new Swiper ('.swiper-container',{ 
	mode:'horizontal',
	loop: false
});
	
	// Controller Init object literal
	APP.controller = {
		init: function () {
			// Initialize router
			// hier voert die router uit
			APP.router.init();
			APP.button.init();
		}
	};
	
	APP.button = {	
		init: function () {
			//nieuwe variabel die id submit pakt
			var button = document.getElementById('submit');	
			//anonieme functie wordt aangeroepen als er geklikt wordt op div submit. Functie start.  
			button.addEventListener('click', function(){
			//zet lader op display block
			loader.style.display = 'block';
			
				//pakt waarden van input velden
				var value1 = document.getElementById('team1score').value; 
				var value2 = document.getElementById('team2score').value; //Value is een standaard JS ding wat waardes uit het inputveld ophaalt
				
				//Get game_id
					//pakt url, maakt er een string van en koppelt dit aan de nieuwe variabele url
					var url = window.location.toString();
					//split de variable url bij elke slash en koppelt dit aan de nieuwe variable array
					var array = url.split("/");
					//van de hele array, pakt hij de achterste
					// Een array begint altijd te tellen bij nul, length begint altijd te tellen bij 1. Dus om het laatste stukje url te kunnen selecteren kun je niet -0 doen maar -1. 
					var game_id = array[array.length - 1];
					
					//voert methode post uit
					APP.data.post({
						game_id: game_id,
						team_1_score: value1,
						team_2_score: value2,
						is_final: 'True'
					});
			});
		}
	}
	
	APP.data = {
		post: function(postData) {
            var url = 'https://api.leaguevine.com/v1/game_scores/';
			
			//maakt string van postdata
            var postData = JSON.stringify(postData);
			console.log(postData);
			
            // Create request
			//request naar bepaalde url
            var xhr = new XMLHttpRequest();
            xhr.open('POST',url,true);
			
			//Check for response
			//houd verbinding van request in de gaten, op moment dat verbinding is verandert, bij 4 = response terug, als die response 201 is voer uit
				xhr.onreadystatechange = function() {
					if (xhr.readyState == 4 && xhr.status == 201) {
						//Hide the loader
						loader.style.display = 'none';
						//voer router change uit
						APP.router.change('schedule');
						
					} else if (xhr.readyState == 4) {
						alert('Er is iets fout gegaan tijdens het posten');
				}
			};
			// Set request headers
			//aan te geven wat voor type die mee stuurt/ dit geval jason
            xhr.setRequestHeader('Content-type','application/json');
			//authorisatie van de post, met access token
            xhr.setRequestHeader('Authorization','bearer 82996312dc');
                        
            // Send request (with data as a json string)
            xhr.send(postData);
		},
	};

	// Router
	APP.router = {
		init: function () {
	  		routie({
			    '/game/:game_id': function(game_id) { // "Hey routie, er is een stukje url met /game, maar daarachter wordt ook nog een game_id meegegeven. Als je deze gevonden hebt, voer een anonieme functie uit, maar geef wel het game_id mee!"
			    	APP.page.game(game_id);
				},
			    '/ranking': function() {
			    	APP.page.ranking(); // Voer het object page met methode ranking uit
					mySwiper.swipeTo(0,1000); // Ga naar 0e pagina met een swipe van 1000ms = 1sec
			    },

			    '/schedule': function() {
			    	APP.page.schedule();
					mySwiper.swipeTo(1,1000);
			    },
				'*': function() {
			    	APP.page.ranking();
			    	mySwiper.swipeTo(0,1000);
			    }
			});
		},

		change: function (section_name) { // Methode change wordt uitgevoerd en section name wordt meegegeven 
            var sections = qwery('section'), // Variabele sections wordt aangemaakt en selecteerd alle sections
                section = qwery('[data-route=' + section_name + ']')[0]; // Haal uit de html data-route + de section naam

            // Show active section, hide all other
            if (section) {
            	for (var i=0; i < sections.length; i++){ //met sections.length geeft ie het aantal resultaten in de array terug. In dit geval is dat altijd 3. i=0 is kleiner dan 3, dus de class active wordt weggehaald en i wordt 1. etc. 
            		sections[i].classList.remove('active');
            	}
            	section.classList.add('active'); // Op het moment dat i=3 dan is i niet meer kleiner dan sections.length dan wordt er aan 1 sections de class active toegevoegd
            }
		}
	};

	// Pages
	APP.page = {	
		game: function (game_id) {
			loader.style.display = 'block';
		promise.get('https://api.leaguevine.com/v1/games/'+game_id+'/?access_token=82996312dc').then(function(error, data, xhr) {
				if (error) {
					alert('Error er gaat iets fout ' + xhr.status);
					return; // stopt functie
				}
				
				data = JSON.parse(data); // krijgt data terug van url en maakt er bruikbare/ leesbare data van. 
				console.log(data);
			
				Transparency.render(qwery('[data-route=game]')[0], data); // bind data aan data-route game
				APP.router.change('game');
				loader.style.display = 'none';
			});
		},

		schedule: function () {
		loader.style.display = 'block';
			promise.get('https://api.leaguevine.com/v1/games/?tournament_id=19389&access_token=82996312dc').then(function(error, data, xhr) {
				if (error) {
					alert('Error ' + xhr.status);
					return;
				}
				//van parse maakt ie er een json object van
				data = JSON.parse(data);
				console.log(data);
			
				var directives = APP.directives.schedule;
				
				//rendert de data en de directives
				Transparency.render(qwery('[data-route=schedule]')[0], data, directives);
				APP.router.change('schedule');
				loader.style.display = 'none';
			});
		},

		ranking: function () {
		loader.style.display = 'block';
			promise.get('https://api.leaguevine.com/v1/pools/?tournament_id=19389&acces_token=82996312dc').then(function(error, data, xhr) {
				if (error) {
					alert('Error ' + xhr.status);
					return;
				}
				data = JSON.parse(data);
				console.log(data);
			
				Transparency.render(qwery('[data-route=ranking]')[0], data);
				APP.router.change('ranking');
				loader.style.display = 'none';
			});
		}
	}
	
	//Directives geven op moment van update score data bind tegen komt href mee waarin game id meegeeft
	APP.directives = {
		schedule: {
			objects: {
			//loopt af bij binden van de data
				update_score: {
					href: function() {
						return '#/game/' + this.id;
					}
				}
			}
		}
	}
	
	// DOM ready > controller
	domready(function () {
		// start van de applicatie wanneer content geladen is
		APP.controller.init();
	});
})();