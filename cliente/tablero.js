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
        var playerRoster = document.querySelector('.fleet-roster').querySelectorAll('li');
		for (var i = 0; i < playerRoster.length; i++) {
			playerRoster[i].self = this;
			playerRoster[i].addEventListener('click', this.rosterListener, false);
		}

		var computerCells = document.querySelector('.computer-player').childNodes;
		for (var j = 0; j < computerCells.length; j++) {
			computerCells[j].self = this;
			computerCells[j].addEventListener('click', this.shootListener, false);
		}

    }

    /**
     * Mostrar el tablero
     */
    this.mostrarTablero=function(){
		let x=document.getElementById("tablero");
		if (si){
			x.style.display="block";
		}
		else{
			x.style.display="none";
		}

    }

    //manejadores (click en el tablero propio, click en el tablero rival)
    //updateCell (actualiza las celdas)

    this.crearGrid = function() {
		var gridDiv = document.querySelectorAll('.grid');	

		for (var grid = 0; grid < gridDiv.length; grid++) {
			//gridDiv[grid].removeChild(gridDiv[grid].querySelector('.no-js')); // Removes the no-js warning
			/*let myNode=gridDiv[grid];
			while (myNode.lastElementChild) {
			    myNode.removeChild(myNode.lastElementChild);
			  }*/
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
			
			// Don't screw up the direction if the user tries to place again.
			var successful = self.colocarBarco(self.nombreBarco, x, y);

		}
	};

	this.shootListener = function(e) {

		// Extract coordinates from event listener
		var x = parseInt(e.target.getAttribute('data-x'), 10);
		var y = parseInt(e.target.getAttribute('data-y'), 10);
		console.log("Disparo en x: "+x+" y: "+y);
		cws.disparar(x,y);	
	};



	this.colocarBarco=function(nombre,x,y){
		console.log("Barco: " +nombre+" x: "+x+" y: "+y);
		cws.colocarBarco(nombre,x,y);
	}

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

	/*this.terminarDeColocarBarco=function(barco,x,y){
		for(i=0;i<barco.tam;i++){
			console.log("x: "+(x+i)+" y:"+y);
			this.updateCell(x+i,y,"ship",'human-player');
		}
		self.endPlacing(barco.nombre);
	}*/

	this.endPlacing = function(shipType) {
		document.getElementById(shipType).setAttribute('class', 'placed');
		this.nombreBarco = '';
	};


    this.updateCell = function(x, y, type,targetPlayer) {
		var player=targetPlayer;
		var classes = ['grid-cell', 'grid-cell-' + x + '-' + y, 'grid-' + type];
		document.querySelector('.' + player + ' .grid-cell-' + x + '-' + y).setAttribute('class', classes.join(' '));
	};

	this.puedesColocarBarco=function(barco, x, y){
		//obtener el barco a partir del nombre
		//bucle del tamaño del barco que marque las celdas
		//let barco = this.flota[data.nombre];
		console.log(barco);
		for(i=0;i<barco.tam;i++){
			this.updateCell(x+i,y,'ship','human-player');
		}
		//this.placingOnGrid=false;
		this.endPlacing(barco.nombre);

	};


    this.crearGrid();
	//this.mostrar(false);
}

//colocar en el indes.html los class grid
//cargar en el index.html los estilos