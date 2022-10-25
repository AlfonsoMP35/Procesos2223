function ServidorWS(){

    //enviar peticiones
    //Responde solo al que envia la petición
    this.enviarAlRemitente=function(socket,mensaje,datos){
		socket.emit(mensaje,datos);
	}

    //Enviar un mensaje a un grupo de usuarios
    this.enviarATodosEnPartida=function(io,codigo,mensaje,datos){
		io.sockets.in(codigo).emit(mensaje,datos)
	}



    //gestionar peticiones
    this.lanzarServidorWS=function(io,juego){
        let cli=this;
        io.on('conection', (socket) => {
            console.log('Usuario conectado');

            socket.on("crearPartida",function(nick){
                let res = juego.jugadorCrearPartida(nick);
                socket.join(res.codigo);
                cli.enviarAlRemitente(socket, "partidaCreada", res);
            });

            socket.on("unirseAPartida",function(nick,codigo){
                let res = juego.jugadorSeUneAPartida(nick,codigo);
                cli.enviarAlRemitente(socket, "unidoAPartida", res);
                socket.join(res.codigo);
                
                //Comprueba que la partida puede comenzar
                let partida=juego.obtenerPartida(codigo);
                if(partida.fase.esJugando()){
                    XMLSerializer.enviarATodosEnPartida(io,codigo,"aJugar",{});
                }
            });
            
        });

    }

}

module.exports.ServidorWS=ServidorWS;