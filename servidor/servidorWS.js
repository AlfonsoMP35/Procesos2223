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
        io.on('connection', (socket) => {
            console.log('Usuario conectado');

            socket.on("crearPartida",function(nick){
                let res = juego.jugadorCreaPartida(nick);
                let codigoStr=res.codigo.toString();
                socket.join(codigoStr);
                //cli.enviarAlRemitente(socket, "partidaCreada", res);
                cli.enviarATodosEnPartida(io,codigoStr,"partidaCreada",res);
                cli.enviarAlRemitente(socket, "esperandoRival");
                let lista=juego.obtenerPartidasDisponibles();
                cli.enviarATodos(socket,"actualizarListaPartidas", lista);
            });

			socket.on("unirseAPartida",function(nick,codigo){
                let codigoStr=codigo.toString();
                socket.join(codigoStr);
                let res = juego.jugadorSeUneAPartida(nick,codigo);		  	
                cli.enviarAlRemitente(socket,"unidoAPartida",res);		  	
                let partida=juego.obtenerPartida(codigo);
                
               /* if(partida.esJugando()){
                    cli.enviarATodosEnPartida(io,codigoSTR,"aJugar",{});
                }*/
                if(partida.esDesplegando()){
                    let us = juego.obtenerUsuario(nick);
                    let flota=us.obtenerFlota();
                    let res = {};
                    res.flota = flota;
                    cli.enviarATodosEnPartida(io,codigoStr,"faseDesplegando",res);
                }
            });

            socket.on("abandonarPartida",function(nick,codigo){
                //juego.jugadorAbandona(nick,codigo);
               // cli.enviarATodosEnPartida(io,codigo,"usuarioAbandona",{})
                let jugador = juego.obtenerUsuario(nick);
                let partida = juego.obtenerPartida(codigo)
                let codigoStr = codigo.toString();
                if (jugador && partida) {

                    let rival = partida.obtenerRival(nick);

                         if (rival == undefined) {
                                cli.enviarAlRemitente(socket, "partidaCancelada", { codigoP: codigo })
                                partida.abandonarPartida(jugador);
                                let lista = juego.obtenerPartidasDisponibles();
                                cli.enviarATodos(socket, "actualizarListaPartidas", lista);

                        } else {

                                let res = { codigoP: codigo, nombre: jugador.nick, nombreR: rival.nick }
                                partida.abandonarPartida(jugador);
                                cli.enviarATodosEnPartida(io, codigoStr, "usuarioAbandona", res);
                                socket.leave(codigoStr);

                        }

                }
            });

            socket.on("usuarioSale",function(nick,codigo){
                let lista = juego.obtenerPartidasDisponibles();
              
                res= {jugador:nick} 
                if(codigo){
                    let codigoStr = codigo.toString();              
                    cli.enviarATodosEnPartida(io, codigoStr, "usuarioFuera", res);
                    cli.enviarATodos(socket, "actualizarListaPartidas", lista); 
                }
    
            })

            socket.on("colocarBarco",function(nick,nombre,x,y){
                let us = juego.obtenerUsuario(nick);
                if(us){
                    us.colocarBarco(nombre,x,y);
                    let desplegado=us.obtenerBarcoDesplegado(nombre);
                    let res={barco:nombre, x: x, y: y, colocado: desplegado };
                    cli.enviarAlRemitente(socket,"barcoColocado",res);
                }
            });

            socket.on("barcosDesplegados",function(nick){
                let us = juego.obtenerUsuario(nick);
                if(us){
                    us.barcosDesplegados();
                    let partida=us.partida;
                    if(partida && partida.esJugando()){
                        let res={fase:partida.fase,turno:partida.turno.nick};
                        let codigoStr=partida.codigo.toString();
                        cli.enviarATodosEnPartida(io,codigoStr,"aJugar",res);
                    } 
                }
                else {
                    cli.enviarAlRemitente(socket, "esperandoRival")
                }
            });

            socket.on("disparar",function(nick,x,y){
                let us = juego.obtenerUsuario(nick);
                let partida = us.partida;
                //console.log("Fase:"+partida.fase+ "turno"+ partida.turno.nick)
                if(us && partida.esJugando() && partida.turno.nick==nick){
                    us.disparar(x,y);
                    let estado = us.obtenerEstadoMarcado(x,y);
                    let partida=us.partida;
                    let codigoStr=partida.codigo.toString();
                    let res={impacto:estado,x:x,y:y,turno:partida.turno.nick,atacante: nick};
                    cli.enviarATodosEnPartida(io,codigoStr,"disparo",res);
                    if(partida.fase == "final"){
                        cli.enviarATodosEnPartida(io,codigoStr,"finPartida",res);
                    }
                }
                /*else{
                    cli.enviarAlRemitente(io, "info", "No es tu turno");
                }*/
            });

            
            
        });

    }

}

module.exports.ServidorWS=ServidorWS;