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

    //gestionar peticiones
    this.servidorWS=function(){
        let cli=this;

        this.socket.on("partidaCreada", function(data){
            console.log(data);
            if(data.codigo!=1){
                console.log(cli.nick + " se ha unido a la partida. Codigo: " + data.codigo);
                iu.mostrarCodigo(data.codigo);
                cli.codigo=data.codigo;
            }
            else{
                console.log("No se ha podido crear partida");
                iu.mostrarModal("No se ha podido crear partida");
				iu.mostrarCrearPartida();
            }

        });

        this.socket.on("unidoAPartida", function(nick,codigo){
            console.log(codigo);
			if (codigo!=-1){
                console.log(rest.nick + " se ha unido a la partida. Codigo: " + data.codigo );
				iu.mostrarCodigo(codigo);
                cli.codigo=data.codigo;
			}
			else{
                console.log("No se ha podido unir a partida.");

			}

        });

        this.socket.on("actualizarListaPartidas", function(lista){
            if(!cli.codigo){
                iu.mostrarListaDePartidasDisponibles(lista);
            }
        });

        this.socket.on("aJugar",function(){
			iu.mostrarModal("A jugaaar!");
		})

    }

}