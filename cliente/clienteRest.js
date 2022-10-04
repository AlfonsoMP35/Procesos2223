function ClienteRest(){

    this.agregarUsuario=function(nick){
		var cli=this;
		$.getJSON("/agregarUsuario/"+nick,function(data){  //Conexión con el API REST
			//se ejecuta cuando conteste el servidor
			console.log(data);
			if (data.nick!=-1){
                console.log("Usuario " + data.nick + " registrado");
				//ws.nick=data.nick;
				//$.cookie("nick",ws.nick);
				//iu.mostrarHome(data);
			}
			else{
                console.log("No se ha podido registrar el usuario");
				//iu.mostrarModal("El nick ya está en uso");
				//iu.mostrarAgregarJugador();
			}
		});

        //Todavía no estoy seguro de que haya contestado el servidor
        //Lo que pongas aqui se ejecuta a la vez que la llamada
	}

    this.crearPartida=function(nick){
		var cli=this;
		$.getJSON("/crearPartida/"+nick,function(data){  //Conexión con el API REST
			//se ejecuta cuando conteste el servidor
            this.nick = nick;
            
			console.log(data);
			if (data.nick!=-1){
                console.log(nick + " ha creado una partida. Codigo de la partida: " + data.codigo );
				//ws.nick=data.nick;
				//$.cookie("nick",ws.nick);
				//iu.mostrarHome(data);
			}
			else{
                console.log("El usuario ya ha creado una partida.");
				//iu.mostrarModal("El nick ya está en uso");
				//iu.mostrarAgregarJugador();
			}
		});

	}


    this.unirseAPartida=function(nick,codigo){
		var cli=this;
		$.getJSON("/unirseAPartida/"+nick+"/"+codigo,function(data){  //Conexión con el API REST
			//se ejecuta cuando conteste el servidor
            this.nick = nick;
            this.codigo = codigo;
            
			console.log(data);
			if (data.nick!=-1){
                console.log(nick + " se ha unido a la partida. Codigo: " + data.codigo );
				//ws.nick=data.nick;
				//$.cookie("nick",ws.nick);
				//iu.mostrarHome(data);
			}
			else{
                console.log("El usuario ya se ha unido.");
				//iu.mostrarModal("El nick ya está en uso");
				//iu.mostrarAgregarJugador();
			}
		});

	}

}

