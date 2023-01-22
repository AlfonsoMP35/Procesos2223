function ControlWeb(){
	$('body').css('background-color','#FFFFFF');
	
	this.mostrarAgregarUsuario=function(){
		$('#tB').remove();
        $('#tB2').remove();
        $('#tB3').remove();
        $('#tB4').remove();


        //$('#mInf').remove();
        var cadena = "";
        cadena +='<div class="container" id="tB">';
        cadena +=' <div class="row justify-content-center">';
        cadena +=' <h1 style="color: black; font-family: arial;">Batalla Naval</h1>';

        cadena +=' </div>';
        cadena +=' <div class="row">';
        cadena +=' <div class="col-4 mx-auto">';
        cadena +=' <div class="form-group">';
        cadena +=' <label for="usr">Nick:</label>';
        cadena +='<input type="text" class="form-control largo-input" id="usr" placeholder="Introduce tu nick (max 12 letras)" required>';
        cadena +=' </div>';
        cadena +=' <div class="form-group">';
        cadena +=' <button id="btnAU" class="btn btn-primary mb-2">Iniciar sesión</button>';
        cadena +=' <a href="/auth/google" class="btn btn-danger mb-2">Accede con Google</a>';
        cadena +=' </div>';
        cadena +=' </div>';
        cadena +=' </div>';
        cadena +=' <div class="row">';
        cadena +=' <div class="col-4 mx-auto">';
        cadena +=' <div class="alert alert-danger" id="nota" style="display:none"></div>';
        cadena +=' </div>';
        cadena +=' </div>';
        cadena +='</div>';
        cadena +='<img id="tB3" src="cliente/img/batalla-naval.jpg" alt="image" class="img-fluid" style="margin-bottom:20px;">';
        cadena +='<div class="row">';
        cadena +=' <div class="col-12 text-center">';
        cadena +=' <div class="row justify-content-center">';
        cadena +='<div class="row" id="tB4"><h7><strong>Escuela Superior de Ingeniería Informática - UCLM</strong></h7></div>'
        cadena+='</div>';
        cadena += ' </div>';
        cadena += '</div>';

		$("#agregarUsuario").append(cadena);       

		$("#btnAU").on("click",function(e){
			if ($('#usr').val() === '' || $('#usr').val().length>12) {
			    e.preventDefault();
			    $('#nota').append('Nick inválido');
			}
			else{
				var nick=$('#usr').val();
				$("#tB").remove();
				$("#tB2").remove();
                $('#tB3').remove();
                $('#tB4').remove();

				
				rest.agregarUsuario(nick);
				
			}
		})
	}
	this.mostrarHome=function(){
		$('#mH').remove();
        $('#eG').remove();
        let cadena = '<div class="row" id="mH">';
        cadena=cadena +'<div class="col">';
        cadena=cadena +'<div class="card">';
        cadena=cadena +'<div class="card-header" >';
        cadena=cadena +'Bienvenido ' + rest.nick;
        cadena=cadena +'</div>';
        cadena=cadena +'<div class="card-body">';
        cadena=cadena +'<button id="botS" class="btn btn-danger">Salir</button>';
        cadena=cadena +'<div id="codigo"></div>';
        cadena=cadena +'</div>';
        cadena=cadena +'</div>';
        cadena=cadena +'</div>';
        cadena=cadena +'</div>';
		$('#agregarUsuario').append(cadena);
		this.mostrarCrearPartida();
		rest.obtenerListaPartidasDisponibles();

		$("#botS").on("click",function(e){
			$("#mCP").remove();
			$('#mLP').remove();
			$('#mH').remove();
			$.removeCookie("nick");
			iu.comprobarCookie();
			rest.usuarioSale();
			$('#eG').remove();
		});
	}
	
	this.mostrarCrearPartida=function(){
		$('#mCP').remove();
		let cadena= '<div class="row" id="mCP">';//'<form class="form-row needs-validation"  id="mAJ">';
        cadena=cadena+'<div class="col">';
        cadena=cadena+'<button id="btnCP" class="btn btn-primary mb-2 mr-sm-2">Crear partida</button>';
        cadena=cadena+'</div>';
        cadena=cadena+'</div>';
        $('#crearPartida').append(cadena);

        $("#btnCP").on("click",function(e){		
			$("#mCP").remove();
			$('#mLP').remove();
			$('#botS').remove();
			//rest.crearPartida(); //Llamada a rest
			cws.crearPartida(); //Llamada al socket
		})
	}
	this.mostrarCodigo=function(codigo){
		let cadena="Codigo de la partida: " + codigo;
		$('#codigo').append(cadena);
		iu.mostrarAbandonar();
	}

	this.mostrarAbandonar = function(){
		$('#mAbP').remove();
		let cadena = '<div class="row" id="mAbP">';
		cadena = cadena + '<div style="margin-top:15px" class="col">'
		cadena = cadena + '<button id="botAP" class="btn btn-danger mb-2 mr-sm-2">Abandonar Partida</button>';
		cadena = cadena + '</div> </div>'
		$('#codigo').append(cadena);
		$("#botAP").on("click", function (e) {
		cws.abandonarPartida();
	   })

   }

	this.finPartida=function(){
		$('#mH').remove()
		cws.codigo = undefined;
		$('#eG').remove();
		tablero = new Tablero(10);
		this.mostrarHome()
	}

	this.mostrarListaDePartidas=function(lista){
		$('#mLP').remove();
		let cadena="<div id='mLP'>";
		cadena=cadena+'<ul class="list-group">';
		for(i=0;i<lista.length;i++){
		  cadena = cadena+'<li class="list-group-item">'+lista[i].codigo+' propietario: '+lista[i].owner+'</li>';
		}
		cadena=cadena+"</ul>";
		cadena=cadena+"</div>"
		$('#listaPartidas').append(cadena);
		
	}

	this.mostrarListaDePartidasDisponibles=function(lista){
		$('#mLP').remove();
		let cadena="<div class='container' id='mLP'>";
		cadena += "<div class='row'>"
		cadena += "<div class='col-11'><h3 class='text-center'>Lista de partidas disponibles</h3></div>"
		cadena += "</div>"
		cadena += "<div class='row'>"
		cadena += "<div class='col-11'>"
		cadena += '<ul class="list-group">';
		for(i=0;i<lista.length;i++){
		  cadena += '<li class="list-group-item"><a href="#" class="btn btn-success" value="'+lista[i].codigo+'"> Nick propietario: '+lista[i].owner+'</a></li>';
		  cadena += '<li class="list-group-item centrado"> Codigo de la partida: '+lista[i].codigo+ '</li>';
		}
		cadena += "</ul>";
		cadena += "</div> </div> </div>"
		
		$('#listaPartidas').append(cadena);

		$(".list-group a").click(function(){
			codigo=$(this).attr("value");
			   console.log(codigo);
			if (codigo){
				$('#mLP').remove();
				$('#mCP').remove();
				$('#botS').remove();
				cws.unirseAPartida(codigo);
			}
		});	
		$("#btnAL").on("click",function(e){		
			rest.obtenerListaPartidasDisponibles();
		})	
	}

	this.mostrarEsperandoRival = function(){
		$('#mER').remove();
		$('#mLP').remove();
		let cadena = '<div class="row" id="mER" style="text-align: center;">';
		cadena = cadena + '<div style="margin-top:15px" class="col">'
		cadena = cadena + '<img src="cliente/img/loading.gif" alt="Esperando rival" width="200" height="200">';
		cadena = cadena + '<p class="text-style">Esperando Rival</p>'
		cadena = cadena + '</div>'
		cadena = cadena + '</div>'
		$('#codigo').append(cadena);

		  
	}

	this.comprobarCookie=function(){
		if($.cookie("nick")){
			rest.nick=$.cookie("nick");
			rest.comprobarUsuario();
		}else{
			this.mostrarAgregarUsuario();
		}
	}

	this.mostrarModal=function(titulo,msg){
		$('#cT').remove();
		$('#cM').remove();		
		var cadena="<div id='cT'>"+titulo+"</div>";
		cadmsg="<p id='cM'>"+msg+"</p>";
		$('#titulo').append(cadena);
		$('#contenidoModal').append(cadmsg);
		$('#miModal').modal("show");
	}


}