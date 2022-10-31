function ServidorWS(){

    //enviar peticiones
    //Responde solo al que envia la petición
    this.enviarAlRemitente=function(socket,mensaje,datos){
		socket.emit(mensaje,datos);
	}

    //Enviar un mensaje a un grupo de usuarios (grupos de partida)
    this.enviarATodosEnPartida=function(io,codigo,mensaje,datos){
		io.sockets.in(codigo).emit(mensaje,datos)
	}

    //Enviar un mensaje a todos los usuarios
    this.enviarATodos=function(socket,mens,datos){
        socket.broadcast.emit(mens,datos);
    }




    //gestionar peticiones
    this.lanzarServidorWS=function(io,juego){
        let cli=this;
        io.on('conection', (socket) => {
            console.log('Usuario conectado');

            socket.on("crearPartida",function(nick){
                let res = juego.jugadorCrearPartida(nick);
                let codigoStr=res.codigo.toString();
                socket.join(codigoStr);
                cli.enviarAlRemitente(socket, "partidaCreada", res);
                let lista=juego.obtenerPartidaDisponibles();
                cli.enviarATodos(socket, "actualizarListaPartidas", lista);
            });

            socket.on("unirseAPartida",function(nick,codigo){
                let res = juego.jugadorSeUneAPartida(nick,codigo);
                let codigoStr=res.codigo.toString();           
                socket.join(codigoStr);
                cli.enviarAlRemitente(socket, "unidoAPartida", res);
                
                //Comprueba que la partida puede comenzar
                let partida=juego.obtenerPartida(codigo);
                if(partida.fase.esJugando()){
                    XMLSerializer.enviarATodosEnPartida(io,codigo,"aJugar",{});
                }
            });

           /* socket.on("abandonarPartida", function(nick,codigo){
                
            });*/
            
        });

    }

}

module.exports.ServidorWS=ServidorWS;