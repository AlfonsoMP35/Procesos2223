function ClienteWS(){


    this.socket;
    this.codigo;
    //enviar peticiones

    //Inicia el socket de clienteWS
    this.conectar=function(){
        this.socket=io();
        this.servidorWS();
    }

    this.crearPartida=function(){
        this.socket.emit("crearPartida",rest.nick);
    }

    this.unirseAPartida=function(codigo){
		this.socket.emit("unirseAPartida",rest.nick,codigo);
	}

	this.abandonarPartida=function(){
		this.socket.emit("abandonarPartida",rest.nick,cws.codigo);
	}

    this.salir=function(){
        this.socket.emit("salirPartida",rest.nick);
    }

    this.colocarBarco=function(nombre,x,y){
        this.socket.emit("colocarBarco",rest.nick,nombre,x,y);
    }

    this.barcosDesplegados=function(){
        this.socket.emit("barcosDesplegados",rest.nick);
    }
    
    this.disparar=function(x,y){
        this.socket.emit("disparar",rest.nick,x,y);
    }


    //gestionar peticiones (call back)
    this.servidorWS=function(){
        let cli=this;

        this.socket.on("partidaCreada", function(data){
            console.log(data);
            if(data.codigo!=1){
                console.log(rest.nick + " se ha unido a la partida. Codigo: " + data.codigo);
                iu.mostrarCodigo(data.codigo);
                cli.codigo=data.codigo;
            }
            else{
                console.log("No se ha podido crear partida");
                iu.mostrarModal("No se ha podido crear partida");
				//iu.mostrarCrearPartida();
                rest.comprobarUsuario();
            }

        });

        this.socket.on("unidoAPartida", function(data){
			if (data.codigo!=-1){
                console.log(rest.nick + " se ha unido a la partida. Codigo: " + data.codigo);
				iu.mostrarCodigo(data.codigo);
                cli.codigo=data.codigo;
			}
			else{
                console.log("No se ha podido unir a partida.");
			}

        });

        this.socket.on("usuarioAbandona",function(data){
			iu.mostrarModal("Jugador "+data.nick+" abandona");
			iu.finPartida();
		});

        this.socket.on("usuarioSale",function(data){
			iu.mostrarModal("Jugador "+data.nick+" abandona");
			iu.finPartida();
            rest.usuarioSale();
		});

        this.socket.on("actualizarListaPartidas", function(lista){
            if(!cli.codigo){
                iu.mostrarListaDePartidasDisponibles(lista);
            }
        });

        this.socket.on("aJugar",function(res){
			if (res.fase=="jugando"){
				console.log("A jugar, le toca a: "+res.turno);
			}
		});

        this.socket.on("faseDesplegando",function(data){
            tablero.flota=data.flota; //array asociativo (diccionario)
			//tablero.mostrar(true);
			//tablero.mostrarFlota();//data.flota);
            console.log("Ya puedes desplegar la flota.");
        });

        this.socket.on("disparo",function(res){
			console.log(res.impacto);
			console.log("Turno: "+res.turno);
			if (res.atacante==rest.nick){
				tablero.updateCell(res.x,res.y,res.impacto,'computer-player');
			}
		});

        this.socket.on("info",function(info){
			console.log(info);
		});

        this.socket.on("finPartida",function(res){
			console.log("Fin de la partida");
			console.log("Ganador: "+res.turno);
			iu.mostrarModal("Fin de la partida. Ganador: "+res.turno);
			iu.finPartida();
		});

        this.socket.on("barcoColocado",function(res){
			let barco=tablero.flota[res.barco];
			if (res.colocado){
                tablero.puedesColocarBarco(barco, res.x, res.y);
				//tablero.terminarDeColocarBarco(barco,res.x,res.y);
				cli.barcosDesplegados();
			}
			else{
				iu.mostrarModal("No se puede colocar barco");
			}
		});

    }

}