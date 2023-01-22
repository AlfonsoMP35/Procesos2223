/**
 * @function Tablero
 * @param {int} size Tamaño del tablero
 */
 function Tablero(size) {
    this.size = size; //filas = columnas
	this.placingOnGrid=false;
	this.nombreBarco;
    this.flota;
    
    

    /**
     * Función de inicialización
     */
    this.ini=function(){
        var humanCells = document.querySelector('.human-player').childNodes;
		for (var k = 0; k < humanCells.length; k++) {
			humanCells[k].self = this;
			humanCells[k].addEventListener('click', this.placementListener, false);
			//humanCells[k].addEventListener('mouseover', this.placementMouseover, false);
			//humanCells[k].addEventListener('mouseout', this.placementMouseout, false);
		}

		var computerCells = document.querySelector('.computer-player').childNodes;
		for (var j = 0; j < computerCells.length; j++) {
			computerCells[j].self = this;
			computerCells[j].addEventListener('click', this.shootListener, false);
		}
    }
    //manejadores (click en el tablero propio, click en el tablero rival)
    //updateCell (actualiza las celdas)

    this.crearGrid = function() {
		var gridDiv = document.querySelectorAll('.grid');	

		for (var grid = 0; grid < gridDiv.length; grid++) {
			for (var i = 0; i < this.size; i++) {
				for (var j = 0; j < this.size; j++) {
					var el = document.createElement('div');
					el.setAttribute('data-x', j);
					el.setAttribute('data-y', i);
					el.setAttribute('class', 'grid-cell grid-cell-' + j + '-' + i);
					gridDiv[grid].appendChild(el);
				}
			}
		}
		this.ini();
	};

    this.placementListener = function(e) {
		var self = e.target.self;
		if (self.placingOnGrid) {
			// Extract coordinates from event listener
			var x = parseInt(e.target.getAttribute('data-x'), 10);
			var y = parseInt(e.target.getAttribute('data-y'), 10);
			console.log("Barco: " +self.nombreBarco+" x: "+x+" y: "+y);
			
			self.colocarBarco(x, y, self.nombreBarco);
			//var successful = self.colocarBarco(self.nombreBarco, x, y);

		}
	};

	this.asignarFlotaListener=function(){
		var playerRoster = document.querySelector('.fleet-roster').querySelectorAll('li');
		for (var i = 0; i < playerRoster.length; i++) {
			playerRoster[i].self = this;
			playerRoster[i].addEventListener('click', this.rosterListener, false);
		}
	}

	this.shootListener = function(e) {
		var x = parseInt(e.target.getAttribute('data-x'), 10);
		var y = parseInt(e.target.getAttribute('data-y'), 10);
		console.log("Disparo en x: "+x+" y: "+y);
		cws.disparar(x,y);	
	};

	
	/** Mostrar la flota */
	this.mostrarFlota=function(){
		$('#mER').remove();
		$("#listaF").remove();
		let cadena='<ul class="fleet-roster" id="listaF">';
		for (let key in this.flota){
			cadena=cadena+"<li id='"+key+"'>"+key+"</li>"
		}
		cadena=cadena+"</ul>";
		$('#flota').append(cadena);
		//<ul>
		//	cadena=cadena+'<li id="b2">b2</li>'
		//</ul>
		this.asignarFlotaListener();
	}

	this.colocarBarco=function(x,y,nombre){
		console.log("Barco: " +nombre+" x: "+x+" y: "+y);
		cws.colocarBarco(nombre,x,y);
	}

	this.endPlacing = function(shipType) {
		document.getElementById(shipType).setAttribute('class', 'placed');
		self.placingOnGrid = false;
	};

	this.rosterListener = function(e) {
		var self = e.target.self;
		var cli=this;
		// Remove all classes of 'placing' from the fleet roster first
		var roster = document.querySelectorAll('.fleet-roster li');
		for (var i = 0; i < roster.length; i++) {
			var classes = roster[i].getAttribute('class') || '';
			classes = classes.replace('placing', '');
			roster[i].setAttribute('class', classes);
		}
		
		// Set the class of the target ship to 'placing'
		self.nombreBarco = e.target.getAttribute('id');
		document.getElementById(self.nombreBarco).setAttribute('class', 'placing');
		//Game.placeShipDirection = parseInt(document.getElementById('rotate-button').getAttribute('data-direction'), 10);
		self.placingOnGrid = true;
	};

    this.updateCell = function(x, y, type,targetPlayer) {
		var player=targetPlayer;
		var classes = ['grid-cell', 'grid-cell-' + x + '-' + y, 'grid-' + type];
		document.querySelector('.' + player + ' .grid-cell-' + x + '-' + y).setAttribute('class', classes.join(' '));
	};

	this.puedesColocarBarco=function(barco, x, y){
		console.log(barco);
		for(i=0;i<barco.tam;i++){
			this.updateCell(x+i,y,'ship','human-player');
		}
		this.endPlacing(barco.nombre);

	};

	this.elementosGrid=function(){
		$('#eG').remove();
		let cadena='<div class="game-container" id="eG">';
		cadena=cadena+'<div id="roster-sidebar">';
	 	cadena=cadena+'<h4>Barcos</h4><div id="flota"></div></div><div class="grid-container"><h2>Tu flota</h2>';
		cadena=cadena+'<div class="grid human-player"></div></div><div class="grid-container">';
		cadena=cadena+'<h2>Flota enemiga</h2><div class="grid computer-player"></div></div></div>';
		$('#inicio').append(cadena);
		this.crearGrid();
	}
}

//colocar en el indes.html los class grid
//cargar en el index.html los estilos