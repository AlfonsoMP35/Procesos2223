function ClienteRest(){
	this.nick;

    this.agregarUsuario=function(nick){
		var cli=this;
		$.getJSON("/agregarUsuario/"+nick,function(data){  //Conexión con el API REST
			//se ejecuta cuando conteste el servidor
			console.log(data);
			if (data.nick!=-1){
                console.log("Usuario " + data.nick + " registrado");
				cli.nick=data.nick;
				//ws.nick=data.nick;
				$.cookie("nick",data.nick);
				cws.conectar();		//Activa la conexión del socket de clienteWS
				iu.mostrarHome();//iu.mostrarHome(data.nick)
			}
			else{
                console.log("No se ha podido registrar el usuario");
				iu.mostrarModal("El nick ya está en uso");
				iu.mostrarAgregarUsuario();
			}
		});

        //Todavía no estoy seguro de que haya contestado el servidor
        //Lo que pongas aqui se ejecuta a la vez que la llamada
	}

    this.crearPartida=function(){
		var cli=this;
		let nick=cli.nick;
		$.getJSON("/crearPartida/"+nick,function(data){  //Conexión con el API REST
			//se ejecuta cuando conteste el servidor
            this.nick = nick;
            
			console.log(data);
			if (data.codigo!=-1){
                console.log(nick + " ha creado una partida. Codigo de la partida: " + data.codigo );
				iu.mostrarCodigo(data.codigo);
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


    this.unirseAPartida=function(codigo){
		var cli=this;
		$.getJSON("/unirseAPartida/"+cli.nick+"/"+codigo,function(data){  //Conexión con el API REST
			//se ejecuta cuando conteste el servidor
           /* this.nick = nick;
            this.codigo = codigo;*/
            
			console.log(data);
			if (data.codigo!=-1){
                console.log(cli.nick + " se ha unido a la partida. Codigo: " + data.codigo );
				iu.mostrarCodigo(data.codigo);
				//ws.nick=data.nick;
				//$.cookie("nick",ws.nick);
				//iu.mostrarHome(data);
			}
			else{
                console.log("No se ha podido unir a partida.");
				//iu.mostrarModal("El nick ya está en uso");
				//iu.mostrarAgregarJugador();
			}
		});

	}

	this.obtenerListaPartidas=function(){
		let cli=this;
		//obtenerPartidasDisponibles
		$.getJSON("/obtenerPartidas",function(lista){
			console.log(lista);
			iu.mostrarListaDePartidas(lista);
		});
	}

	this.obtenerListaPartidasDisponibles=function(){
		let cli=this;
		$.getJSON("/obtenerPartidasDisponibles",function(lista){
			console.log(lista);
			iu.mostrarListaDePartidasDisponibles(lista);
		});
	}

	this.usuarioSale=function(){
		let nick=this.nick;
		$.getJSON("/salir/"+nick,function(){
			$.removeCookie("nick");
			iu.comprobarCookie();
		})
	}

	//////////////////////////////////////////////////
	/*this.usuarioAbandona=function(){

	}*/

}

