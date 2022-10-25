function ClienteWS(){


    this.socket;
    //enviar peticiones

    //Inicia el socket de clienteWS
    this.conectar=function(){
        this.socket=io();
        this.servidorWS();
    }

    this.crearPartida=function(){
        this.socket.emit("crearPartida",rest.nick);
    }

    //gestionar peticiones
    this.servidorWS=function(){
        let cli=this;

        this.socket.on("partidaCreada", function(data){
            console.log(data);
            if(data.codigo!=1){
                console.log(cli.nick + " se ha unido a la partida. Codigo: " + data.codigo);
                iu.mostrarCodigo(data.codigo);
            }
            else{
                console.log("El usuario ya se ha unido.");
            }

        });

        this.socket.on("unidoAPartida", function(nick,codigo){
            console.log(codigo);
			if (codigo!=-1){
                console.log(nick + " se ha unido a la partida. Codigo: " + codigo );
				iu.mostrarCodigo(codigo);
			}
			else{
                console.log("El usuario ya se ha unido.");

			}

        });

    }

}